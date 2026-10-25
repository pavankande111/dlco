import { describe, it, expect } from 'vitest';
import { IC_DEFINITIONS } from '../logic/icDefinitions';
import { LogicValue } from '../types';

describe('7490 Decade & Binary Counter', () => {
  const ic = IC_DEFINITIONS['7490'];

  it('verifies exact physical pinout (Pin 5: VCC, Pin 10: GND, 14 pins total)', () => {
    expect(ic.pins).toBe(14);
    expect(ic.vccPin).toBe(5);
    expect(ic.gndPin).toBe(10);

    expect(ic.pinout[1].name).toBe('CKB');
    expect(ic.pinout[2].name).toBe('R0(1)');
    expect(ic.pinout[3].name).toBe('R0(2)');
    expect(ic.pinout[5].name).toBe('VCC');
    expect(ic.pinout[6].name).toBe('R9(1)');
    expect(ic.pinout[7].name).toBe('R9(2)');
    expect(ic.pinout[8].name).toBe('QC');
    expect(ic.pinout[9].name).toBe('QB');
    expect(ic.pinout[10].name).toBe('GND');
    expect(ic.pinout[11].name).toBe('QD');
    expect(ic.pinout[12].name).toBe('QA');
    expect(ic.pinout[14].name).toBe('CKA');
  });

  describe('Asynchronous Master Reset & Set', () => {
    it('resets all four bits to 0000 when R0(1)=1 and R0(2)=1', () => {
      const state = ic.initInternalState!();
      state.qa = 1;
      state.b5Count = 4; // QD=1

      const inputs: Record<number, LogicValue> = {
        2: 1, 3: 1, // R0(1)=1, R0(2)=1
        6: 0, 7: 0
      };
      const res = ic.evaluateSequential!(state, inputs);
      expect(res[12]).toBe(0); // QA
      expect(res[9]).toBe(0);  // QB
      expect(res[8]).toBe(0);  // QC
      expect(res[11]).toBe(0); // QD
    });

    it('sets counter to 1001 (BCD 9) when R9(1)=1 and R9(2)=1', () => {
      const state = ic.initInternalState!();
      const inputs: Record<number, LogicValue> = {
        2: 0, 3: 0,
        6: 1, 7: 1 // R9(1)=1, R9(2)=1
      };
      const res = ic.evaluateSequential!(state, inputs);
      expect(res[12]).toBe(1); // QA = 1
      expect(res[9]).toBe(0);  // QB = 0
      expect(res[8]).toBe(0);  // QC = 0
      expect(res[11]).toBe(1); // QD = 1
    });
  });

  describe('Divide-by-2 Section (CKA)', () => {
    it('toggles QA on each negative clock edge on CKA', () => {
      const state = ic.initInternalState!();
      state.lastCka = 0;

      // Pulse 1: CKA 0 -> 1 -> 0
      ic.evaluateSequential!(state, { 2: 0, 3: 0, 6: 0, 7: 0, 14: 1 });
      let res = ic.evaluateSequential!(state, { 2: 0, 3: 0, 6: 0, 7: 0, 14: 0 });
      expect(res[12]).toBe(1); // QA toggled to 1

      // Pulse 2: CKA 0 -> 1 -> 0
      ic.evaluateSequential!(state, { 2: 0, 3: 0, 6: 0, 7: 0, 14: 1 });
      res = ic.evaluateSequential!(state, { 2: 0, 3: 0, 6: 0, 7: 0, 14: 0 });
      expect(res[12]).toBe(0); // QA toggled back to 0
    });
  });

  describe('Complete BCD Decade Counting Sequence (0 through 9 and back to 0)', () => {
    it('counts accurately from 0000 to 1001 and wraps back to 0000', () => {
      const state = ic.initInternalState!();
      state.lastCka = 0;

      const expectedSequence = [
        { QD: 0, QC: 0, QB: 0, QA: 1, count: 1 },
        { QD: 0, QC: 0, QB: 1, QA: 0, count: 2 },
        { QD: 0, QC: 0, QB: 1, QA: 1, count: 3 },
        { QD: 0, QC: 1, QB: 0, QA: 0, count: 4 },
        { QD: 0, QC: 1, QB: 0, QA: 1, count: 5 },
        { QD: 0, QC: 1, QB: 1, QA: 0, count: 6 },
        { QD: 0, QC: 1, QB: 1, QA: 1, count: 7 },
        { QD: 1, QC: 0, QB: 0, QA: 0, count: 8 },
        { QD: 1, QC: 0, QB: 0, QA: 1, count: 9 },
        { QD: 0, QC: 0, QB: 0, QA: 0, count: 0 } // Wraps to 0
      ];

      expectedSequence.forEach(step => {
        // Clock High
        ic.evaluateSequential!(state, { 2: 0, 3: 0, 6: 0, 7: 0, 14: 1 });
        // Clock Low (Negative Edge on CKA)
        const res = ic.evaluateSequential!(state, { 2: 0, 3: 0, 6: 0, 7: 0, 14: 0 });

        expect(res[12]).toBe(step.QA);
        expect(res[9]).toBe(step.QB);
        expect(res[8]).toBe(step.QC);
        expect(res[11]).toBe(step.QD);
      });
    });
  });
});
