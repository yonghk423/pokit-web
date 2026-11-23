export type RecordingPrompt = { heading: string; text: string };

/** The same editorial text is used on standalone articles and article previews. */
export function ArticleRecordingPrompt({ prompt }: { prompt: RecordingPrompt }) {
  return (
    <div data-recording-prompt className="mb-4 text-left">
      <h2 className="m-0 font-sans text-sm font-semibold leading-relaxed text-ink">{prompt.heading}</h2>
      <p className="mt-2 mb-0 font-sans text-[0.95rem] leading-[1.8] text-ink/80 [overflow-wrap:anywhere]">{prompt.text}</p>
    </div>
  );
}
