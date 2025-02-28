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
      new (class extends TransformerInnerClass {
        name = "URL Encode";
        identifier = "urlEncode"
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
      new (class extends TransformerInnerClass {
        name = "URL Decode";
        identifier = "urlDecode"
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
      new (class extends TransformerInnerClass {
        name = "JSON Parse";
        identifier = "jsonParse"
        input = TransformDataType.STRING;
        output = TransformDataType.OBJECT;
        transform(input: any) {
          return JSON.parse(input);
        }
      })(),
  },
  {
    name: "JSON Stringify/Minify",
    inner: () =>
      new (class extends TransformerInnerClass {
        name = "JSON Stringify/Minify";
        identifier = "jsonStringify"
        input = TransformDataType.OBJECT;
        output = TransformDataType.STRING;
        override options: TransformerOptions[] = [
          {
            name: "padding",
            type: "number",
            displayName: "Padding",
            default: 4,
            max: 10,
            min: 0,
            tip: "Setting padding to 0 will output minified JSON",
          },
        ];
        transform(input: any) {
          return JSON.stringify(
            input,
            null,
            this.config.padding === undefined ? 4 : this.config.padding
          );
        }
      })(),
  },
  {
    name: "Base64 Encode",
    inner: () =>
      new (class extends TransformerInnerClass {
        name = "Base64 Encode";
        identifier = "base64Encode"
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
      new (class extends TransformerInnerClass {
        name = "Base64 Decode";
        identifier = "base64Decode"
        input = TransformDataType.STRING;
        output = TransformDataType.STRING;
        transform(input: any) {
          return new TextDecoder().decode(
            Uint8Array.from(atob(input), (char) => char.codePointAt(0) || 0)
          );
        }
      })(),
  },
  {
    name: "Stringify number",
    inner: () =>
      new (class extends TransformerInnerClass {
        name = "Stringify number";
        identifier = "numberStringify"
        input = TransformDataType.NUMBER;
        output = TransformDataType.STRING;
        transform(input: any) {
          return String(input);
        }
      })(),
  },
  {
    name: "Parse and scale number",
    inner: () =>
      new (class extends TransformerInnerClass {
        name = "Parse and scale number";
        identifier = "numberParse"
        input = TransformDataType.STRING;
        output = TransformDataType.NUMBER;
        override options: TransformerOptions[] = [
          {
            name: "scale",
            type: "number",
            displayName: "Scale",
            default: 1,
            max: Number.MAX_VALUE,
            min: Number.MIN_VALUE,
          },
          {
            name: "shift",
            type: "number",
            displayName: "Add / Subtract",
            default: 0,
            max: Number.MAX_VALUE,
            min: Number.MIN_VALUE,
            tip: "Number will be added/subtracted as last step",
          },
        ];
        transform(input: any) {
          return (
            Number(input) *
              (this.config.scale === undefined ? 1 : this.config.scale) +
            (this.config.shift === undefined ? 0 : this.config.shift)
          );
        }
      })(),
  },
  {
    name: "Modify string",
    inner: () =>
      new (class extends TransformerInnerClass {
        name = "Modify string";
        identifier = "stringManipulate"
        input = TransformDataType.STRING;
        output = TransformDataType.STRING;
        override options: TransformerOptions[] = [
          {
            name: "case",
            type: "select",
            displayName: "Case",
            default: "none",
            options: [
              {
                displayName: "No change",
                value: "none",
              },
              {
                displayName: "UPPERCASE",
                value: "upper",
              },
              {
                displayName: "lowercase",
                value: "lower",
              },
              {
                displayName: "tOGGLE cASE",
                value: "toggle",
              },
              {
                displayName: "sArCaSm cAsE",
                value: "sarcasm",
              },
              {
                displayName: "Capitalise Words",
                value: "title",
              },
            ],
          },
          {
            name: "prefix",
            displayName: "Prefix",
            type: "string",
            default: "",
            tip: "Leave empty to disable prefix",
          },
          {
            name: "suffix",
            displayName: "Suffix",
            type: "string",
            default: "",
            tip: "Leave empty to disable suffix",
          },
          {
            name: "trim",
            displayName: "Trim spaces",
            type: "boolean",
            default: false,
          },
        ];
        transform(input: any) {
          const targetCase =
            this.config.case === undefined ? "none" : this.config.case;
          let output = input;
          switch (targetCase) {
            case "upper":
              output = String(input).toLocaleUpperCase();
              break;
            case "lower":
              output = String(input).toLocaleLowerCase();
              break;
            case "toggle":
              output = String(input)
                .split("")
                .map((char) => {
                  if (char.match(/[A-Z]/)) return char.toLocaleLowerCase();
                  else if (char.match(/[a-z]/)) return char.toLocaleUpperCase();
                  else return char;
                })
                .join("");
              break;
            case "sarcasm":
              output = String(input)
                .split("")
                .map((char, index) =>
                  index % 2 === 0
                    ? char.toLocaleLowerCase()
                    : char.toLocaleUpperCase()
                )
                .join("");
              break;
            case "title":
              let prevChar = "";
              output = String(input)
                .split("")
                .map((char) => {
                  let nextChar = char;
                  if (prevChar.match(/\s/)) nextChar = char.toLocaleUpperCase();
                  prevChar = nextChar;
                  return nextChar;
                })
                .join("");
              break;
          }
          if (this.config.trim) output = output.trim();
          output = `${
            this.config.prefix === undefined ? "" : this.config.prefix
          }${output}${
            this.config.suffix === undefined ? "" : this.config.suffix
          }`;
          return output;
        }
      })(),
  },
];
