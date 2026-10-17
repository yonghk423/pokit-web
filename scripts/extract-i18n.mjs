import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractMessages, planUpdates, writeUpdates } from "./lib/extract-i18n.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
try {
  if (args.some(arg => !["--write", "--json"].includes(arg))) throw new Error("사용법: npm run i18n:extract -- [--write] [--json]");
  const extraction = extractMessages(root);
  if (extraction.diagnostics.length) {
    for (const error of extraction.diagnostics) console.error(`${error.file}:${error.line}:${error.column} ${error.message}`);
    process.exitCode = 1;
  } else {
    const updates = planUpdates(root, extraction);
    if (args.includes("--write")) writeUpdates(updates);
    if (args.includes("--json")) console.log(JSON.stringify(extraction.catalogs, null, 2));
    else {
      for (const [scope, keys] of Object.entries(extraction.catalogs)) {
        const plans = updates.filter(update => update.scope === scope);
        console.log(`${scope}: ${Object.keys(keys).length}개 키, 추가 ${plans.map(plan => `${plan.locale} ${plan.added.length}`).join(" / ")}, 보존된 미사용 키 ${plans.find(plan => plan.locale === "ko").unused.length}개`);
      }
      console.log(args.includes("--write") ? "새 키를 반영했습니다. 한국어 외 언어의 빈 값은 번역이 필요합니다." : "미리보기입니다. 반영하려면 --write를 사용하세요.");
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
