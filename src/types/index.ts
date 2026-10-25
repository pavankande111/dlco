export type LogicValue = 0 | 1 | 'Z' | 'CONFLICT';

export type PinType = 'in' | 'out' | 'vcc' | 'gnd' | 'clk' | 'nc';

export interface PinInfo {
  name: string;
  type: PinType;
  gate?: number;
  arg?: number;
  desc?: string;
}

export interface GateDefinition {
  inputs: number[];
  output: number;
  fn: (...args: LogicValue[]) => LogicValue;
}

export interface ICDefinition {
  id: string;
  name: string;
  package: string;
  pins: number;
  vccPin: number;
  gndPin: number;
  pinout: Record<number, PinInfo>;
  gates?: GateDefinition[];
  evaluate?: (inputs: Record<number, LogicValue>) => Record<number, LogicValue>;
  initInternalState?: () => any;
  evaluateSequential?: (
    state: any,
    inputs: Record<number, LogicValue>,
    isClockEdge?: boolean
  ) => Record<number, LogicValue>;
  description: string;
  preview: string;
}

export interface Wire {
  id: number;
  from: string;
  to: string;
  color: string;
}

export interface SocketState {
  ic: string | null;
  icState: any;
  isPowered: boolean;
}

export interface ClockState {
  running: boolean;
  frequency: number; // Hz
  state: number;     // 0 or 1
  pulseCount: number;
}

export interface PulserState {
  state: number;     // 0 or 1
}

export interface DiagnosticItem {
  type: 'ok' | 'warn' | 'err' | 'info';
  msg: string;
}

export interface Experiment {
  id: string;
  title: string;
  aim: string;
  requiredIcs: string[];
  socketLayout: Record<string, string>;
  inputsDesc: string;
  outputsDesc: string;
  instructions: string[];
  truthTable: Array<Record<string, any>>;
  referenceWires: Array<{ from: string; to: string }>;
  viva: Array<{ q: string; a: string }>;
}
