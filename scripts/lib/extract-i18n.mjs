import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const productionFile = file => /\.[cm]?[jt]sx?$/.test(file) && !/\.(?:test|spec|type-test|d)\.[cm]?[jt]sx?$/.test(file);

/** Analyze bindings and types, rather than guessing the scope from t's name. */
export function extractMessages(projectRoot) {
  const root = path.resolve(projectRoot);
  const sourceRoot = path.join(root, "src") + path.sep;
  const messageRoot = path.join(root, "src/i18n/messages");
  const translatorFile = path.join(root, "src/i18n/create-translator.ts");
  const config = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile);
  if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  if (parsed.errors.length) throw new Error(parsed.errors.map(error => ts.flattenDiagnosticMessageText(error.messageText, "\n")).join("\n"));
  const files = parsed.fileNames.filter(file => file.startsWith(sourceRoot) && productionFile(file));
  const program = ts.createProgram(files, parsed.options);
  const checker = program.getTypeChecker();
  const catalogs = new Map();
  const diagnostics = [];

  function diagnostic(node, message) {
    const file = node.getSourceFile();
    const { line, character } = file.getLineAndCharacterOfPosition(node.getStart());
    diagnostics.push({ file: path.relative(root, file.fileName), line: line + 1, column: character + 1, message });
  }

  function scopeFromImport(declaration) {
    let node = declaration;
    while (node && !ts.isImportDeclaration(node)) node = node.parent;
    if (!node || !ts.isStringLiteral(node.moduleSpecifier)) return undefined;
    const specifier = node.moduleSpecifier.text;
    const resolved = specifier.startsWith("@/")
      ? path.join(root, "src", specifier.slice(2))
      : path.resolve(path.dirname(node.getSourceFile().fileName), specifier);
    const relative = path.relative(messageRoot, resolved).split(path.sep);
    return relative.length === 2 && relative[0] === "ko" && /^[a-z0-9-]+\.json$/.test(relative[1])
      ? relative[1].slice(0, -5) : undefined;
  }

  function collectScopes(node, scopes, visited = new Set()) {
    if (!node) return;
    if (ts.isIdentifier(node)) {
      const symbol = checker.getSymbolAtLocation(node);
      if (symbol && !visited.has(symbol)) {
        visited.add(symbol);
        for (const declaration of symbol.declarations ?? []) {
          const scope = scopeFromImport(declaration);
          if (scope) scopes.add(scope);
        }
        const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
        for (const declaration of target.declarations ?? []) {
          if (ts.isTypeAliasDeclaration(declaration) && declaration.getSourceFile().fileName.startsWith(sourceRoot)) {
            collectScopes(declaration.type, scopes, visited);
          }
        }
      }
    }
    ts.forEachChild(node, child => collectScopes(child, scopes, visited));
  }

  function scopesFromType(expression) {
    const scopes = new Set();
    const visited = new Set();
    function visit(type) {
      if (visited.has(type)) return;
      visited.add(type);
      for (const symbol of [type.aliasSymbol, type.symbol]) {
        for (const declaration of symbol?.declarations ?? []) {
          if (ts.isTypeAliasDeclaration(declaration)) collectScopes(declaration.type, scopes);
        }
      }
      for (const argument of type.aliasTypeArguments ?? []) visit(argument);
      if (type.isUnionOrIntersection()) for (const member of type.types) visit(member);
    }
    visit(checker.getTypeAtLocation(expression));
    return scopes;
  }

  function isFactory(expression) {
    let symbol = checker.getSymbolAtLocation(expression);
    if (symbol?.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    return symbol?.declarations?.some(declaration =>
      ts.isFunctionDeclaration(declaration) && declaration.name?.text === "createTranslator"
      && declaration.getSourceFile().fileName === translatorFile);
  }

  function translator(expression, visited = new Set()) {
    if (ts.isParenthesizedExpression(expression) || ts.isAsExpression(expression) || ts.isNonNullExpression(expression)) {
      return translator(expression.expression, visited);
    }
    if (ts.isCallExpression(expression) && isFactory(expression.expression)) {
      const scopes = expression.arguments[0] ? scopesFromType(expression.arguments[0]) : new Set();
      for (const type of expression.typeArguments ?? []) collectScopes(type, scopes);
      return { scopes };
    }
    let symbol = checker.getSymbolAtLocation(expression);
    if (symbol?.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    if (!symbol || visited.has(symbol)) return undefined;
    visited.add(symbol);
    for (const declaration of symbol.declarations ?? []) {
      if (ts.isVariableDeclaration(declaration) && declaration.initializer) {
        const result = translator(declaration.initializer, visited);
        if (result) return result;
      }
      if (ts.isParameter(declaration) && declaration.type) {
        const type = checker.getTypeAtLocation(declaration);
        if (!checker.getSignaturesOfType(type, ts.SignatureKind.Call).length) continue;
        const scopes = new Set();
        collectScopes(declaration.type, scopes);
        if (scopes.size) return { scopes };
      }
    }
    return undefined;
  }

  for (const file of program.getSourceFiles().filter(file => files.includes(file.fileName))) {
    for (const error of program.getSyntacticDiagnostics(file)) {
      const { line, character } = file.getLineAndCharacterOfPosition(error.start ?? 0);
      diagnostics.push({ file: path.relative(root, file.fileName), line: line + 1, column: character + 1,
        message: ts.flattenDiagnosticMessageText(error.messageText, "\n") });
    }
    function visit(node) {
      if (ts.isCallExpression(node)) {
        const binding = translator(node.expression);
        if (binding) {
          const key = node.arguments[0];
          if (binding.scopes.size !== 1) diagnostic(node, "번역 영역을 하나로 결정할 수 없습니다. 메시지 타입을 명시하세요.");
          else if (!key || !(ts.isStringLiteral(key) || ts.isNoSubstitutionTemplateLiteral(key))) {
            diagnostic(node, "자동 추출에는 문자열 리터럴 키가 필요합니다.");
          } else {
            const scope = [...binding.scopes][0];
            if (!catalogs.has(scope)) catalogs.set(scope, new Map());
            const keys = catalogs.get(scope);
            if (!keys.has(key.text)) keys.set(key.text, []);
            const { line } = file.getLineAndCharacterOfPosition(key.getStart());
            keys.get(key.text).push({ file: path.relative(root, file.fileName), line: line + 1 });
          }
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(file);
  }
  return { catalogs: Object.fromEntries([...catalogs].sort(([a], [b]) => a.localeCompare(b)).map(([scope, keys]) =>
    [scope, Object.fromEntries([...keys].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0))])), diagnostics };
}

export function readLocales(projectRoot) {
  const file = path.join(projectRoot, "src/i18n/config.ts");
  const ast = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
  let locales;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === "locales") {
      let value = node.initializer;
      while (value && (ts.isAsExpression(value) || ts.isParenthesizedExpression(value))) value = value.expression;
      if (value && ts.isArrayLiteralExpression(value) && value.elements.every(ts.isStringLiteral)) locales = value.elements.map(item => item.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  if (!locales?.includes("ko") || locales.some(locale => !/^[a-zA-Z0-9-]+$/.test(locale)) || new Set(locales).size !== locales.length) {
    throw new Error("config.ts의 locales에는 ko를 포함한 중복 없는 언어 목록이 필요합니다.");
  }
  return locales;
}

/** Validate the entire plan before writing; preserve translations and unused keys. */
export function planUpdates(projectRoot, extraction, locales = readLocales(projectRoot)) {
  if (extraction.diagnostics.length) throw new Error("추출 오류가 있어 리소스를 변경할 수 없습니다.");
  const updates = [];
  for (const [scope, keys] of Object.entries(extraction.catalogs)) {
    if (!/^[a-z0-9-]+$/.test(scope)) throw new Error(`잘못된 번역 영역: ${scope}`);
    for (const locale of locales) {
      if (!/^[a-zA-Z0-9-]+$/.test(locale)) throw new Error(`잘못된 언어: ${locale}`);
      const file = path.join(projectRoot, "src/i18n/messages", locale, `${scope}.json`);
      const original = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : undefined;
      const messages = original === undefined ? {} : JSON.parse(original);
      if (!messages || Array.isArray(messages) || typeof messages !== "object" || Object.values(messages).some(value => typeof value !== "string")) {
        throw new Error(`문자열 번역 객체가 아닙니다: ${file}`);
      }
      const next = Object.assign(Object.create(null), messages);
      const added = Object.keys(keys).filter(key => !own(messages, key));
      for (const key of added) next[key] = locale === "ko" ? key : "";
      updates.push({ file, scope, locale, original, added,
        unused: Object.keys(messages).filter(key => !own(keys, key)),
        content: JSON.stringify(next, null, 2) + "\n" });
    }
  }
  return updates;
}

export function writeUpdates(updates) {
  // Check every input before the first write to avoid overwriting concurrent edits.
  for (const update of updates) {
    const current = fs.existsSync(update.file) ? fs.readFileSync(update.file, "utf8") : undefined;
    if (current !== update.original) throw new Error(`추출 이후 파일이 변경됐습니다: ${update.file}`);
  }
  for (const update of updates.filter(update => update.added.length)) {
    fs.mkdirSync(path.dirname(update.file), { recursive: true });
    const temporary = `${update.file}.${process.pid}.tmp`;
    try {
      fs.writeFileSync(temporary, update.content, { flag: "wx" });
      fs.renameSync(temporary, update.file);
    } finally {
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    }
  }
}
