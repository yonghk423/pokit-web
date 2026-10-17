import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkProject } from "./lib/validate-i18n.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
try {
  if (args.some(arg => arg !== "--json")) throw new Error("사용법: npm run i18n:check -- [--json]");
  const result = checkProject(root);
  if (args.includes("--json")) console.log(JSON.stringify(result, null, 2));
  else if (result.errors.length) {
    for (const error of result.errors) {
      const key = error.key === undefined ? "" : ` ${JSON.stringify(error.key).slice(0, 100)}`;
      const usage = error.usages?.[0];
      console.error(`${error.file}:${error.line ?? 1}:${error.column ?? 1} [${error.code}]${key} ${error.message}${usage ? ` (사용: ${usage.file}:${usage.line})` : ""}`);
    }
    console.error(`번역 검사 실패: ${result.errors.length}개 오류`);
  } else console.log(`번역 검사 통과: ${result.scopeCount}개 영역, ${result.localeCount}개 언어, 사용 키 ${result.usedKeyCount}개`);
  if (result.errors.length) process.exitCode = 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
