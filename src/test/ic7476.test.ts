import { describe, it, expect } from 'vitest';
import { IC_DEFINITIONS } from '../logic/icDefinitions';
import { LogicValue } from '../types';

describe('7476 Dual J-K Flip-Flop with Preset & Clear', () => {
  const ic = IC_DEFINITIONS['7476'];

  it('verifies exact physical pinout (Pin 5: VCC, Pin 13: GND, 16 pins total)', () => {
    expect(ic.pins).toBe(16);
    expect(ic.vccPin).toBe(5);
    expect(ic.gndPin).toBe(13);

    // Verify flip-flop 1 pinout
    expect(ic.pinout[1].name).toBe('1CLK');
    expect(ic.pinout[2].name).toBe('1J');
    expect(ic.pinout[3].name).toBe('1K');
    expect(ic.pinout[4].name).toBe('1PRE̅');
    expect(ic.pinout[6].name).toBe('1CLR̅');
    expect(ic.pinout[7].name).toBe('1Q');
    expect(ic.pinout[8].name).toBe('1Q̅');

    // Verify flip-flop 2 pinout
    expect(ic.pinout[16].name).toBe('2CLK');
    expect(ic.pinout[15].name).toBe('2J');
    expect(ic.pinout[14].name).toBe('2K');
    expect(ic.pinout[12].name).toBe('2PRE̅');
    expect(ic.pinout[11].name).toBe('2CLR̅');
    expect(ic.pinout[10].name).toBe('2Q');
    expect(ic.pinout[9].name).toBe('2Q̅');
  });

  describe('Asynchronous Controls (PRE̅ and CLR̅)', () => {
    it('sets Q=1, Q̅=0 when 1PRE̅=0 and 1CLR̅=1 (Asynchronous Set)', () => {
      const state = ic.initInternalState!();
      const inputs: Record<number, LogicValue> = {
        4: 0, // 1PRE_bar active
        6: 1, // 1CLR_bar inactive
        1: 1, // clock high
        2: 0, 3: 1 // J=0, K=1 would normally reset, but PRE overrides!
      };
      const res = ic.evaluateSequential!(state, inputs);
      expect(res[7]).toBe(1); // 1Q
      expect(res[8]).toBe(0); // 1Q_bar
    });

    it('clears Q=0, Q̅=1 when 1PRE̅=1 and 1CLR̅=0 (Asynchronous Clear)', () => {
      const state = ic.initInternalState!();
      state.ff1.q = 1;
      state.ff1.qBar = 0;

      const inputs: Record<number, LogicValue> = {
        4: 1, // 1PRE_bar inactive
        6: 0, // 1CLR_bar active
        1: 1,
        2: 1, 3: 0 // J=1, K=0 would normally set, but CLR overrides!
      };
      const res = ic.evaluateSequential!(state, inputs);
      expect(res[7]).toBe(0); // 1Q
      expect(res[8]).toBe(1); // 1Q_bar
    });

    it('handles simultaneous active PRE̅=0 and CLR̅=0 (Both High unstable state)', () => {
      const state = ic.initInternalState!();
      const inputs: Record<number, LogicValue> = {
        4: 0,
        6: 0
      };
      const res = ic.evaluateSequential!(state, inputs);
      expect(res[7]).toBe(1);
      expect(res[8]).toBe(1);
    });
  });

  describe('Clock-Triggered Transitions (Negative-Edge: 1 -> 0)', () => {
    it('holds previous state on negative clock edge when J=0 and K=0', () => {
      const state = ic.initInternalState!();
      state.ff1.q = 1;
      state.ff1.qBar = 0;
      state.ff1.lastClk = 1;

      const inputs: Record<number, LogicValue> = {
        4: 1, 6: 1, // PRE, CLR inactive
        1: 0,       // Falling clock edge (1 -> 0)
        2: 0, 3: 0  // Hold
      };
      const res = ic.evaluateSequential!(state, inputs);
      expect(res[7]).toBe(1);
      expect(res[8]).toBe(0);
    });

    it('resets Q=0 on negative clock edge when J=0 and K=1', () => {
      const state = ic.initInternalState!();
      state.ff1.q = 1;
      state.ff1.qBar = 0;
      state.ff1.lastClk = 1;

      const inputs: Record<number, LogicValue> = {
        4: 1, 6: 1,
        1: 0,
        2: 0, 3: 1
      };
      const res = ic.evaluateSequential!(state, inputs);
      expect(res[7]).toBe(0);
      expect(res[8]).toBe(1);
    });

    it('sets Q=1 on negative clock edge when J=1 and K=0', () => {
      const state = ic.initInternalState!();
      state.ff1.q = 0;
      state.ff1.qBar = 1;
      state.ff1.lastClk = 1;

      const inputs: Record<number, LogicValue> = {
        4: 1, 6: 1,
        1: 0,
        2: 1, 3: 0
      };
      const res = ic.evaluateSequential!(state, inputs);
      expect(res[7]).toBe(1);
      expect(res[8]).toBe(0);
    });

    it('toggles output on successive negative clock edges when J=1 and K=1', () => {
      const state = ic.initInternalState!();
      state.ff1.q = 0;
      state.ff1.qBar = 1;
      state.ff1.lastClk = 0;

      // Pulse 1: Clock goes High (0 -> 1): No transition on rising edge
      let res = ic.evaluateSequential!(state, { 4: 1, 6: 1, 1: 1, 2: 1, 3: 1 });
      expect(res[7]).toBe(0);

      // Pulse 1: Clock goes Low (1 -> 0): Falling edge triggers toggle!
      res = ic.evaluateSequential!(state, { 4: 1, 6: 1, 1: 0, 2: 1, 3: 1 });
      expect(res[7]).toBe(1); // Toggled to 1
      expect(res[8]).toBe(0);

      // Pulse 2: Clock goes High
      res = ic.evaluateSequential!(state, { 4: 1, 6: 1, 1: 1, 2: 1, 3: 1 });
      expect(res[7]).toBe(1);

      // Pulse 2: Clock goes Low: Second toggle
      res = ic.evaluateSequential!(state, { 4: 1, 6: 1, 1: 0, 2: 1, 3: 1 });
      expect(res[7]).toBe(0); // Toggled back to 0
      expect(res[8]).toBe(1);
    });
  });

  describe('Flip-Flop 2 Independent Operation', () => {
    it('correctly operates FF2 without interfering with FF1', () => {
      const state = ic.initInternalState!();
      state.ff1.q = 1;
      state.ff2.q = 0;
      state.ff2.lastClk = 1;

      // Toggle FF2
      const res = ic.evaluateSequential!(state, {
        4: 1, 6: 1, 1: 1, // FF1 holds
        12: 1, 11: 1, 16: 0, 15: 1, 14: 1 // FF2 clock falling edge with J=1, K=1
      });

      expect(res[7]).toBe(1);  // FF1 unchanged
      expect(res[10]).toBe(1); // FF2 toggled to 1
      expect(res[9]).toBe(0);  // FF2 Q_bar is 0
    });
  });
});
