let keyCounter = 0;

export function resetPortableTextKeys() {
  keyCounter = 0;
}

function nextKey(prefix = "k") {
  keyCounter += 1;
  return `${prefix}${keyCounter}`;
}

export function textBlock(text, style = "normal") {
  const key = nextKey("b");
  return {
    _type: "block",
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
  };
}

/** @param {{ intro?: string[], sections?: { title?: string, paragraphs: string[] }[], outro?: string[] }} article */
export function buildArticleBody({ intro = [], sections = [], outro = [] }) {
  const blocks = [];
  for (const paragraph of intro) blocks.push(textBlock(paragraph));
  for (const section of sections) {
    if (section.title) blocks.push(textBlock(section.title, "h2"));
    for (const paragraph of section.paragraphs) blocks.push(textBlock(paragraph));
  }
  for (const paragraph of outro) blocks.push(textBlock(paragraph));
  return blocks;
}
