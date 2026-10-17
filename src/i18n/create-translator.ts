/** Create a translator from the messages for the current locale and scope. */
export function createTranslator<Messages extends Record<string, string>>(
  messages: Messages,
) {
  return (key: Extract<keyof Messages, string>): string => messages[key];
}
