import { describe, it, expect } from 'vitest';
import { IC_DEFINITIONS } from '../logic/icDefinitions';
import { LogicValue } from '../types';

describe('74151 8-Line to 1-Line Multiplexer', () => {
  const ic = IC_DEFINITIONS['74151'];

  it('has 16 pins, VCC=16, GND=8', () => {
    expect(ic.pins).toBe(16);
    expect(ic.vccPin).toBe(16);
    expect(ic.gndPin).toBe(8);
  });

  it('disables outputs when Strobe G̅ is HIGH (Y=0, W=1)', () => {
    const inputs: Record<number, LogicValue> = {
      7: 1, // Strobe G_bar HIGH
      9: 0, 10: 0, 11: 0, // Select
      4: 1, 3: 1, 2: 1, 1: 1, 15: 1, 14: 1, 13: 1, 12: 1 // Data D0..D7
    };
    const res = ic.evaluate!(inputs);
    expect(res[5]).toBe(0); // Y
    expect(res[6]).toBe(1); // W (Y_bar)
  });

  it('correctly multiplexes all 8 data inputs D0 to D7 when Strobe G̅ is LOW', () => {
    // Data pin map: D0=4, D1=3, D2=2, D3=1, D4=15, D5=14, D6=13, D7=12
    const dMap: Record<number, number> = { 0: 4, 1: 3, 2: 2, 3: 1, 4: 15, 5: 14, 6: 13, 7: 12 };

    for (let sel = 0; sel < 8; sel++) {
      const c = (((sel >> 2) & 1) === 1 ? 1 : 0) as LogicValue;
      const b = (((sel >> 1) & 1) === 1 ? 1 : 0) as LogicValue;
      const a = ((sel & 1) === 1 ? 1 : 0) as LogicValue;

      // Test with selected bit = 1
      const inputsHigh: Record<number, LogicValue> = {
        7: 0, // Strobe LOW (Enabled)
        9: c,
        10: b,
        11: a
      };
      // Set all data inputs to 0, except selected bit to 1
      for (let d = 0; d < 8; d++) {
        inputsHigh[dMap[d]] = (d === sel ? 1 : 0) as LogicValue;
      }
      const resHigh = ic.evaluate!(inputsHigh);
      expect(resHigh[5]).toBe(1); // Y = 1
      expect(resHigh[6]).toBe(0); // W = 0

      // Test with selected bit = 0
      const inputsLow: Record<number, LogicValue> = {
        7: 0,
        9: c,
        10: b,
        11: a
      };
      // Set all data inputs to 1, except selected bit to 0
      for (let d = 0; d < 8; d++) {
        inputsLow[dMap[d]] = (d === sel ? 0 : 1) as LogicValue;
      }
      const resLow = ic.evaluate!(inputsLow);
      expect(resLow[5]).toBe(0); // Y = 0
      expect(resLow[6]).toBe(1); // W = 1
    }
  });

  it('returns Z when select inputs or enable are floating (Z)', () => {
    const inputs: Record<number, LogicValue> = {
      7: 'Z',
      9: 0, 10: 0, 11: 0
    };
    const res = ic.evaluate!(inputs);
    expect(res[5]).toBe('Z');
    expect(res[6]).toBe('Z');
  });
});
