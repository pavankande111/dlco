import { LogicValue, Wire, SocketState, DiagnosticItem } from '../types';
import { IC_DEFINITIONS } from './icDefinitions';

export interface SimulationResult {
  nets: Record<string, string>;
  netValues: Record<string, LogicValue>;
  netDrivers: Record<string, Array<{ tid: string; val: LogicValue; desc: string }>>;
  pinValues: Record<string, LogicValue>;
  socketPower: Record<string, boolean>;
  outputLeds: Record<number, LogicValue>;
  segA: string;
  segB: string;
  probeLedH: boolean;
  probeLedL: boolean;
  diagnostics: DiagnosticItem[];
  powerList: DiagnosticItem[];
  signalList: DiagnosticItem[];
  netList: DiagnosticItem[];
  hasErrors: boolean;
  hasWarnings: boolean;
}

export function formatTerminalName(tid: string, sockets: Record<string, SocketState>): string {
  if (tid.startsWith('in:')) return `Input Switch S${tid.split(':')[1]}`;
  if (tid.startsWith('out:')) return `Output LED L${tid.split(':')[1]}`;
  if (tid.startsWith('vcc:')) return `VCC (+5V) #${tid.split(':')[1]}`;
  if (tid.startsWith('gnd:')) return `GROUND (0V) #${tid.split(':')[1]}`;
  if (tid.startsWith('clk:')) return `Clock [${tid.split(':')[1]}]`;
  if (tid === 'probe') return 'Logic Probe';
  if (tid.startsWith('seg:')) return `7-Seg ${tid.split(':')[1].toUpperCase()}`;
  if (tid.includes(':p')) {
    const [sock, pinStr] = tid.split(':p');
    const pin = parseInt(pinStr, 10);
    const ic = sockets[sock]?.ic;
    const pinName = ic ? IC_DEFINITIONS[ic]?.pinout[pin]?.name : '';
    return `${sock} Pin ${pin}${pinName ? ` (${pinName})` : ''}`;
  }
  return tid;
}

export function runCircuitSimulation(
  mainsPower: boolean,
  wires: Wire[],
  sockets: Record<string, SocketState>,
  switches: Record<number, number>,
  clockState: number,
  pulserState: number
): SimulationResult {
  const outputLeds: Record<number, LogicValue> = {};
  for (let i = 1; i <= 16; i++) {
    outputLeds[i] = 'Z';
  }

  const socketPower: Record<string, boolean> = {};
  Object.keys(sockets).forEach(sockId => {
    socketPower[sockId] = false;
  });

  const diagnostics: DiagnosticItem[] = [];
  const powerList: DiagnosticItem[] = [];
  const signalList: DiagnosticItem[] = [];
  const netList: DiagnosticItem[] = [];

  if (!mainsPower) {
    diagnostics.push({ type: 'warn', msg: 'Trainer Mains Power is OFF. Switch ON power to operate.' });
    powerList.push({ type: 'warn', msg: 'Trainer Mains Power is OFF.' });
    return {
      nets: {},
      netValues: {},
      netDrivers: {},
      pinValues: {},
      socketPower,
      outputLeds,
      segA: '—',
      segB: '—',
      probeLedH: false,
      probeLedL: false,
      diagnostics,
      powerList,
      signalList,
      netList,
      hasErrors: false,
      hasWarnings: true,
    };
  }

  // Step 1: Disjoint-Set / Union-Find for all terminals
  const parent: Record<string, string> = {};
  function find(x: string): string {
    if (parent[x] === undefined) parent[x] = x;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a: string, b: string): void {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent[rootB] = rootA;
  }

  wires.forEach(w => {
    union(w.from, w.to);
  });

  // Step 2: Validate IC Power
  let seatedCount = 0;
  let hasErrors = false;
  let hasWarnings = false;

  Object.keys(sockets).forEach(sockId => {
    const sock = sockets[sockId];
    if (!sock.ic) {
      socketPower[sockId] = false;
      return;
    }
    seatedCount++;
    const icDef = IC_DEFINITIONS[sock.ic];
    if (!icDef) return;

    const vccTid = `${sockId}:p${icDef.vccPin}`;
    const gndTid = `${sockId}:p${icDef.gndPin}`;

    const vccNet = find(vccTid);
    const gndNet = find(gndTid);

    const hasVcc = Object.keys(parent).some(
      tid => tid.startsWith('vcc:') && find(tid) === vccNet
    );
    const hasGnd = Object.keys(parent).some(
      tid => tid.startsWith('gnd:') && find(tid) === gndNet
    );

    const isPowered = hasVcc && hasGnd;
    socketPower[sockId] = isPowered;

    if (!isPowered) {
      hasErrors = true;
      const msg = `IC ${sockId} (${sock.ic}) is UNPOWERED. Wire Pin ${icDef.vccPin} to VCC (+5V) and Pin ${icDef.gndPin} to GND.`;
      powerList.push({ type: 'err', msg });
      diagnostics.push({ type: 'err', msg });
    } else {
      powerList.push({ type: 'ok', msg: `IC ${sockId} (${sock.ic}) VCC & GND connected properly.` });
    }

    // Check for floating inputs on powered ICs
    if (isPowered) {
      Object.keys(icDef.pinout).forEach(pStr => {
        const p = parseInt(pStr, 10);
        const pinInfo = icDef.pinout[p];
        if (pinInfo.type === 'in' || pinInfo.type === 'clk') {
          const tid = `${sockId}:p${p}`;
          const isWired = wires.some(w => w.from === tid || w.to === tid);
          if (!isWired) {
            hasWarnings = true;
            const msg = `${sockId} Pin ${p} (${pinInfo.name}) is FLOATING (unconnected).`;
            signalList.push({ type: 'warn', msg });
          }
        }
      });
    }
  });

  if (seatedCount === 0) {
    powerList.push({ type: 'info', msg: 'No ICs seated in trainer sockets.' });
  }

  // Step 3: Register Primary Drivers
  const netDrivers: Record<string, Array<{ tid: string; val: LogicValue; desc: string }>> = {};
  function addDriver(tid: string, val: LogicValue, desc: string): void {
    const net = find(tid);
    if (!netDrivers[net]) netDrivers[net] = [];
    netDrivers[net].push({ tid, val, desc });
  }

  // VCC and GND Rails
  for (let i = 1; i <= 10; i++) {
    addDriver(`vcc:${i}`, 1, 'VCC (+5V Rail)');
    addDriver(`gnd:${i}`, 0, 'GND (0V Ground Rail)');
  }

  // Input Switches
  for (let i = 1; i <= 16; i++) {
    const swVal = switches[i] === 1 ? 1 : 0;
    addDriver(`in:${i}`, swVal, `Switch S${i}`);
  }

  // Clock Outputs
  addDriver('clk:main', clockState === 1 ? 1 : 0, 'Clock Main');
  addDriver('clk:bar', clockState === 1 ? 0 : 1, 'Clock Bar');
  addDriver('clk:pulse', pulserState === 1 ? 1 : 0, 'Pulser Output');

  // Step 4: Iterative Gate & IC Propagation
  const pinValues: Record<string, LogicValue> = {};
  let iteration = 0;
  let changed = true;
  const maxIterations = 25;

  while (changed && iteration++ < maxIterations) {
    changed = false;

    // Resolve net values
    const netValues: Record<string, LogicValue> = {};
    Object.keys(netDrivers).forEach(net => {
      const drivers = netDrivers[net];
      const has1 = drivers.some(d => d.val === 1);
      const has0 = drivers.some(d => d.val === 0);

      if (has1 && has0) {
        netValues[net] = 'CONFLICT';
      } else if (has1) {
        netValues[net] = 1;
      } else if (has0) {
        netValues[net] = 0;
      } else {
        netValues[net] = 'Z';
      }
    });

    function readTerminal(tid: string): LogicValue {
      const net = find(tid);
      return netValues[net] !== undefined ? netValues[net] : 'Z';
    }

    // Evaluate each powered IC
    Object.keys(sockets).forEach(sockId => {
      const sock = sockets[sockId];
      if (!sock.ic) return;
      const icDef = IC_DEFINITIONS[sock.ic];
      if (!icDef) return;

      const isPowered = socketPower[sockId];
      if (!isPowered) {
        Object.keys(icDef.pinout).forEach(pStr => {
          const p = parseInt(pStr, 10);
          if (icDef.pinout[p].type === 'out') {
            pinValues[`${sockId}:p${p}`] = 'Z';
          }
        });
        return;
      }

      // Combinational logic gates
      if (icDef.gates) {
        icDef.gates.forEach(g => {
          const inVals = g.inputs.map(p => readTerminal(`${sockId}:p${p}`));
          const outVal = g.fn(...inVals);
          const outTid = `${sockId}:p${g.output}`;
          const prevVal = pinValues[outTid];

          if (prevVal !== outVal) {
            pinValues[outTid] = outVal;
            changed = true;
          }
          if (outVal !== 'Z') {
            addDriver(outTid, outVal, `${sockId} Output Pin ${g.output}`);
          }
        });
      }

      // Evaluator for complex combinational ICs (7483, 74151, 74153)
      else if (icDef.evaluate) {
        const inputMap: Record<number, LogicValue> = {};
        for (let p = 1; p <= icDef.pins; p++) {
          inputMap[p] = readTerminal(`${sockId}:p${p}`);
        }
        const outMap = icDef.evaluate(inputMap);
        Object.keys(outMap).forEach(pStr => {
          const p = parseInt(pStr, 10);
          const outTid = `${sockId}:p${p}`;
          const outVal = outMap[p];
          if (pinValues[outTid] !== outVal) {
            pinValues[outTid] = outVal;
            changed = true;
          }
          if (outVal !== 'Z') {
            addDriver(outTid, outVal, `${sockId} Output Pin ${p}`);
          }
        });
      }

      // 7476 Dual JK Flip-Flop
      else if (sock.ic === '7476' && icDef.evaluateSequential) {
        if (!sock.icState && icDef.initInternalState) {
          sock.icState = icDef.initInternalState();
        }
        const inputMap: Record<number, LogicValue> = {};
        for (let p = 1; p <= 16; p++) {
          inputMap[p] = readTerminal(`${sockId}:p${p}`);
        }
        const outMap = icDef.evaluateSequential(sock.icState, inputMap, false);
        [7, 8, 10, 9].forEach(p => {
          const outTid = `${sockId}:p${p}`;
          const outVal = outMap[p];
          pinValues[outTid] = outVal;
          if (outVal !== 'Z') {
            addDriver(outTid, outVal, `${sockId} Output Pin ${p}`);
          }
        });
      }

      // 7490 Decade Counter
      else if (sock.ic === '7490' && icDef.evaluateSequential) {
        if (!sock.icState && icDef.initInternalState) {
          sock.icState = icDef.initInternalState();
        }
        const inputMap: Record<number, LogicValue> = {};
        for (let p = 1; p <= 14; p++) {
          inputMap[p] = readTerminal(`${sockId}:p${p}`);
        }
        const outMap = icDef.evaluateSequential(sock.icState, inputMap, false);
        [12, 9, 8, 11].forEach(p => {
          const outTid = `${sockId}:p${p}`;
          const outVal = outMap[p];
          pinValues[outTid] = outVal;
          if (outVal !== 'Z') {
            addDriver(outTid, outVal, `${sockId} Output Pin ${p}`);
          }
        });
      }
    });
  }

  // Resolve final net values
  const finalNetValues: Record<string, LogicValue> = {};
  Object.keys(netDrivers).forEach(net => {
    const drivers = netDrivers[net];
    const has1 = drivers.some(d => d.val === 1);
    const has0 = drivers.some(d => d.val === 0);
    if (has1 && has0) {
      finalNetValues[net] = 'CONFLICT';
      hasErrors = true;
      const driverNames = drivers.map(d => d.desc).join(', ');
      const msg = `BUS CONTENTION / SHORT CIRCUIT on net! Opposing signals driven by: ${driverNames}`;
      signalList.push({ type: 'err', msg });
      diagnostics.push({ type: 'err', msg });
    } else if (has1) {
      finalNetValues[net] = 1;
    } else if (has0) {
      finalNetValues[net] = 0;
    } else {
      finalNetValues[net] = 'Z';
    }
  });

  if (signalList.length === 0) {
    signalList.push({ type: 'ok', msg: 'No signal conflicts or floating inputs detected.' });
  }

  function getTerminalNetValue(tid: string): LogicValue {
    const net = find(tid);
    return finalNetValues[net] !== undefined ? finalNetValues[net] : 'Z';
  }

  // Board Output LEDs (L16 to L1)
  for (let i = 1; i <= 16; i++) {
    outputLeds[i] = getTerminalNetValue(`out:${i}`);
  }

  // 7-Segment Display A
  const valA3 = getTerminalNetValue('seg:a3');
  const valA2 = getTerminalNetValue('seg:a2');
  const valA1 = getTerminalNetValue('seg:a1');
  const valA0 = getTerminalNetValue('seg:a0');
  let segA = '—';
  if (valA3 !== 'Z' || valA2 !== 'Z' || valA1 !== 'Z' || valA0 !== 'Z') {
    const binA =
      ((valA3 === 1 ? 1 : 0) << 3) |
      ((valA2 === 1 ? 1 : 0) << 2) |
      ((valA1 === 1 ? 1 : 0) << 1) |
      (valA0 === 1 ? 1 : 0);
    segA = binA.toString(16).toUpperCase();
  }

  // 7-Segment Display B
  const valB3 = getTerminalNetValue('seg:b3');
  const valB2 = getTerminalNetValue('seg:b2');
  const valB1 = getTerminalNetValue('seg:b1');
  const valB0 = getTerminalNetValue('seg:b0');
  let segB = '—';
  if (valB3 !== 'Z' || valB2 !== 'Z' || valB1 !== 'Z' || valB0 !== 'Z') {
    const binB =
      ((valB3 === 1 ? 1 : 0) << 3) |
      ((valB2 === 1 ? 1 : 0) << 2) |
      ((valB1 === 1 ? 1 : 0) << 1) |
      (valB0 === 1 ? 1 : 0);
    segB = binB.toString(16).toUpperCase();
  }

  // Logic Probe
  const probeVal = getTerminalNetValue('probe');
  const probeLedH = probeVal === 1;
  const probeLedL = probeVal === 0;

  // Active Nets List
  const netGroups: Record<string, Set<string>> = {};
  wires.forEach(w => {
    const netA = parent[w.from] || w.from;
    if (!netGroups[netA]) netGroups[netA] = new Set();
    netGroups[netA].add(formatTerminalName(w.from, sockets));
    netGroups[netA].add(formatTerminalName(w.to, sockets));
  });

  const netKeys = Object.keys(netGroups);
  if (netKeys.length === 0) {
    netList.push({ type: 'info', msg: 'No patch wires connected on board.' });
  } else {
    netKeys.forEach((k, idx) => {
      const terms = Array.from(netGroups[k]).join(' ⟷ ');
      netList.push({ type: 'info', msg: `Net #${idx + 1}: ${terms}` });
    });
  }

  return {
    nets: parent,
    netValues: finalNetValues,
    netDrivers,
    pinValues,
    socketPower,
    outputLeds,
    segA,
    segB,
    probeLedH,
    probeLedL,
    diagnostics,
    powerList,
    signalList,
    netList,
    hasErrors,
    hasWarnings,
  };
}
