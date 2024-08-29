import {
  TransformDataType,
  Transformer,
  TransformerInnerClass,
  TransformerOptions,
} from "./types";

export const transformations: Array<Transformer> = [
  {
    name: "URL Encode",
    inner: () =>
      new (class URLEncode extends TransformerInnerClass {
        name = "URL Encode";
        input = TransformDataType.STRING;
        output = TransformDataType.STRING;
        transform(input: any) {
          return encodeURIComponent(input);
        }
      })(),
  },
  {
    name: "URL Decode",
    inner: () =>
      new (class URLDecode extends TransformerInnerClass {
        name = "URL Decode";
        input = TransformDataType.STRING;
        output = TransformDataType.STRING;
        transform(input: any) {
          return decodeURIComponent(input);
        }
      })(),
  },
  {
    name: "JSON Parse",
    inner: () =>
      new (class JSONParse extends TransformerInnerClass {
        name = "JSON Parse";
        input = TransformDataType.STRING;
        output = TransformDataType.OBJECT;
        transform(input: any) {
          return JSON.parse(input);
        }
      })(),
  },
  {
    name: "JSON Stringify",
    inner: () =>
      new (class JSONParse extends TransformerInnerClass {
        name = "JSON Stringify";
        input = TransformDataType.OBJECT;
        output = TransformDataType.STRING;
        override options: TransformerOptions[] = [
          {
            name: "padding",
            type: "number",
            displayName: "Padding",
            default: 4,
          },
        ];
        transform(input: any) {
          return JSON.stringify(input, null, this.config.padding || 4);
        }
      })(),
  },
  {
    name: "Base64 Encode",
    inner: () =>
      new (class JSONParse extends TransformerInnerClass {
        name = "Base64 Encode";
        input = TransformDataType.STRING;
        output = TransformDataType.STRING;
        transform(input: any) {
          return btoa(
            Array.from(new TextEncoder().encode(input), (byte) =>
              String.fromCodePoint(byte)
            ).join("")
          );
        }
      })(),
  },
  {
    name: "Base64 Decode",
    inner: () =>
      new (class JSONParse extends TransformerInnerClass {
        name = "Base64 Decode";
        input = TransformDataType.STRING;
        output = TransformDataType.STRING;
        transform(input: any) {
          return new TextDecoder().decode(
            Uint8Array.from(atob(input), (char) => char.codePointAt(0) || 0)
          );
        }
      })(),
  },
];
