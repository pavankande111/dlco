import { describe, it, expect } from 'vitest';
import { IC_DEFINITIONS } from '../logic/icDefinitions';

describe('Combinational Gate ICs (7400, 7404, 7408, 7432, 7486)', () => {
  describe('7400 Quad 2-Input NAND Gate', () => {
    const ic = IC_DEFINITIONS['7400'];

    it('has 14 pins, VCC=14, GND=7, and 4 NAND gates', () => {
      expect(ic.pins).toBe(14);
      expect(ic.vccPin).toBe(14);
      expect(ic.gndPin).toBe(7);
      expect(ic.gates?.length).toBe(4);
    });

    it('verifies truth table for all 4 NAND gates', () => {
      ic.gates?.forEach(gate => {
        expect(gate.fn(0, 0)).toBe(1);
        expect(gate.fn(0, 1)).toBe(1);
        expect(gate.fn(1, 0)).toBe(1);
        expect(gate.fn(1, 1)).toBe(0);
        expect(gate.fn('Z', 1)).toBe('Z');
        expect(gate.fn(0, 'Z')).toBe('Z');
      });
    });
  });

  describe('7404 Hex Inverter (NOT Gates)', () => {
    const ic = IC_DEFINITIONS['7404'];

    it('has 14 pins, VCC=14, GND=7, and 6 NOT gates', () => {
      expect(ic.pins).toBe(14);
      expect(ic.vccPin).toBe(14);
      expect(ic.gndPin).toBe(7);
      expect(ic.gates?.length).toBe(6);
    });

    it('verifies truth table for all 6 inverter gates', () => {
      ic.gates?.forEach(gate => {
        expect(gate.fn(0)).toBe(1);
        expect(gate.fn(1)).toBe(0);
        expect(gate.fn('Z')).toBe('Z');
      });
    });
  });

  describe('7408 Quad 2-Input AND Gate', () => {
    const ic = IC_DEFINITIONS['7408'];

    it('has 14 pins, VCC=14, GND=7, and 4 AND gates', () => {
      expect(ic.pins).toBe(14);
      expect(ic.vccPin).toBe(14);
      expect(ic.gndPin).toBe(7);
      expect(ic.gates?.length).toBe(4);
    });

    it('verifies truth table for all 4 AND gates', () => {
      ic.gates?.forEach(gate => {
        expect(gate.fn(0, 0)).toBe(0);
        expect(gate.fn(0, 1)).toBe(0);
        expect(gate.fn(1, 0)).toBe(0);
        expect(gate.fn(1, 1)).toBe(1);
        expect(gate.fn('Z', 0)).toBe('Z');
      });
    });
  });

  describe('7432 Quad 2-Input OR Gate', () => {
    const ic = IC_DEFINITIONS['7432'];

    it('has 14 pins, VCC=14, GND=7, and 4 OR gates', () => {
      expect(ic.pins).toBe(14);
      expect(ic.vccPin).toBe(14);
      expect(ic.gndPin).toBe(7);
      expect(ic.gates?.length).toBe(4);
    });

    it('verifies truth table for all 4 OR gates', () => {
      ic.gates?.forEach(gate => {
        expect(gate.fn(0, 0)).toBe(0);
        expect(gate.fn(0, 1)).toBe(1);
        expect(gate.fn(1, 0)).toBe(1);
        expect(gate.fn(1, 1)).toBe(1);
        expect(gate.fn('Z', 1)).toBe('Z');
      });
    });
  });

  describe('7486 Quad 2-Input XOR Gate', () => {
    const ic = IC_DEFINITIONS['7486'];

    it('has 14 pins, VCC=14, GND=7, and 4 XOR gates', () => {
      expect(ic.pins).toBe(14);
      expect(ic.vccPin).toBe(14);
      expect(ic.gndPin).toBe(7);
      expect(ic.gates?.length).toBe(4);
    });

    it('verifies truth table for all 4 XOR gates', () => {
      ic.gates?.forEach(gate => {
        expect(gate.fn(0, 0)).toBe(0);
        expect(gate.fn(0, 1)).toBe(1);
        expect(gate.fn(1, 0)).toBe(1);
        expect(gate.fn(1, 1)).toBe(0);
        expect(gate.fn('Z', 1)).toBe('Z');
      });
    });
  });
});
