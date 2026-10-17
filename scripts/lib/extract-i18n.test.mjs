import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { extractMessages, planUpdates, readLocales, writeUpdates } from "./extract-i18n.mjs";

function fixture(t, source) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pokit-i18n-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, value) => {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, value);
  };
  write("tsconfig.json", JSON.stringify({ compilerOptions: {
    strict: true, module: "esnext", moduleResolution: "bundler", resolveJsonModule: true,
    allowSyntheticDefaultImports: true, target: "es2020", types: [], paths: { "@/*": ["./src/*"] },
  }, include: ["src/**/*.ts", "src/**/*.tsx"] }));
  write("src/i18n/config.ts", 'export const locales = ["ko", "en", "ja"] as const;');
  write("src/i18n/create-translator.ts", fs.readFileSync(new URL("../../src/i18n/create-translator.ts", import.meta.url), "utf8"));
  for (const scope of ["common", "home"]) {
    for (const locale of ["ko", "en", "ja"]) write(`src/i18n/messages/${locale}/${scope}.json`, JSON.stringify({ "메뉴": `${locale} 메뉴`, "보존": `${locale} 보존` }));
    const name = scope === "common" ? "Common" : "Home";
    write(`src/i18n/get-${scope}.ts`, `
      import source from './messages/ko/${scope}.json';
      export type ${name}Messages = Record<keyof typeof source, string>;
      export async function load${name}(): Promise<${name}Messages> { return source; }
    `);
  }
  write("src/page.tsx", `
    import { createTranslator as make } from '@/i18n/create-translator';
    import { loadCommon, type CommonMessages } from '@/i18n/get-common';
    import type { HomeMessages } from '@/i18n/get-home';
    ${source}
  `);
  return { root, write };
}

const keys = (result, scope) => Object.keys(result.catalogs[scope] ?? {});

test("extracts renamed factories, async loaders, typed props, aliases and multiline keys", t => {
  const { root, write } = fixture(t, `
    export async function Page() {
      const t = make(await loadCommon());
      t('신규');
      const translate = t;
      translate(\`여러\n줄\`);
      { const t = (key: string) => key; t('무관한 함수'); }
    }
    export function Client({ messages }: { messages: Readonly<CommonMessages> }) {
      const t = make(messages); t('메뉴');
    }
    export function Shared(t: (key: keyof HomeMessages) => string) { t('신규'); }
    export function Generic(t: ReturnType<typeof make<HomeMessages>>) { t('동적 {{label}}'); }
  `);
  write("src/ignored.type-test.ts", "this is deliberately invalid TypeScript !!!");
  const result = extractMessages(root);
  assert.deepEqual(result.diagnostics, []);
  assert.deepEqual(keys(result, "common"), ["메뉴", "신규", "여러\n줄"]);
  assert.deepEqual(keys(result, "home"), ["동적 {{label}}", "신규"]);
  assert(result.catalogs.common["신규"][0].line > 0);
  assert.equal(result.catalogs.common["신규"][0].file, "src/page.tsx");
});

test("reports dynamic keys and unresolved or ambiguous scopes before writing", t => {
  const { root } = fixture(t, `
    export function Dynamic(messages: CommonMessages, key: string) {
      const t = make(messages); t(key);
    }
    export function Unknown() { const t = make({ '메뉴': 'Menu' }); t('메뉴'); }
    export function Ambiguous(t: (key: keyof (CommonMessages & HomeMessages)) => string) { t('메뉴'); }
  `);
  const result = extractMessages(root);
  assert.equal(result.diagnostics.length, 3);
  assert(result.diagnostics.every(error => error.file === "src/page.tsx" && error.line > 0));
  assert.throws(() => planUpdates(root, result), /추출 오류/);
});

test("ignores unrelated functions with the same factory or translation name", t => {
  const { root, write } = fixture(t, `
    import { createTranslator } from './unrelated';
    const t = createTranslator(); t('추출하지 않음');
  `);
  write("src/unrelated.ts", "export function createTranslator() { return (value: string) => value; }");
  const result = extractMessages(root);
  assert.deepEqual(result.catalogs, {});
  assert.deepEqual(result.diagnostics, []);
});

test("follows imported translator bindings across modules", t => {
  const { root, write } = fixture(t, "import { shared as translate } from './shared'; translate('가져온 키');");
  write("src/shared.ts", `
    import { createTranslator } from '@/i18n/create-translator';
    import type { CommonMessages } from '@/i18n/get-common';
    export const shared = createTranslator({} as CommonMessages);
  `);
  const result = extractMessages(root);
  assert.deepEqual(result.diagnostics, []);
  assert.deepEqual(keys(result, "common"), ["가져온 키"]);
});

test("dry runs preserve files; writes add source keys and blank pending translations without pruning", t => {
  const { root } = fixture(t, `
    export function Client(messages: CommonMessages) {
      const t = make(messages); t('메뉴'); t('새 {{label}}'); t('__proto__');
    }
  `);
  const file = path.join(root, "src/i18n/messages/en/common.json");
  const original = fs.readFileSync(file, "utf8");
  const result = extractMessages(root);
  const plan = planUpdates(root, result);
  assert.equal(fs.readFileSync(file, "utf8"), original);
  assert.deepEqual(plan.find(update => update.locale === "ko").unused, ["보존"]);
  writeUpdates(plan);
  const read = locale => JSON.parse(fs.readFileSync(path.join(root, `src/i18n/messages/${locale}/common.json`), "utf8"));
  assert.equal(read("ko")["새 {{label}}"], "새 {{label}}");
  assert.equal(read("en")["새 {{label}}"], "");
  assert.equal(read("ja")["새 {{label}}"], "");
  assert.equal(read("en")["메뉴"], "en 메뉴");
  assert.equal(read("en")["보존"], "en 보존");
  assert.equal(read("ko").__proto__, "__proto__");
  assert(planUpdates(root, extractMessages(root)).every(update => !update.added.length));
  const after = fs.readFileSync(file, "utf8");
  writeUpdates(planUpdates(root, result));
  assert.equal(fs.readFileSync(file, "utf8"), after);
});

test("invalid catalogs and concurrent edits prevent all writes", t => {
  const { root, write } = fixture(t, "export function Shared(t: (key: keyof CommonMessages) => string) { t('새 키'); }");
  const extraction = extractMessages(root);
  const plan = planUpdates(root, extraction);
  const koFile = path.join(root, "src/i18n/messages/ko/common.json");
  const originalKo = fs.readFileSync(koFile, "utf8");
  write("src/i18n/messages/ja/common.json", '{"보존":"수동 수정"}');
  assert.throws(() => writeUpdates(plan), /파일이 변경/);
  assert.equal(fs.readFileSync(koFile, "utf8"), originalKo);
  write("src/i18n/messages/ja/common.json", '{"잘못된 값":42}');
  assert.throws(() => planUpdates(root, extraction), /문자열 번역 객체/);
  assert.equal(fs.readFileSync(koFile, "utf8"), originalKo);
});

test("creates a missing locale catalog using the configured languages", t => {
  const { root } = fixture(t, "export function Shared(t: (key: keyof CommonMessages) => string) { t('새 키'); }");
  const file = path.join(root, "src/i18n/messages/ja/common.json");
  fs.unlinkSync(file);
  const plan = planUpdates(root, extractMessages(root));
  assert.equal(fs.existsSync(file), false);
  writeUpdates(plan);
  assert.deepEqual(JSON.parse(fs.readFileSync(file, "utf8")), { "새 키": "" });
});

test("reads configured locales and rejects unsafe or duplicate locale paths", t => {
  const { root, write } = fixture(t, "");
  assert.deepEqual(readLocales(root), ["ko", "en", "ja"]);
  write("src/i18n/config.ts", 'export const locales = ["ko", "de"] as const;');
  assert.deepEqual(readLocales(root), ["ko", "de"]);
  for (const locales of [["ko", "../escape"], ["en"], ["ko", "ko"]]) {
    write("src/i18n/config.ts", `export const locales = ${JSON.stringify(locales)} as const;`);
    assert.throws(() => readLocales(root), /언어 목록/);
  }
});

test("syntax errors are reported and block update planning", t => {
  const { root } = fixture(t, "export function Broken( {");
  const result = extractMessages(root);
  assert(result.diagnostics.length > 0);
  assert.throws(() => planUpdates(root, result), /추출 오류/);
});
