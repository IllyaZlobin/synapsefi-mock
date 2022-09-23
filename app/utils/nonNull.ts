export function nonNull<T>(
  value: T,
  name?: string,
  message?: string
): { value: Exclude<T, null | undefined> } {
  return {
    get value() {
      if (value === null || value === undefined) {
        if (message) throw new Error(message);
        const valueName = name ? `"${name}" ` : "";
        throw new Error(`Value ${valueName} should not be null.`);
      }
      return value as Exclude<T, null | undefined>;
    },
  };
}
