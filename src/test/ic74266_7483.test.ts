import { describe, it, expect } from 'vitest';
import { IC_DEFINITIONS } from '../logic/icDefinitions';
import { LogicValue } from '../types';

describe('IC 74266 Quad 2-Input Exclusive-NOR Gate', () => {
  const ic = IC_DEFINITIONS['74266'];

  it('verifies pinout according to user diagram (Pin 14: VCC, Pin 7: GND, Pin 4: 2Y, Pin 10: 3Y, Pin 11: 4Y)', () => {
    expect(ic.pins).toBe(14);
    expect(ic.vccPin).toBe(14);
    expect(ic.gndPin).toBe(7);

    // Gate 1: 1A=1, 1B=2, 1Y=3
    expect(ic.pinout[1].name).toBe('1A');
    expect(ic.pinout[2].name).toBe('1B');
    expect(ic.pinout[3].name).toBe('1Y');

    // Gate 2: 2Y=4 (output), 2A=5, 2B=6
    expect(ic.pinout[4].name).toBe('2Y');
    expect(ic.pinout[5].name).toBe('2A');
    expect(ic.pinout[6].name).toBe('2B');

    // Gate 3: 3A=8, 3B=9, 3Y=10 (output)
    expect(ic.pinout[8].name).toBe('3A');
    expect(ic.pinout[9].name).toBe('3B');
    expect(ic.pinout[10].name).toBe('3Y');

    // Gate 4: 4Y=11 (output), 4A=12, 4B=13
    expect(ic.pinout[11].name).toBe('4Y');
    expect(ic.pinout[12].name).toBe('4A');
    expect(ic.pinout[13].name).toBe('4B');
  });

  it('verifies XNOR truth table for all four gates', () => {
    ic.gates?.forEach(gate => {
      // 0 XNOR 0 = 1
      expect(gate.fn(0, 0)).toBe(1);
      // 0 XNOR 1 = 0
      expect(gate.fn(0, 1)).toBe(0);
      // 1 XNOR 0 = 0
      expect(gate.fn(1, 0)).toBe(0);
      // 1 XNOR 1 = 1
      expect(gate.fn(1, 1)).toBe(1);
      // Z propagation
      expect(gate.fn('Z', 1)).toBe('Z');
    });
  });
});

describe('IC 7483 4-Bit Binary Full Adder / BCD Adder', () => {
  const ic = IC_DEFINITIONS['7483'];

  it('verifies exact pin mapping from user diagram (Pin 5: VCC, Pin 12: GND, 16 pins total)', () => {
    expect(ic.pins).toBe(16);
    expect(ic.vccPin).toBe(5);
    expect(ic.gndPin).toBe(12);

    expect(ic.pinout[1].name).toBe('A3');
    expect(ic.pinout[2].name).toBe('S2');
    expect(ic.pinout[3].name).toBe('A2');
    expect(ic.pinout[4].name).toBe('B2');
    expect(ic.pinout[5].name).toBe('VCC');
    expect(ic.pinout[6].name).toBe('S1');
    expect(ic.pinout[7].name).toBe('B1');
    expect(ic.pinout[8].name).toBe('A1');
    expect(ic.pinout[9].name).toBe('S0');
    expect(ic.pinout[10].name).toBe('A0');
    expect(ic.pinout[11].name).toBe('B0');
    expect(ic.pinout[12].name).toBe('GND');
    expect(ic.pinout[13].name).toBe('CIN');
    expect(ic.pinout[14].name).toBe('COUT');
    expect(ic.pinout[15].name).toBe('S3');
    expect(ic.pinout[16].name).toBe('B3');
  });

  it('performs 4-bit binary additions with fast carry', () => {
    // Helper to format inputs
    const makeInputs = (valA: number, valB: number, cin: 0 | 1): Record<number, LogicValue> => {
      return {
        1: ((valA >> 3) & 1) as LogicValue,  // A3
        3: ((valA >> 2) & 1) as LogicValue,  // A2
        8: ((valA >> 1) & 1) as LogicValue,  // A1
        10: (valA & 1) as LogicValue,        // A0
        16: ((valB >> 3) & 1) as LogicValue, // B3
        4: ((valB >> 2) & 1) as LogicValue,  // B2
        7: ((valB >> 1) & 1) as LogicValue,  // B1
        11: (valB & 1) as LogicValue,        // B0
        13: cin                              // CIN
      };
    };

    // Case 1: 5 + 3 = 8 (0101 + 0011 = 1000, Cout=0)
    let res = ic.evaluate!(makeInputs(5, 3, 0));
    expect(res[9]).toBe(0);  // S0
    expect(res[6]).toBe(0);  // S1
    expect(res[2]).toBe(0);  // S2
    expect(res[15]).toBe(1); // S3 = 1
    expect(res[14]).toBe(0); // COUT = 0

    // Case 2: 9 + 7 = 16 (1001 + 0111 = 1 0000 -> Sum=0, Cout=1)
    res = ic.evaluate!(makeInputs(9, 7, 0));
    expect(res[9]).toBe(0);  // S0
    expect(res[6]).toBe(0);  // S1
    expect(res[2]).toBe(0);  // S2
    expect(res[15]).toBe(0); // S3
    expect(res[14]).toBe(1); // COUT = 1

    // Case 3: 15 + 15 + Cin(1) = 31 (1111 + 1111 + 1 = 1 1111 -> Sum=15, Cout=1)
    res = ic.evaluate!(makeInputs(15, 15, 1));
    expect(res[9]).toBe(1);  // S0
    expect(res[6]).toBe(1);  // S1
    expect(res[2]).toBe(1);  // S2
    expect(res[15]).toBe(1); // S3
    expect(res[14]).toBe(1); // COUT = 1

    // Case 4: 0 + 0 + 0 = 0
    res = ic.evaluate!(makeInputs(0, 0, 0));
    expect(res[9]).toBe(0);
    expect(res[6]).toBe(0);
    expect(res[2]).toBe(0);
    expect(res[15]).toBe(0);
    expect(res[14]).toBe(0);
  });
});
