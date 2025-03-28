export function getOrDefault<T>(value: T, defaultValue: T) {
  return value === undefined ? defaultValue : value;
}

export function base64Encode(input: string) {
  return btoa(
    Array.from(new TextEncoder().encode(input), (byte) =>
      String.fromCodePoint(byte)
    ).join("")
  );
}

export function base64Decode(input: string) {
  return new TextDecoder().decode(
    Uint8Array.from(atob(input), (char) => char.codePointAt(0) || 0)
  );
}
