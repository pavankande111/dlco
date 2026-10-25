import { ICDefinition, LogicValue } from '../types';

export const IC_DEFINITIONS: Record<string, ICDefinition> = {
  // 1. 7400 Quad 2-Input NAND Gate (Image 1)
  '7400': {
    id: '7400',
    name: '7400 Quad 2-Input NAND Gate',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Four independent 2-input NAND gates. Pin 14: VCC, Pin 7: GND.',
    preview: '1: 1A, 2: 1B, 3: 1Y | 4: 2A, 5: 2B, 6: 2Y | 8: 3Y, 9: 3A, 10: 3B | 11: 4Y, 12: 4A, 13: 4B',
    pinout: {
      1: { name: '1A', type: 'in', gate: 0, arg: 0, desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'in', gate: 0, arg: 1, desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'out', gate: 0, desc: 'Gate 1 Output (NAND)' },
      4: { name: '2A', type: 'in', gate: 1, arg: 0, desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'in', gate: 1, arg: 1, desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'out', gate: 1, desc: 'Gate 2 Output (NAND)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      8: { name: '3Y', type: 'out', gate: 2, desc: 'Gate 3 Output (NAND)' },
      9: { name: '3A', type: 'in', gate: 2, arg: 0, desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'in', gate: 2, arg: 1, desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'out', gate: 3, desc: 'Gate 4 Output (NAND)' },
      12: { name: '4A', type: 'in', gate: 3, arg: 0, desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'in', gate: 3, arg: 1, desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    gates: [
      {
        inputs: [1, 2],
        output: 3,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === 1 && b === 1 ? 0 : 1))
      },
      {
        inputs: [4, 5],
        output: 6,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === 1 && b === 1 ? 0 : 1))
      },
      {
        inputs: [9, 10],
        output: 8,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === 1 && b === 1 ? 0 : 1))
      },
      {
        inputs: [12, 13],
        output: 11,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === 1 && b === 1 ? 0 : 1))
      }
    ]
  },

  // 2. 7404 Hex Inverter (NOT Gates) (Image 3)
  '7404': {
    id: '7404',
    name: '7404 Hex Inverter (NOT Gates)',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Six independent inverter gates. Pin 14: VCC, Pin 7: GND.',
    preview: '1: A1, 2: Y1 | 3: A2, 4: Y2 | 5: A3, 6: Y3 | 8: Y4, 9: A4 | 10: Y5, 11: A5 | 12: Y6, 13: A6',
    pinout: {
      1: { name: 'A1', type: 'in', gate: 0, desc: 'Inverter 1 Input' },
      2: { name: 'Y1', type: 'out', gate: 0, desc: 'Inverter 1 Output' },
      3: { name: 'A2', type: 'in', gate: 1, desc: 'Inverter 2 Input' },
      4: { name: 'Y2', type: 'out', gate: 1, desc: 'Inverter 2 Output' },
      5: { name: 'A3', type: 'in', gate: 2, desc: 'Inverter 3 Input' },
      6: { name: 'Y3', type: 'out', gate: 2, desc: 'Inverter 3 Output' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      8: { name: 'Y4', type: 'out', gate: 3, desc: 'Inverter 4 Output' },
      9: { name: 'A4', type: 'in', gate: 3, desc: 'Inverter 4 Input' },
      10: { name: 'Y5', type: 'out', gate: 4, desc: 'Inverter 5 Output' },
      11: { name: 'A5', type: 'in', gate: 4, desc: 'Inverter 5 Input' },
      12: { name: 'Y6', type: 'out', gate: 5, desc: 'Inverter 6 Output' },
      13: { name: 'A6', type: 'in', gate: 5, desc: 'Inverter 6 Input' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    gates: [
      { inputs: [1], output: 2, fn: a => (a === 'Z' ? 'Z' : (a === 1 ? 0 : 1)) },
      { inputs: [3], output: 4, fn: a => (a === 'Z' ? 'Z' : (a === 1 ? 0 : 1)) },
      { inputs: [5], output: 6, fn: a => (a === 'Z' ? 'Z' : (a === 1 ? 0 : 1)) },
      { inputs: [9], output: 8, fn: a => (a === 'Z' ? 'Z' : (a === 1 ? 0 : 1)) },
      { inputs: [11], output: 10, fn: a => (a === 'Z' ? 'Z' : (a === 1 ? 0 : 1)) },
      { inputs: [13], output: 12, fn: a => (a === 'Z' ? 'Z' : (a === 1 ? 0 : 1)) }
    ]
  },

  // 3. 7408 Quad 2-Input AND Gate (Image 1)
  '7408': {
    id: '7408',
    name: '7408 Quad 2-Input AND Gate',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Four independent 2-input AND gates. Pin 14: VCC, Pin 7: GND.',
    preview: '1: 1A, 2: 1B, 3: 1Y | 4: 2A, 5: 2B, 6: 2Y | 8: 3Y, 9: 3A, 10: 3B | 11: 4Y, 12: 4A, 13: 4B',
    pinout: {
      1: { name: '1A', type: 'in', gate: 0, arg: 0, desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'in', gate: 0, arg: 1, desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'out', gate: 0, desc: 'Gate 1 Output (AND)' },
      4: { name: '2A', type: 'in', gate: 1, arg: 0, desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'in', gate: 1, arg: 1, desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'out', gate: 1, desc: 'Gate 2 Output (AND)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      8: { name: '3Y', type: 'out', gate: 2, desc: 'Gate 3 Output (AND)' },
      9: { name: '3A', type: 'in', gate: 2, arg: 0, desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'in', gate: 2, arg: 1, desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'out', gate: 3, desc: 'Gate 4 Output (AND)' },
      12: { name: '4A', type: 'in', gate: 3, arg: 0, desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'in', gate: 3, arg: 1, desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    gates: [
      {
        inputs: [1, 2],
        output: 3,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === 1 && b === 1 ? 1 : 0))
      },
      {
        inputs: [4, 5],
        output: 6,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === 1 && b === 1 ? 1 : 0))
      },
      {
        inputs: [9, 10],
        output: 8,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === 1 && b === 1 ? 1 : 0))
      },
      {
        inputs: [12, 13],
        output: 11,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === 1 && b === 1 ? 1 : 0))
      }
    ]
  },

  // 4. 7432 Quad 2-Input OR Gate (Image 2)
  '7432': {
    id: '7432',
    name: '7432 Quad 2-Input OR Gate',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Four independent 2-input OR gates. Pin 14: VCC, Pin 7: GND.',
    preview: '1: 1A, 2: 1B, 3: 1Y | 4: 2A, 5: 2B, 6: 2Y | 8: 3Y, 9: 3A, 10: 3B | 11: 4Y, 12: 4A, 13: 4B',
    pinout: {
      1: { name: '1A', type: 'in', gate: 0, arg: 0, desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'in', gate: 0, arg: 1, desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'out', gate: 0, desc: 'Gate 1 Output (OR)' },
      4: { name: '2A', type: 'in', gate: 1, arg: 0, desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'in', gate: 1, arg: 1, desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'out', gate: 1, desc: 'Gate 2 Output (OR)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      8: { name: '3Y', type: 'out', gate: 2, desc: 'Gate 3 Output (OR)' },
      9: { name: '3A', type: 'in', gate: 2, arg: 0, desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'in', gate: 2, arg: 1, desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'out', gate: 3, desc: 'Gate 4 Output (OR)' },
      12: { name: '4A', type: 'in', gate: 3, arg: 0, desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'in', gate: 3, arg: 1, desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    gates: [
      {
        inputs: [1, 2],
        output: 3,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === 1 || b === 1 ? 1 : 0))
      },
      {
        inputs: [4, 5],
        output: 6,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === 1 || b === 1 ? 1 : 0))
      },
      {
        inputs: [9, 10],
        output: 8,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === 1 || b === 1 ? 1 : 0))
      },
      {
        inputs: [12, 13],
        output: 11,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === 1 || b === 1 ? 1 : 0))
      }
    ]
  },

  // 5. 7486 Quad 2-Input XOR Gate (Image 2)
  '7486': {
    id: '7486',
    name: '7486 Quad 2-Input Exclusive-OR Gate',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Four independent 2-input XOR gates. Pin 14: VCC, Pin 7: GND.',
    preview: '1: 1A, 2: 1B, 3: 1Y | 4: 2A, 5: 2B, 6: 2Y | 8: 3Y, 9: 3A, 10: 3B | 11: 4Y, 12: 4A, 13: 4B',
    pinout: {
      1: { name: '1A', type: 'in', gate: 0, arg: 0, desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'in', gate: 0, arg: 1, desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'out', gate: 0, desc: 'Gate 1 Output (XOR)' },
      4: { name: '2A', type: 'in', gate: 1, arg: 0, desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'in', gate: 1, arg: 1, desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'out', gate: 1, desc: 'Gate 2 Output (XOR)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      8: { name: '3Y', type: 'out', gate: 2, desc: 'Gate 3 Output (XOR)' },
      9: { name: '3A', type: 'in', gate: 2, arg: 0, desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'in', gate: 2, arg: 1, desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'out', gate: 3, desc: 'Gate 4 Output (XOR)' },
      12: { name: '4A', type: 'in', gate: 3, arg: 0, desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'in', gate: 3, arg: 1, desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    gates: [
      {
        inputs: [1, 2],
        output: 3,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a !== b ? 1 : 0))
      },
      {
        inputs: [4, 5],
        output: 6,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a !== b ? 1 : 0))
      },
      {
        inputs: [9, 10],
        output: 8,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a !== b ? 1 : 0))
      },
      {
        inputs: [12, 13],
        output: 11,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a !== b ? 1 : 0))
      }
    ]
  },

  // 6. 74266 Quad 2-Input Exclusive-NOR Gate (Image 3)
  '74266': {
    id: '74266',
    name: '74266 Quad 2-Input Exclusive-NOR Gate',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    description: 'Four independent 2-input XNOR gates. Pin 14: VCC, Pin 7: GND. Note exact pinout: Pin 3 is 1Y, Pin 4 is 2Y, Pin 10 is 3Y, Pin 11 is 4Y.',
    preview: '1: 1A, 2: 1B, 3: 1Y | 5: 2A, 6: 2B, 4: 2Y | 8: 3A, 9: 3B, 10: 3Y | 12: 4A, 13: 4B, 11: 4Y',
    pinout: {
      1: { name: '1A', type: 'in', gate: 0, arg: 0, desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'in', gate: 0, arg: 1, desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'out', gate: 0, desc: 'Gate 1 Output (XNOR)' },
      4: { name: '2Y', type: 'out', gate: 1, desc: 'Gate 2 Output (XNOR)' },
      5: { name: '2A', type: 'in', gate: 1, arg: 0, desc: 'Gate 2 Input A' },
      6: { name: '2B', type: 'in', gate: 1, arg: 1, desc: 'Gate 2 Input B' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      8: { name: '3A', type: 'in', gate: 2, arg: 0, desc: 'Gate 3 Input A' },
      9: { name: '3B', type: 'in', gate: 2, arg: 1, desc: 'Gate 3 Input B' },
      10: { name: '3Y', type: 'out', gate: 2, desc: 'Gate 3 Output (XNOR)' },
      11: { name: '4Y', type: 'out', gate: 3, desc: 'Gate 4 Output (XNOR)' },
      12: { name: '4A', type: 'in', gate: 3, arg: 0, desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'in', gate: 3, arg: 1, desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    gates: [
      {
        inputs: [1, 2],
        output: 3,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === b ? 1 : 0))
      },
      {
        inputs: [5, 6],
        output: 4,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === b ? 1 : 0))
      },
      {
        inputs: [8, 9],
        output: 10,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === b ? 1 : 0))
      },
      {
        inputs: [12, 13],
        output: 11,
        fn: (a, b) => (a === 'Z' || b === 'Z' ? 'Z' : (a === b ? 1 : 0))
      }
    ]
  },

  // 7. 7483 4-Bit Binary Full Adder / BCD Adder (Image 4)
  '7483': {
    id: '7483',
    name: '7483 4-Bit Binary Full Adder with Fast Carry (BCD Adder)',
    package: '16-Pin DIP',
    pins: 16,
    vccPin: 5,
    gndPin: 12,
    description: '4-bit binary adder with fast internal look-ahead carry. Adds 4-bit A + 4-bit B + CIN generating S3..S0 and COUT. Pin 5: VCC, Pin 12: GND.',
    preview: '1: A3, 2: S2, 3: A2, 4: B2, 5: VCC, 6: S1, 7: B1, 8: A1, 9: S0, 10: A0, 11: B0, 12: GND, 13: CIN, 14: COUT, 15: S3, 16: B3',
    pinout: {
      1: { name: 'A3', type: 'in', desc: 'Input A Bit 3 (MSB)' },
      2: { name: 'S2', type: 'out', desc: 'Sum Bit 2' },
      3: { name: 'A2', type: 'in', desc: 'Input A Bit 2' },
      4: { name: 'B2', type: 'in', desc: 'Input B Bit 2' },
      5: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
      6: { name: 'S1', type: 'out', desc: 'Sum Bit 1' },
      7: { name: 'B1', type: 'in', desc: 'Input B Bit 1' },
      8: { name: 'A1', type: 'in', desc: 'Input A Bit 1' },
      9: { name: 'S0', type: 'out', desc: 'Sum Bit 0 (LSB)' },
      10: { name: 'A0', type: 'in', desc: 'Input A Bit 0 (LSB)' },
      11: { name: 'B0', type: 'in', desc: 'Input B Bit 0 (LSB)' },
      12: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      13: { name: 'CIN', type: 'in', desc: 'Carry In' },
      14: { name: 'COUT', type: 'out', desc: 'Carry Out (MSB Carry)' },
      15: { name: 'S3', type: 'out', desc: 'Sum Bit 3 (MSB)' },
      16: { name: 'B3', type: 'in', desc: 'Input B Bit 3 (MSB)' }
    },
    evaluate: function (inputs: Record<number, LogicValue>): Record<number, LogicValue> {
      const a3 = inputs[1], a2 = inputs[3], a1 = inputs[8], a0 = inputs[10];
      const b3 = inputs[16], b2 = inputs[4], b1 = inputs[7], b0 = inputs[11];
      const cin = inputs[13];

      const bitVal = (v: LogicValue | undefined) => (v === 1 ? 1 : 0);
      const isAllZ = [a3, a2, a1, a0, b3, b2, b1, b0].every(v => v === 'Z' || v === undefined);
      if (isAllZ && (cin === 'Z' || cin === undefined)) {
        return { 9: 'Z', 6: 'Z', 2: 'Z', 15: 'Z', 14: 'Z' };
      }

      const valA = (bitVal(a3) << 3) | (bitVal(a2) << 2) | (bitVal(a1) << 1) | bitVal(a0);
      const valB = (bitVal(b3) << 3) | (bitVal(b2) << 2) | (bitVal(b1) << 1) | bitVal(b0);
      const valCin = cin === 1 ? 1 : 0;

      const sum = valA + valB + valCin;

      return {
        9: ((sum & 1) ? 1 : 0) as LogicValue,           // S0
        6: (((sum >> 1) & 1) ? 1 : 0) as LogicValue,    // S1
        2: (((sum >> 2) & 1) ? 1 : 0) as LogicValue,    // S2
        15: (((sum >> 3) & 1) ? 1 : 0) as LogicValue,   // S3
        14: (((sum >> 4) & 1) ? 1 : 0) as LogicValue    // COUT
      };
    }
  },

  // 8. 74151 8-Line to 1-Line Multiplexer
  '74151': {
    id: '74151',
    name: '74151 8-Line to 1-Line Multiplexer',
    package: '16-Pin DIP',
    pins: 16,
    vccPin: 16,
    gndPin: 8,
    description: '8 data inputs (D0-D7), 3 select lines (C,B,A), Strobe G̅. True Y & inverted W outputs. Pin 16: VCC, Pin 8: GND.',
    preview: '1: D3, 2: D2, 3: D1, 4: D0, 5: Y, 6: W, 7: G̅, 8: GND, 9: C, 10: B, 11: A, 12: D7, 13: D6, 14: D5, 15: D4, 16: VCC',
    pinout: {
      1: { name: 'D3', type: 'in', desc: 'Data Input 3' },
      2: { name: 'D2', type: 'in', desc: 'Data Input 2' },
      3: { name: 'D1', type: 'in', desc: 'Data Input 1' },
      4: { name: 'D0', type: 'in', desc: 'Data Input 0' },
      5: { name: 'Y', type: 'out', desc: 'True Multiplexer Output' },
      6: { name: 'W', type: 'out', desc: 'Inverted Multiplexer Output (Y̅)' },
      7: { name: 'G̅', type: 'in', desc: 'Active-LOW Strobe / Enable' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      9: { name: 'C', type: 'in', desc: 'Select Input S2 (MSB Select)' },
      10: { name: 'B', type: 'in', desc: 'Select Input S1' },
      11: { name: 'A', type: 'in', desc: 'Select Input S0 (LSB Select)' },
      12: { name: 'D7', type: 'in', desc: 'Data Input 7' },
      13: { name: 'D6', type: 'in', desc: 'Data Input 6' },
      14: { name: 'D5', type: 'in', desc: 'Data Input 5' },
      15: { name: 'D4', type: 'in', desc: 'Data Input 4' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    evaluate: function (inputs: Record<number, LogicValue>): Record<number, LogicValue> {
      const strobe = inputs[7];
      if (strobe === 'Z') return { 5: 'Z', 6: 'Z' };
      if (strobe === 1) {
        return { 5: 0, 6: 1 };
      }
      const a = inputs[11], b = inputs[10], c = inputs[9];
      if (a === 'Z' || b === 'Z' || c === 'Z') return { 5: 'Z', 6: 'Z' };
      const sel = ((c === 1 ? 1 : 0) << 2) | ((b === 1 ? 1 : 0) << 1) | (a === 1 ? 1 : 0);
      const dMap: Record<number, number> = { 0: 4, 1: 3, 2: 2, 3: 1, 4: 15, 5: 14, 6: 13, 7: 12 };
      const selectedPin = dMap[sel];
      const val = inputs[selectedPin];
      if (val === 'Z') return { 5: 'Z', 6: 'Z' };
      return { 5: val, 6: val === 1 ? 0 : 1 };
    }
  },

  // 9. 74153 Dual 4-Line to 1-Line Multiplexer (Image 5)
  '74153': {
    id: '74153',
    name: '74153 Dual 4-Line to 1-Line Data Selector / Multiplexer',
    package: '16-Pin DIP',
    pins: 16,
    vccPin: 16,
    gndPin: 8,
    description: 'Two independent 4-input multiplexers with shared select lines (B/S1, A/S0) and individual active-low enables (1G̅, 2G̅). Pin 16: VCC, Pin 8: GND.',
    preview: '1: 1G̅, 2: B, 3: 1C3, 4: 1C2, 5: 1C1, 6: 1C0, 7: 1Y, 8: GND, 9: 2Y, 10: 2C0, 11: 2C1, 12: 2C2, 13: 2C3, 14: A, 15: 2G̅, 16: VCC',
    pinout: {
      1: { name: '1G̅', type: 'in', desc: 'Mux 1 Strobe / Enable (Active LOW)' },
      2: { name: 'B', type: 'in', desc: 'Select Line S1 (MSB Select)' },
      3: { name: '1C3', type: 'in', desc: 'Mux 1 Data Input 3' },
      4: { name: '1C2', type: 'in', desc: 'Mux 1 Data Input 2' },
      5: { name: '1C1', type: 'in', desc: 'Mux 1 Data Input 1' },
      6: { name: '1C0', type: 'in', desc: 'Mux 1 Data Input 0' },
      7: { name: '1Y', type: 'out', desc: 'Mux 1 True Output' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      9: { name: '2Y', type: 'out', desc: 'Mux 2 True Output' },
      10: { name: '2C0', type: 'in', desc: 'Mux 2 Data Input 0' },
      11: { name: '2C1', type: 'in', desc: 'Mux 2 Data Input 1' },
      12: { name: '2C2', type: 'in', desc: 'Mux 2 Data Input 2' },
      13: { name: '2C3', type: 'in', desc: 'Mux 2 Data Input 3' },
      14: { name: 'A', type: 'in', desc: 'Select Line S0 (LSB Select)' },
      15: { name: '2G̅', type: 'in', desc: 'Mux 2 Strobe / Enable (Active LOW)' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    evaluate: function (inputs: Record<number, LogicValue>): Record<number, LogicValue> {
      const g1 = inputs[1];  // 1G_bar
      const g2 = inputs[15]; // 2G_bar
      const b = inputs[2];   // S1
      const a = inputs[14];  // S0

      let out1: LogicValue = 'Z';
      let out2: LogicValue = 'Z';

      // Section 1
      if (g1 === 1) {
        out1 = 0;
      } else if (g1 === 0) {
        if (b !== 'Z' && a !== 'Z') {
          const sel1 = ((b === 1 ? 1 : 0) << 1) | (a === 1 ? 1 : 0);
          const map1: Record<number, number> = { 0: 6, 1: 5, 2: 4, 3: 3 };
          const pin1 = map1[sel1];
          out1 = inputs[pin1] !== undefined ? inputs[pin1] : 'Z';
        }
      }

      // Section 2
      if (g2 === 1) {
        out2 = 0;
      } else if (g2 === 0) {
        if (b !== 'Z' && a !== 'Z') {
          const sel2 = ((b === 1 ? 1 : 0) << 1) | (a === 1 ? 1 : 0);
          const map2: Record<number, number> = { 0: 10, 1: 11, 2: 12, 3: 13 };
          const pin2 = map2[sel2];
          out2 = inputs[pin2] !== undefined ? inputs[pin2] : 'Z';
        }
      }

      return {
        7: out1,
        9: out2
      };
    }
  },

  // 10. 7476 Dual J-K Flip-Flop with Preset & Clear
  '7476': {
    id: '7476',
    name: '7476 Dual J-K Flip-Flop with Preset & Clear',
    package: '16-Pin DIP',
    pins: 16,
    vccPin: 5,
    gndPin: 13,
    description: 'Two independent negative-edge J-K flip-flops with active-low Preset and Clear. Pin 5: VCC, Pin 13: GND.',
    preview: '1: 1CLK, 2: 1J, 3: 1K, 4: 1PRE̅, 5: VCC, 6: 1CLR̅, 7: 1Q, 8: 1Q̅, 9: 2Q̅, 10: 2Q, 11: 2CLR̅, 12: 2PRE̅, 13: GND, 14: 2K, 15: 2J, 16: 2CLK',
    pinout: {
      1: { name: '1CLK', type: 'clk', desc: 'FF 1 Clock (Negative Edge)' },
      2: { name: '1J', type: 'in', desc: 'FF 1 J Data Input' },
      3: { name: '1K', type: 'in', desc: 'FF 1 K Data Input' },
      4: { name: '1PRE̅', type: 'in', desc: 'FF 1 Asynchronous Preset (Active LOW)' },
      5: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
      6: { name: '1CLR̅', type: 'in', desc: 'FF 1 Asynchronous Clear (Active LOW)' },
      7: { name: '1Q', type: 'out', desc: 'FF 1 True Output' },
      8: { name: '1Q̅', type: 'out', desc: 'FF 1 Inverted Output' },
      9: { name: '2Q̅', type: 'out', desc: 'FF 2 Inverted Output' },
      10: { name: '2Q', type: 'out', desc: 'FF 2 True Output' },
      11: { name: '2CLR̅', type: 'in', desc: 'FF 2 Asynchronous Clear (Active LOW)' },
      12: { name: '2PRE̅', type: 'in', desc: 'FF 2 Asynchronous Preset (Active LOW)' },
      13: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      14: { name: '2K', type: 'in', desc: 'FF 2 K Data Input' },
      15: { name: '2J', type: 'in', desc: 'FF 2 J Data Input' },
      16: { name: '2CLK', type: 'clk', desc: 'FF 2 Clock (Negative Edge)' }
    },
    initInternalState: () => ({
      ff1: { q: 0, qBar: 1, lastClk: 1 },
      ff2: { q: 0, qBar: 1, lastClk: 1 }
    }),
    evaluateSequential: function (
      state: any,
      inputs: Record<number, LogicValue>,
      _isClockEdge?: boolean
    ): Record<number, LogicValue> {
      // FF 1
      const pre1 = inputs[4] === undefined ? 'Z' : inputs[4];
      const clr1 = inputs[6] === undefined ? 'Z' : inputs[6];
      const clk1 = inputs[1] === undefined ? 'Z' : inputs[1];
      const j1 = inputs[2] === undefined ? 'Z' : inputs[2];
      const k1 = inputs[3] === undefined ? 'Z' : inputs[3];

      if (pre1 === 0 && clr1 === 1) {
        state.ff1.q = 1;
        state.ff1.qBar = 0;
      } else if (pre1 === 1 && clr1 === 0) {
        state.ff1.q = 0;
        state.ff1.qBar = 1;
      } else if (pre1 === 0 && clr1 === 0) {
        state.ff1.q = 1;
        state.ff1.qBar = 1;
      } else if (pre1 === 1 && clr1 === 1) {
        if (state.ff1.lastClk === 1 && clk1 === 0) {
          if (j1 === 0 && k1 === 0) {
            // Hold
          } else if (j1 === 0 && k1 === 1) {
            state.ff1.q = 0;
            state.ff1.qBar = 1;
          } else if (j1 === 1 && k1 === 0) {
            state.ff1.q = 1;
            state.ff1.qBar = 0;
          } else if (j1 === 1 && k1 === 1) {
            const prev = state.ff1.q;
            state.ff1.q = prev === 1 ? 0 : 1;
            state.ff1.qBar = state.ff1.q === 1 ? 0 : 1;
          }
        }
      }
      if (clk1 !== 'Z') state.ff1.lastClk = clk1;

      // FF 2
      const pre2 = inputs[12] === undefined ? 'Z' : inputs[12];
      const clr2 = inputs[11] === undefined ? 'Z' : inputs[11];
      const clk2 = inputs[16] === undefined ? 'Z' : inputs[16];
      const j2 = inputs[15] === undefined ? 'Z' : inputs[15];
      const k2 = inputs[14] === undefined ? 'Z' : inputs[14];

      if (pre2 === 0 && clr2 === 1) {
        state.ff2.q = 1;
        state.ff2.qBar = 0;
      } else if (pre2 === 1 && clr2 === 0) {
        state.ff2.q = 0;
        state.ff2.qBar = 1;
      } else if (pre2 === 0 && clr2 === 0) {
        state.ff2.q = 1;
        state.ff2.qBar = 1;
      } else if (pre2 === 1 && clr2 === 1) {
        if (state.ff2.lastClk === 1 && clk2 === 0) {
          if (j2 === 0 && k2 === 0) {
            // Hold
          } else if (j2 === 0 && k2 === 1) {
            state.ff2.q = 0;
            state.ff2.qBar = 1;
          } else if (j2 === 1 && k2 === 0) {
            state.ff2.q = 1;
            state.ff2.qBar = 0;
          } else if (j2 === 1 && k2 === 1) {
            const prev = state.ff2.q;
            state.ff2.q = prev === 1 ? 0 : 1;
            state.ff2.qBar = state.ff2.q === 1 ? 0 : 1;
          }
        }
      }
      if (clk2 !== 'Z') state.ff2.lastClk = clk2;

      return {
        7: state.ff1.q,
        8: state.ff1.qBar,
        10: state.ff2.q,
        9: state.ff2.qBar
      };
    }
  },

  // 11. 7490 Decade & Binary Counter
  '7490': {
    id: '7490',
    name: '7490 Decade & Binary Counter',
    package: '14-Pin DIP',
    pins: 14,
    vccPin: 5,
    gndPin: 10,
    description: 'Contains divide-by-2 and divide-by-5 counters with master reset (R0) and set (R9). Pin 5: VCC, Pin 10: GND.',
    preview: '1: CKB, 2: R0(1), 3: R0(2), 5: VCC, 6: R9(1), 7: R9(2), 8: QC, 9: QB, 10: GND, 11: QD, 12: QA, 14: CKA',
    pinout: {
      1: { name: 'CKB', type: 'clk', desc: 'Divide-by-5 Clock Input (Negative Edge)' },
      2: { name: 'R0(1)', type: 'in', desc: 'Master Reset 0 Input 1' },
      3: { name: 'R0(2)', type: 'in', desc: 'Master Reset 0 Input 2' },
      4: { name: 'NC', type: 'nc', desc: 'No Internal Connection' },
      5: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
      6: { name: 'R9(1)', type: 'in', desc: 'Master Set 9 Input 1' },
      7: { name: 'R9(2)', type: 'in', desc: 'Master Set 9 Input 2' },
      8: { name: 'QC', type: 'out', desc: 'Counter Output Bit C' },
      9: { name: 'QB', type: 'out', desc: 'Counter Output Bit B' },
      10: { name: 'GND', type: 'gnd', desc: 'Ground Reference (0V)' },
      11: { name: 'QD', type: 'out', desc: 'Counter Output Bit D (MSB)' },
      12: { name: 'QA', type: 'out', desc: 'Counter Output Bit A (LSB)' },
      13: { name: 'NC', type: 'nc', desc: 'No Internal Connection' },
      14: { name: 'CKA', type: 'clk', desc: 'Divide-by-2 Clock Input (Negative Edge)' }
    },
    initInternalState: () => ({
      qa: 0,
      b5Count: 0,
      lastCka: 1,
      lastCkb: 0
    }),
    evaluateSequential: function (
      state: any,
      inputs: Record<number, LogicValue>,
      _isClockEdge?: boolean
    ): Record<number, LogicValue> {
      const r01 = inputs[2], r02 = inputs[3];
      const r91 = inputs[6], r92 = inputs[7];
      const cka = inputs[14] === undefined ? 'Z' : inputs[14];
      const ckb = inputs[1] === undefined ? 'Z' : inputs[1];

      // Master Reset: R0(1)=1 AND R0(2)=1 => 0000
      if (r01 === 1 && r02 === 1 && !(r91 === 1 && r92 === 1)) {
        state.qa = 0;
        state.b5Count = 0;
        state.lastCkb = 0;
      }
      // Master Set: R9(1)=1 AND R9(2)=1 => 1001 (9)
      else if (r91 === 1 && r92 === 1) {
        state.qa = 1;
        state.b5Count = 4;
        state.lastCkb = 1;
      } else {
        if (state.lastCka === 1 && cka === 0) {
          state.qa = state.qa === 1 ? 0 : 1;
        }
        const effectiveCkb = (ckb !== undefined && ckb !== 'Z') ? ckb : state.qa;
        if (state.lastCkb === 1 && effectiveCkb === 0) {
          state.b5Count = (state.b5Count + 1) % 5;
        }
        if (cka !== 'Z') state.lastCka = cka;
        state.lastCkb = effectiveCkb;
      }

      let qb: LogicValue = 0, qc: LogicValue = 0, qd: LogicValue = 0;
      if (state.b5Count === 1) { qb = 1; qc = 0; qd = 0; }
      else if (state.b5Count === 2) { qb = 0; qc = 1; qd = 0; }
      else if (state.b5Count === 3) { qb = 1; qc = 1; qd = 0; }
      else if (state.b5Count === 4) { qb = 0; qc = 0; qd = 1; }

      return {
        12: state.qa,
        9: qb,
        8: qc,
        11: qd
      };
    }
  }
};
