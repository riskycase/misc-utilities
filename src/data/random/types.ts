export interface RandomNumberGeneratorState {
  prefix: string;
  suffix: string;
  max: number;
  min: number;
  current: number;
}

export interface RandomNumberGeneratorStateUpdate {
  prefix?: string;
  suffix?: string;
  max?: number;
  min?: number;
  current?: number;
}

export interface RandomTextPickerState {
  texts: string[];
  current: number;
}

export interface RandomTextPickerStateUpdate {
  texts?: string[];
  current?: number;
}
