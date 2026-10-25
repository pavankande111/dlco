import { describe, it, expect } from 'vitest';
import { IC_DEFINITIONS } from '../logic/icDefinitions';
import { LogicValue } from '../types';

describe('74153 Dual 4-Line to 1-Line Multiplexer', () => {
  const ic = IC_DEFINITIONS['74153'];

  it('has accurate physical pin configuration (16 pins, VCC=16, GND=8)', () => {
    expect(ic.pins).toBe(16);
    expect(ic.vccPin).toBe(16);
    expect(ic.gndPin).toBe(8);

    // Verify critical pin assignments per TI 74153 datasheet
    expect(ic.pinout[1].name).toBe('1G̅');
    expect(ic.pinout[2].name).toBe('B');
    expect(ic.pinout[3].name).toBe('1C3');
    expect(ic.pinout[4].name).toBe('1C2');
    expect(ic.pinout[5].name).toBe('1C1');
    expect(ic.pinout[6].name).toBe('1C0');
    expect(ic.pinout[7].name).toBe('1Y');
    expect(ic.pinout[8].name).toBe('GND');
    expect(ic.pinout[9].name).toBe('2Y');
    expect(ic.pinout[10].name).toBe('2C0');
    expect(ic.pinout[11].name).toBe('2C1');
    expect(ic.pinout[12].name).toBe('2C2');
    expect(ic.pinout[13].name).toBe('2C3');
    expect(ic.pinout[14].name).toBe('A');
    expect(ic.pinout[15].name).toBe('2G̅');
    expect(ic.pinout[16].name).toBe('VCC');
  });

  describe('Section 1 Multiplexer', () => {
    it('forces output 1Y to LOW (0) when 1G̅ is HIGH (Disabled)', () => {
      const inputs: Record<number, LogicValue> = {
        1: 1, // 1G_bar = 1 (Disabled)
        2: 0, 14: 0, // Select B, A
        6: 1, 5: 1, 4: 1, 3: 1 // 1C0..1C3
      };
      const res = ic.evaluate!(inputs);
      expect(res[7]).toBe(0); // 1Y must be 0
    });

    it('correctly selects and routes all four inputs (1C0..1C3) when enabled (1G̅=0)', () => {
      const map1: Record<number, number> = { 0: 6, 1: 5, 2: 4, 3: 3 };

      for (let sel = 0; sel < 4; sel++) {
        const b = ((sel >> 1) & 1) as 0 | 1;
        const a = (sel & 1) as 0 | 1;

        // When selected input is 1
        const inHigh: Record<number, LogicValue> = {
          1: 0, // Enabled
          2: b,
          14: a
        };
        for (let i = 0; i < 4; i++) {
          inHigh[map1[i]] = i === sel ? 1 : 0;
        }
        expect(ic.evaluate!(inHigh)[7]).toBe(1);

        // When selected input is 0
        const inLow: Record<number, LogicValue> = {
          1: 0,
          2: b,
          14: a
        };
        for (let i = 0; i < 4; i++) {
          inLow[map1[i]] = i === sel ? 0 : 1;
        }
        expect(ic.evaluate!(inLow)[7]).toBe(0);
      }
    });
  });

  describe('Section 2 Multiplexer', () => {
    it('forces output 2Y to LOW (0) when 2G̅ is HIGH (Disabled)', () => {
      const inputs: Record<number, LogicValue> = {
        15: 1, // 2G_bar = 1 (Disabled)
        2: 0, 14: 0,
        10: 1, 11: 1, 12: 1, 13: 1
      };
      const res = ic.evaluate!(inputs);
      expect(res[9]).toBe(0); // 2Y must be 0
    });

    it('correctly selects and routes all four inputs (2C0..2C3) when enabled (2G̅=0)', () => {
      const map2: Record<number, number> = { 0: 10, 1: 11, 2: 12, 3: 13 };

      for (let sel = 0; sel < 4; sel++) {
        const b = ((sel >> 1) & 1) as 0 | 1;
        const a = (sel & 1) as 0 | 1;

        // When selected input is 1
        const inHigh: Record<number, LogicValue> = {
          15: 0, // Enabled
          2: b,
          14: a
        };
        for (let i = 0; i < 4; i++) {
          inHigh[map2[i]] = i === sel ? 1 : 0;
        }
        expect(ic.evaluate!(inHigh)[9]).toBe(1);

        // When selected input is 0
        const inLow: Record<number, LogicValue> = {
          15: 0,
          2: b,
          14: a
        };
        for (let i = 0; i < 4; i++) {
          inLow[map2[i]] = i === sel ? 0 : 1;
        }
        expect(ic.evaluate!(inLow)[9]).toBe(0);
      }
    });
  });

  it('operates both multiplexer sections independently and simultaneously', () => {
    // Select B=1, A=0 -> sel=2 (selects 1C2 for Sec 1 and 2C2 for Sec 2)
    // Section 1: 1G_bar=0 (Enabled), 1C2=1 -> 1Y=1
    // Section 2: 2G_bar=1 (Disabled) -> 2Y=0
    const inputs: Record<number, LogicValue> = {
      1: 0,  // 1G_bar Enabled
      15: 1, // 2G_bar Disabled
      2: 1,  // B
      14: 0, // A
      4: 1,  // 1C2
      12: 1  // 2C2
    };

    const res = ic.evaluate!(inputs);
    expect(res[7]).toBe(1); // 1Y is enabled and reads 1C2
    expect(res[9]).toBe(0); // 2Y is disabled and remains 0
  });
});
