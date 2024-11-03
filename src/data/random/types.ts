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
  
    
