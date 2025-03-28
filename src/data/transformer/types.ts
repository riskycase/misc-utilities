interface TransformerOptionSelect {
  name: string;
  displayName: string;
  type: "select";
  default: string;
  options: Array<{
    displayName: string;
    value: string;
  }>;
  tip?: string;
}

interface TransformerOptionString {
  name: string;
  displayName: string;
  type: "string";
  default: string;
  tip?: string;
}
interface TransformerOptionNumber {
  name: string;
  displayName: string;
  type: "number";
  default: number;
  max: number;
  min: number;
  tip?: string;
}
interface TransformerOptionBoolean {
  name: string;
  displayName: string;
  type: "boolean";
  default: boolean;
  tip?: string;
}

export type TransformerOptions =
  | TransformerOptionBoolean
  | TransformerOptionNumber
  | TransformerOptionSelect
  | TransformerOptionString;

export enum TransformDataType {
  STRING,
  OBJECT,
  NUMBER,
}

export abstract class TransformerInnerClass {
  options: Array<TransformerOptions> = [];
  config: any = {};
  name: string = "";
  identifier: string = "";
  abstract transform(input: any): any;
  abstract input: TransformDataType;
  abstract output: TransformDataType;

  constructor(config?: any) {
    if (config) {
      this.config = config;
    } else {
      this.options.forEach(
        (option) => (this.config[option.name] = option.default)
      );
    }
  }
}

export interface Transformer {
  inner: (config?: any) => TransformerInnerClass;
  name: string;
}
