import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { extractMessages, readLocales } from "./extract-i18n.mjs";

const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const placeholders = text => [...new Set([...text.matchAll(/{{([^{}]+)}}/g)].map(match => match[1]))].sort();

/** Read-only validation, including unused keys retained in the source catalogs. */
export function validateMessages(projectRoot, extraction, locales = readLocales(projectRoot)) {
  const root = path.resolve(projectRoot);
  const messagesRoot = path.join(root, "src/i18n/messages");
  const errors = extraction.diagnostics.map(error => ({ ...error, code: "invalid-call" }));
  const scopes = new Set(Object.keys(extraction.catalogs));
  for (const locale of locales) {
    const directory = path.join(messagesRoot, locale);
    if (!fs.existsSync(directory)) continue;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(".json")) scopes.add(entry.name.slice(0, -5));
    }
  }

  for (const scope of [...scopes].sort()) {
    if (!/^[a-z0-9-]+$/.test(scope)) {
      errors.push({ file: path.relative(root, messagesRoot), code: "invalid-scope", message: `잘못된 번역 영역: ${scope}` });
      continue;
    }
    const catalogs = new Map();
    const files = new Map();
    const locations = extraction.catalogs[scope] ?? {};
    function issue(locale, code, message, key, line = 1) {
      errors.push({ file: files.get(locale), line, code, scope, locale, key, message,
        usages: key === undefined ? undefined : locations[key] });
    }
    for (const locale of locales) {
      const absolute = path.join(messagesRoot, locale, `${scope}.json`);
      files.set(locale, path.relative(root, absolute));
      if (!fs.existsSync(absolute)) {
        issue(locale, "missing-file", "번역 파일이 없습니다.");
        continue;
      }
      const text = fs.readFileSync(absolute, "utf8");
      let messages;
      try { messages = JSON.parse(text); }
      catch { issue(locale, "invalid-json", "JSON 문법이 올바르지 않습니다."); continue; }
      if (!messages || typeof messages !== "object" || Array.isArray(messages)) {
        issue(locale, "invalid-catalog", "번역 리소스는 키와 문자열 값으로 구성된 객체여야 합니다.");
        continue;
      }
      catalogs.set(locale, messages);
      const ast = ts.parseJsonText(absolute, text);
      const seen = new Set();
      const keyLines = new Map();
      for (const property of ast.statements[0]?.expression?.properties ?? []) {
        if (!ts.isPropertyAssignment(property) || !ts.isStringLiteral(property.name)) continue;
        const key = property.name.text;
        const { line } = ast.getLineAndCharacterOfPosition(property.getStart(ast));
        if (seen.has(key)) issue(locale, "duplicate-key", "중복된 번역 키입니다.", key, line + 1);
        seen.add(key);
        keyLines.set(key, line + 1);
      }
      for (const [key, value] of Object.entries(messages)) {
        const line = keyLines.get(key) ?? 1;
        if (typeof value !== "string") issue(locale, "invalid-value", "번역 값은 문자열이어야 합니다.", key, line);
        else if (!value.trim()) issue(locale, "empty-value", "번역 값이 비어 있습니다.", key, line);
        else if (JSON.stringify(placeholders(key)) !== JSON.stringify(placeholders(value))) {
          issue(locale, "placeholder-mismatch", `동적 인자가 다릅니다. 필요: ${placeholders(key).join(", ") || "없음"}, 실제: ${placeholders(value).join(", ") || "없음"}`, key, line);
        }
      }
    }
    const source = catalogs.get("ko");
    if (source) {
      for (const key of Object.keys(locations)) {
        if (!own(source, key)) issue("ko", "unregistered-key", "코드에서 사용하는 키가 한국어 리소스에 없습니다. i18n:extract -- --write를 실행하세요.", key);
      }
      const required = new Set([...Object.keys(source), ...Object.keys(locations)]);
      for (const locale of locales.filter(locale => locale !== "ko")) {
        const messages = catalogs.get(locale);
        if (!messages) continue;
        for (const key of required) {
          if (!own(messages, key)) issue(locale, "missing-key", "번역 키가 누락됐습니다.", key);
        }
        for (const key of Object.keys(messages)) {
          if (!own(source, key)) issue(locale, "extra-key", "한국어 리소스에 없는 키입니다.", key);
        }
      }
    }
  }
  return { errors, scopeCount: scopes.size, localeCount: locales.length,
    usedKeyCount: Object.values(extraction.catalogs).reduce((total, keys) => total + Object.keys(keys).length, 0) };
}

export function checkProject(projectRoot) {
  return validateMessages(projectRoot, extractMessages(projectRoot));
}
