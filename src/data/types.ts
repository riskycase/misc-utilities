export interface TransformerOptions {
  name: string;
  displayName: string;
  type: "string" | "number" | "boolean";
  default: string | number | boolean;
}

export enum TransformDataType {
  STRING,
  OBJECT,
  NUMBER,
}

export abstract class TransformerInnerClass {
  options: Array<TransformerOptions> = [];
  config: any = {};
  name: string = "";
  abstract transform(input: any): any;
  abstract input: TransformDataType;
  abstract output: TransformDataType;

  constructor() {
    this.options.forEach(
      (option) => (this.config[option.name] = option.default)
    );
  }
}

export interface Transformer {
  inner: () => TransformerInnerClass;
  name: string;
}
