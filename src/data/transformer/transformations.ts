import { base64Decode, base64Encode, getOrDefault } from "@/util";
import {
  TransformDataType,
  Transformer,
  TransformerInnerClass,
  TransformerOptions,
} from "./types";

export const transformations: Array<Transformer> = [
  {
    name: "URL Encode",
    inner: (config?: any) =>
      new (class extends TransformerInnerClass {
        name = "URL Encode";
        identifier = "urlEncode";
        input = TransformDataType.STRING;
        output = TransformDataType.STRING;
        transform(input: any) {
          return encodeURIComponent(input);
        }
      })(config),
  },
  {
    name: "URL Decode",
    inner: (config?: any) =>
      new (class extends TransformerInnerClass {
        name = "URL Decode";
        identifier = "urlDecode";
        input = TransformDataType.STRING;
        output = TransformDataType.STRING;
        transform(input: any) {
          return decodeURIComponent(input);
        }
      })(config),
  },
  {
    name: "JSON Parse",
    inner: (config?: any) =>
      new (class extends TransformerInnerClass {
        name = "JSON Parse";
        identifier = "jsonParse";
        input = TransformDataType.STRING;
        output = TransformDataType.OBJECT;
        transform(input: any) {
          return JSON.parse(input);
        }
      })(config),
  },
  {
    name: "JSON Stringify/Minify",
    inner: (config?: any) =>
      new (class extends TransformerInnerClass {
        name = "JSON Stringify/Minify";
        identifier = "jsonStringify";
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
            getOrDefault(this.config.padding, 4)
          );
        }
      })(config),
  },
  {
    name: "Base64 Encode",
    inner: (config?: any) =>
      new (class extends TransformerInnerClass {
        name = "Base64 Encode";
        identifier = "base64Encode";
        input = TransformDataType.STRING;
        output = TransformDataType.STRING;
        transform(input: any) {
          return base64Encode(input);
        }
      })(config),
  },
  {
    name: "Base64 Decode",
    inner: (config?: any) =>
      new (class extends TransformerInnerClass {
        name = "Base64 Decode";
        identifier = "base64Decode";
        input = TransformDataType.STRING;
        output = TransformDataType.STRING;
        transform(input: any) {
          return base64Decode(input);
        }
      })(config),
  },
  {
    name: "Stringify number",
    inner: (config?: any) =>
      new (class extends TransformerInnerClass {
        name = "Stringify number";
        identifier = "numberStringify";
        input = TransformDataType.NUMBER;
        output = TransformDataType.STRING;
        transform(input: any) {
          return String(input);
        }
      })(config),
  },
  {
    name: "Parse and scale number",
    inner: (config?: any) =>
      new (class extends TransformerInnerClass {
        name = "Parse and scale number";
        identifier = "numberParse";
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
            Number(input) * getOrDefault(this.config.scale, 1) +
            getOrDefault(this.config.shift, 0)
          );
        }
      })(config),
  },
  {
    name: "Replace String (As Is)",
    inner: (config?: any) =>
      new (class extends TransformerInnerClass {
        name = "Replace String (As Is)";
        identifier = "stringReplace";
        input = TransformDataType.STRING;
        output = TransformDataType.STRING;
        override options: TransformerOptions[] = [
          {
            name: "oldString",
            type: "string",
            displayName: "Old String",
            default: "",
          },
          {
            name: "newString",
            type: "string",
            displayName: "New String",
            default: "",
          },
        ];
        transform(input: any) {
          return String(input).replaceAll(
            getOrDefault(this.config.oldString, ""),
            getOrDefault(this.config.newString, "")
          );
        }
      })(config),
  },
  {
    name: "Replace String (RegEx)",
    inner: (config?: any) =>
      new (class extends TransformerInnerClass {
        name = "Replace String (RegEx)";
        identifier = "stringReplace";
        input = TransformDataType.STRING;
        output = TransformDataType.STRING;
        override options: TransformerOptions[] = [
          {
            name: "regex",
            type: "string",
            displayName: "RegEx",
            default: "",
          },
          {
            name: "newString",
            type: "string",
            displayName: "New String",
            default: "",
          },
        ];
        transform(input: any) {
          return String(input).replaceAll(
            RegExp(getOrDefault(this.config.regex, ""), "g"),
            getOrDefault(this.config.newString, "")
          );
        }
      })(config),
  },
  {
    name: "Modify string",
    inner: (config?: any) =>
      new (class extends TransformerInnerClass {
        name = "Modify string";
        identifier = "stringManipulate";
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
          const targetCase = getOrDefault(this.config.case, "none");
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
          output = `${getOrDefault(
            this.config.prefix,
            ""
          )}${output}${getOrDefault(this.config.suffix, "")}`;
          return output;
        }
      })(config),
  },
];
