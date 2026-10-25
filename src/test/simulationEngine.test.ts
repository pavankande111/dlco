import { describe, it, expect } from 'vitest';
import { runCircuitSimulation } from '../logic/simulationEngine';
import { Wire, SocketState } from '../types';

describe('Electrical Graph Simulation Engine', () => {
  const emptySockets = (): Record<string, SocketState> => ({
    U1: { ic: null, icState: null, isPowered: false },
    U2: { ic: null, icState: null, isPowered: false },
    U3: { ic: null, icState: null, isPowered: false },
    U4: { ic: null, icState: null, isPowered: false },
    U5: { ic: null, icState: null, isPowered: false },
    U6: { ic: null, icState: null, isPowered: false }
  });

  const defaultSwitches = (): Record<number, number> => {
    const sw: Record<number, number> = {};
    for (let i = 1; i <= 16; i++) sw[i] = 0;
    return sw;
  };

  it('turns off all outputs and displays when mains power is OFF', () => {
    const res = runCircuitSimulation(false, [], emptySockets(), defaultSwitches(), 0, 0);
    expect(res.segA).toBe('—');
    expect(res.segB).toBe('—');
    expect(res.probeLedH).toBe(false);
    expect(res.probeLedL).toBe(false);
    expect(res.hasWarnings).toBe(true);
  });

  it('marks seated IC as unpowered when VCC or GND is missing', () => {
    const sockets = emptySockets();
    sockets.U1 = { ic: '7400', icState: null, isPowered: false };

    // No wires connected to U1 VCC (pin 14) or GND (pin 7)
    const res = runCircuitSimulation(true, [], sockets, defaultSwitches(), 0, 0);
    expect(res.socketPower.U1).toBe(false);
    expect(res.hasErrors).toBe(true);
  });

  it('powers IC when Pin 14 is wired to VCC and Pin 7 is wired to GND', () => {
    const sockets = emptySockets();
    sockets.U1 = { ic: '7400', icState: null, isPowered: false };

    const wires: Wire[] = [
      { id: 1, from: 'vcc:1', to: 'U1:p14', color: '#dc2626' },
      { id: 2, from: 'gnd:1', to: 'U1:p7', color: '#16a34a' }
    ];

    const res = runCircuitSimulation(true, wires, sockets, defaultSwitches(), 0, 0);
    expect(res.socketPower.U1).toBe(true);
  });

  it('detects short circuits / bus contention when opposing signals are connected', () => {
    // Connect VCC (+5V) directly to GND (0V)
    const wires: Wire[] = [{ id: 1, from: 'vcc:1', to: 'gnd:1', color: '#dc2626' }];

    const res = runCircuitSimulation(true, wires, emptySockets(), defaultSwitches(), 0, 0);
    expect(res.hasErrors).toBe(true);
    expect(res.signalList.some(s => s.msg.includes('BUS CONTENTION / SHORT CIRCUIT'))).toBe(true);
  });

  it('simulates Full NAND Gate circuit: switches S1 & S2 to 7400 gate 1 to Output LED L1', () => {
    const sockets = emptySockets();
    sockets.U1 = { ic: '7400', icState: null, isPowered: false };

    const wires: Wire[] = [
      // Power U1
      { id: 1, from: 'vcc:1', to: 'U1:p14', color: '#dc2626' },
      { id: 2, from: 'gnd:1', to: 'U1:p7', color: '#16a34a' },
      // S1 to Pin 1 (1A), S2 to Pin 2 (1B)
      { id: 3, from: 'in:1', to: 'U1:p1', color: '#2563eb' },
      { id: 4, from: 'in:2', to: 'U1:p2', color: '#2563eb' },
      // Output Pin 3 (1Y) to LED L1 (Terminal OP1)
      { id: 5, from: 'U1:p3', to: 'out:1', color: '#9333ea' }
    ];

    const switches = defaultSwitches();

    // S1=0, S2=0 -> 1Y=1 -> L1=1 (ON)
    switches[1] = 0;
    switches[2] = 0;
    let res = runCircuitSimulation(true, wires, sockets, switches, 0, 0);
    expect(res.outputLeds[1]).toBe(1);

    // S1=1, S2=0 -> 1Y=1 -> L1=1 (ON)
    switches[1] = 1;
    switches[2] = 0;
    res = runCircuitSimulation(true, wires, sockets, switches, 0, 0);
    expect(res.outputLeds[1]).toBe(1);

    // S1=1, S2=1 -> 1Y=0 -> L1=0 (OFF)
    switches[1] = 1;
    switches[2] = 1;
    res = runCircuitSimulation(true, wires, sockets, switches, 0, 0);
    expect(res.outputLeds[1]).toBe(0);
  });

  it('decodes 4-bit binary input to 7-segment display', () => {
    // Wire S1..S4 to seg:a0..seg:a3
    const wires: Wire[] = [
      { id: 1, from: 'in:1', to: 'seg:a0', color: '#2563eb' },
      { id: 2, from: 'in:2', to: 'seg:a1', color: '#2563eb' },
      { id: 3, from: 'in:3', to: 'seg:a2', color: '#2563eb' },
      { id: 4, from: 'in:4', to: 'seg:a3', color: '#2563eb' }
    ];

    const switches = defaultSwitches();

    // 0000 -> 0
    let res = runCircuitSimulation(true, wires, emptySockets(), switches, 0, 0);
    expect(res.segA).toBe('0');

    // 1001 (9)
    switches[1] = 1; // A0=1
    switches[2] = 0; // A1=0
    switches[3] = 0; // A2=0
    switches[4] = 1; // A3=1
    res = runCircuitSimulation(true, wires, emptySockets(), switches, 0, 0);
    expect(res.segA).toBe('9');

    // 1111 (F)
    switches[2] = 1;
    switches[3] = 1;
    res = runCircuitSimulation(true, wires, emptySockets(), switches, 0, 0);
    expect(res.segA).toBe('F');
  });

  it('tests Logic Probe reading High and Low levels', () => {
    // Probe connected to VCC -> H lamp ON
    const wiresH: Wire[] = [{ id: 1, from: 'vcc:1', to: 'probe', color: '#dc2626' }];
    let res = runCircuitSimulation(true, wiresH, emptySockets(), defaultSwitches(), 0, 0);
    expect(res.probeLedH).toBe(true);
    expect(res.probeLedL).toBe(false);

    // Probe connected to GND -> L lamp ON
    const wiresL: Wire[] = [{ id: 1, from: 'gnd:1', to: 'probe', color: '#16a34a' }];
    res = runCircuitSimulation(true, wiresL, emptySockets(), defaultSwitches(), 0, 0);
    expect(res.probeLedH).toBe(false);
    expect(res.probeLedL).toBe(true);
  });
});
