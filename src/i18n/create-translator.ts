type PlaceholderNames<Text extends string> =
  Text extends `${string}{{${infer Name}}}${infer Rest}`
    ? Name | PlaceholderNames<Rest>
    : never;

type TranslationArguments<Key extends string> =
  [PlaceholderNames<Key>] extends [never]
    ? []
    : [values: Record<PlaceholderNames<Key>, string | number>];

/** Placeholder names come from the Korean source key, regardless of locale. */
export function createTranslator<Messages extends Record<string, string>>(
  messages: Messages,
) {
  return <Key extends Extract<keyof Messages, string>>(
    key: Key,
    ...args: TranslationArguments<NoInfer<Key>>
  ): string => {
    if (!Object.prototype.hasOwnProperty.call(messages, key)) {
      throw new Error(`Unknown translation key: ${key}`);
    }

    const values = args[0] as Record<string, string | number> | undefined;
    return messages[key].replace(/{{([^{}]+)}}/g, (_, name: string) => {
      if (!values || !Object.prototype.hasOwnProperty.call(values, name)) {
        throw new Error(`Missing translation value: ${name}`);
      }
      return String(values[name]);
    });
  };
}
