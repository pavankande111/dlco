import { Experiment } from '../types';

export const EXPERIMENTS: Record<string, Experiment> = {
  exp1: {
    id: 'exp1',
    title: '1. Full Adder (Sum & Carry using XOR, AND, OR)',
    aim: 'To design, construct, and verify the truth table of a 1-bit Full Adder using IC 7486 (XOR), IC 7408 (AND), and IC 7432 (OR).',
    requiredIcs: ['7486', '7408', '7432'],
    socketLayout: { U1: '7486', U2: '7408', U3: '7432' },
    inputsDesc: 'Input Switches: S1 = A, S2 = B, S3 = Cin',
    outputsDesc: 'Output LEDs: L1 = SUM, L2 = CARRY_OUT',
    instructions: [
      '1. Seat IC 7486 (XOR) into Socket U1, IC 7408 (AND) into U2, IC 7432 (OR) into U3.',
      '2. Power connections: Wire Pin 14 of U1, U2, U3 to VCC (+5V rail). Wire Pin 7 of U1, U2, U3 to GND.',
      '3. First XOR Gate (Half Sum): Wire Switch S1 (A) to U1 Pin 1; Switch S2 (B) to U1 Pin 2.',
      '4. Second XOR Gate (Final Sum): Wire U1 Pin 3 (A⊕B) to U1 Pin 4; Switch S3 (Cin) to U1 Pin 5. Wire U1 Pin 6 (SUM) to Output LED L1 (Terminal OP1).',
      '5. First AND Gate: Wire S1 (A) to U2 Pin 1; S2 (B) to U2 Pin 2 (produces A·B on Pin 3).',
      '6. Second AND Gate: Wire U1 Pin 3 (A⊕B) to U2 Pin 4; S3 (Cin) to U2 Pin 5 (produces Cin·(A⊕B) on Pin 6).',
      '7. OR Gate (Final Carry): Wire U2 Pin 3 to U3 Pin 1; U2 Pin 6 to U3 Pin 2. Wire U3 Pin 3 (CARRY) to Output LED L2 (Terminal OP2).'
    ],
    truthTable: [
      { A: 0, B: 0, Cin: 0, SUM: 0, CARRY: 0 },
      { A: 0, B: 0, Cin: 1, SUM: 1, CARRY: 0 },
      { A: 0, B: 1, Cin: 0, SUM: 1, CARRY: 0 },
      { A: 0, B: 1, Cin: 1, SUM: 0, CARRY: 1 },
      { A: 1, B: 0, Cin: 0, SUM: 1, CARRY: 0 },
      { A: 1, B: 0, Cin: 1, SUM: 0, CARRY: 1 },
      { A: 1, B: 1, Cin: 0, SUM: 0, CARRY: 1 },
      { A: 1, B: 1, Cin: 1, SUM: 1, CARRY: 1 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p14' }, { from: 'gnd:1', to: 'U1:p7' },
      { from: 'vcc:3', to: 'U2:p14' }, { from: 'gnd:3', to: 'U2:p7' },
      { from: 'vcc:5', to: 'U3:p14' }, { from: 'gnd:5', to: 'U3:p7' },
      { from: 'in:1', to: 'U1:p1' }, { from: 'in:2', to: 'U1:p2' },
      { from: 'U1:p3', to: 'U1:p4' }, { from: 'in:3', to: 'U1:p5' },
      { from: 'U1:p6', to: 'out:1' },
      { from: 'in:1', to: 'U2:p1' }, { from: 'in:2', to: 'U2:p2' },
      { from: 'U1:p3', to: 'U2:p4' }, { from: 'in:3', to: 'U2:p5' },
      { from: 'U2:p3', to: 'U3:p1' }, { from: 'U2:p6', to: 'U3:p2' },
      { from: 'U3:p3', to: 'out:2' }
    ],
    viva: [
      { q: 'What is a Full Adder?', a: 'A combinational logic circuit that performs the arithmetic sum of three binary input bits: augend A, addend B, and carry-in Cin from a previous stage.' },
      { q: 'What are the Boolean expressions for Full Adder SUM and CARRY?', a: 'SUM = A ⊕ B ⊕ Cin; CARRY = (A · B) + (Cin · (A ⊕ B)).' },
      { q: 'How many Half Adders are required to construct a Full Adder?', a: 'Two Half Adders and one OR gate.' },
      { q: 'Why is IC 7486 used for the sum output?', a: 'IC 7486 contains Quad 2-input XOR gates, which compute the modulo-2 sum of bits.' }
    ]
  },

  exp2: {
    id: 'exp2',
    title: '2. Full Subtractor (Difference & Borrow)',
    aim: 'To design, construct, and verify a 1-bit Full Subtractor using IC 7486 (XOR), IC 7404 (NOT), IC 7408 (AND), and IC 7432 (OR).',
    requiredIcs: ['7486', '7404', '7408', '7432'],
    socketLayout: { U1: '7486', U2: '7404', U3: '7408', U4: '7432' },
    inputsDesc: 'Input Switches: S1 = A (Minuend), S2 = B (Subtrahend), S3 = Bin (Borrow-in)',
    outputsDesc: 'Output LEDs: L1 = DIFFERENCE, L2 = BORROW_OUT',
    instructions: [
      '1. Seat U1: 7486 (XOR), U2: 7404 (NOT), U3: 7408 (AND), U4: 7432 (OR).',
      '2. Wire Pin 14 of all ICs to VCC and Pin 7 of all ICs to GND.',
      '3. Difference: S1(A) to U1:p1, S2(B) to U1:p2. U1:p3 to U1:p4; S3(Bin) to U1:p5. U1:p6 to LED L1 (DIFF).',
      '4. Invert A: Wire S1(A) to U2:p1 (NOT). Output A̅ is at U2:p2.',
      '5. Borrow logic: U2:p2 (A̅) to U3:p1; S2(B) to U3:p2 (produces A̅·B on U3:p3).',
      '6. Invert (A⊕B): U1:p3 to U2:p3. Output (A⊕B)̅ is at U2:p4. Wire U2:p4 to U3:p4; S3(Bin) to U3:p5 (produces Bin·(A⊕B)̅ on U3:p6).',
      '7. OR Borrow terms: U3:p3 to U4:p1; U3:p6 to U4:p2. Wire U4:p3 (BORROW) to LED L2 (Terminal OP2).'
    ],
    truthTable: [
      { A: 0, B: 0, Bin: 0, DIFF: 0, BORROW: 0 },
      { A: 0, B: 0, Bin: 1, DIFF: 1, BORROW: 1 },
      { A: 0, B: 1, Bin: 0, DIFF: 1, BORROW: 1 },
      { A: 0, B: 1, Bin: 1, DIFF: 0, BORROW: 1 },
      { A: 1, B: 0, Bin: 0, DIFF: 1, BORROW: 0 },
      { A: 1, B: 0, Bin: 1, DIFF: 0, BORROW: 0 },
      { A: 1, B: 1, Bin: 0, DIFF: 0, BORROW: 0 },
      { A: 1, B: 1, Bin: 1, DIFF: 1, BORROW: 1 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p14' }, { from: 'gnd:1', to: 'U1:p7' },
      { from: 'vcc:3', to: 'U2:p14' }, { from: 'gnd:3', to: 'U2:p7' },
      { from: 'vcc:5', to: 'U3:p14' }, { from: 'gnd:5', to: 'U3:p7' },
      { from: 'vcc:7', to: 'U4:p14' }, { from: 'gnd:7', to: 'U4:p7' },
      { from: 'in:1', to: 'U1:p1' }, { from: 'in:2', to: 'U1:p2' },
      { from: 'U1:p3', to: 'U1:p4' }, { from: 'in:3', to: 'U1:p5' },
      { from: 'U1:p6', to: 'out:1' },
      { from: 'in:1', to: 'U2:p1' },
      { from: 'U2:p2', to: 'U3:p1' }, { from: 'in:2', to: 'U3:p2' },
      { from: 'U1:p3', to: 'U2:p3' },
      { from: 'U2:p4', to: 'U3:p4' }, { from: 'in:3', to: 'U3:p5' },
      { from: 'U3:p3', to: 'U4:p1' }, { from: 'U3:p6', to: 'U4:p2' },
      { from: 'U4:p3', to: 'out:2' }
    ],
    viva: [
      { q: 'What is a Full Subtractor?', a: 'A combinational circuit that computes A - B - Bin, taking borrow-in into account.' },
      { q: 'What is the expression for Borrow Out?', a: 'Bout = A̅·B + Bin·(A ⊕ B)̅.' }
    ]
  },

  exp3: {
    id: 'exp3',
    title: '3. 3-bit Binary to Gray Code Converter',
    aim: 'To construct and test a 3-bit Binary to Gray Code Converter using IC 7486 (XOR gates).',
    requiredIcs: ['7486'],
    socketLayout: { U1: '7486' },
    inputsDesc: 'Input Switches: S3 = B2 (MSB), S2 = B1, S1 = B0 (LSB)',
    outputsDesc: 'Output LEDs: L3 = G2 (MSB), L2 = G1, L1 = G0 (LSB)',
    instructions: [
      '1. Seat IC 7486 into Socket U1. Wire Pin 14 to VCC and Pin 7 to GND.',
      '2. G2 = B2 (Direct connection): Wire S3 (B2) directly to LED L3 (OP3).',
      '3. G1 = B2 ⊕ B1: Wire S3 (B2) to U1:p1; S2 (B1) to U1:p2. Wire U1:p3 to LED L2 (OP2).',
      '4. G0 = B1 ⊕ B0: Wire S2 (B1) to U1:p4; S1 (B0) to U1:p5. Wire U1:p6 to LED L1 (OP1).'
    ],
    truthTable: [
      { B2: 0, B1: 0, B0: 0, G2: 0, G1: 0, G0: 0 },
      { B2: 0, B1: 0, B0: 1, G2: 0, G1: 0, G0: 1 },
      { B2: 0, B1: 1, B0: 0, G2: 0, G1: 1, G0: 1 },
      { B2: 0, B1: 1, B0: 1, G2: 0, G1: 1, G0: 0 },
      { B2: 1, B1: 0, B0: 0, G2: 1, G1: 1, G0: 0 },
      { B2: 1, B1: 0, B0: 1, G2: 1, G1: 1, G0: 1 },
      { B2: 1, B1: 1, B0: 0, G2: 1, G1: 0, G0: 1 },
      { B2: 1, B1: 1, B0: 1, G2: 1, G1: 0, G0: 0 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p14' }, { from: 'gnd:1', to: 'U1:p7' },
      { from: 'in:3', to: 'out:3' },
      { from: 'in:3', to: 'U1:p1' }, { from: 'in:2', to: 'U1:p2' }, { from: 'U1:p3', to: 'out:2' },
      { from: 'in:2', to: 'U1:p4' }, { from: 'in:1', to: 'U1:p5' }, { from: 'U1:p6', to: 'out:1' }
    ],
    viva: [
      { q: 'What is a Gray code?', a: 'An unweighted binary code in which two successive values differ in only one bit position (unit distance code).' },
      { q: 'Why is Gray code used in rotary encoders?', a: 'To prevent false intermediate readouts during mechanical transitions.' }
    ]
  },

  exp4: {
    id: 'exp4',
    title: '4. 4-bit Binary to Gray Code Converter',
    aim: 'To construct and test a 4-bit Binary to Gray Code Converter using IC 7486.',
    requiredIcs: ['7486'],
    socketLayout: { U1: '7486' },
    inputsDesc: 'Input Switches: S4 = B3 (MSB), S3 = B2, S2 = B1, S1 = B0 (LSB)',
    outputsDesc: 'Output LEDs: L4 = G3 (MSB), L3 = G2, L2 = G1, L1 = G0 (LSB)',
    instructions: [
      '1. Seat IC 7486 into Socket U1. Wire Pin 14 to VCC and Pin 7 to GND.',
      '2. G3 = B3: Wire Switch S4 directly to LED L4 (OP4).',
      '3. G2 = B3 ⊕ B2: Wire S4 to U1:p1; S3 to U1:p2. Wire U1:p3 to LED L3 (OP3).',
      '4. G1 = B2 ⊕ B1: Wire S3 to U1:p4; S2 to U1:p5. Wire U1:p6 to LED L2 (OP2).',
      '5. G0 = B1 ⊕ B0: Wire S2 to U1:p9; S1 to U1:p10. Wire U1:p8 to LED L1 (OP1).'
    ],
    truthTable: [
      { B3: 0, B2: 0, B1: 0, B0: 0, G3: 0, G2: 0, G1: 0, G0: 0 },
      { B3: 0, B2: 1, B1: 0, B0: 1, G3: 0, G2: 1, G1: 1, G0: 1 },
      { B3: 1, B2: 0, B1: 1, B0: 0, G3: 1, G2: 1, G1: 1, G0: 0 },
      { B3: 1, B2: 1, B1: 1, B0: 1, G3: 1, G2: 0, G1: 0, G0: 1 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p14' }, { from: 'gnd:1', to: 'U1:p7' },
      { from: 'in:4', to: 'out:4' },
      { from: 'in:4', to: 'U1:p1' }, { from: 'in:3', to: 'U1:p2' }, { from: 'U1:p3', to: 'out:3' },
      { from: 'in:3', to: 'U1:p4' }, { from: 'in:2', to: 'U1:p5' }, { from: 'U1:p6', to: 'out:2' },
      { from: 'in:2', to: 'U1:p9' }, { from: 'in:1', to: 'U1:p10' }, { from: 'U1:p8', to: 'out:1' }
    ],
    viva: [
      { q: 'How many XOR gates are needed for an n-bit converter?', a: '(n - 1) XOR gates. For 4-bit, 3 XOR gates are used.' }
    ]
  },

  exp5: {
    id: 'exp5',
    title: '5. 1-bit Magnitude Comparator (A>B, A=B, A<B)',
    aim: 'To design and verify a 1-bit comparator using NOT (7404), AND (7408), and XOR (7486) gates.',
    requiredIcs: ['7404', '7408', '7486'],
    socketLayout: { U1: '7404', U2: '7408', U3: '7486' },
    inputsDesc: 'Input Switches: S1 = A, S2 = B',
    outputsDesc: 'Output LEDs: L1 = (A > B), L2 = (A = B), L3 = (A < B)',
    instructions: [
      '1. Seat U1: 7404, U2: 7408, U3: 7486. Wire Pin 14 of each to VCC and Pin 7 to GND.',
      '2. Invert inputs: S1(A) to U1:p1 (A̅ on p2); S2(B) to U1:p3 (B̅ on p4).',
      '3. A > B (A·B̅): S1(A) to U2:p1; U1:p4 (B̅) to U2:p2. Wire U2:p3 to LED L1 (OP1).',
      '4. A < B (A̅·B): U1:p2 (A̅) to U2:p4; S2(B) to U2:p5. Wire U2:p6 to LED L3 (OP3).',
      '5. A = B (A XNOR B): S1(A) to U3:p1; S2(B) to U3:p2 (A⊕B on p3). Wire U3:p3 to U1:p5 (NOT). Wire U1:p6 to LED L2 (OP2).'
    ],
    truthTable: [
      { A: 0, B: 0, 'A>B': 0, 'A=B': 1, 'A<B': 0 },
      { A: 0, B: 1, 'A>B': 0, 'A=B': 0, 'A<B': 1 },
      { A: 1, B: 0, 'A>B': 1, 'A=B': 0, 'A<B': 0 },
      { A: 1, B: 1, 'A>B': 0, 'A=B': 1, 'A<B': 0 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p14' }, { from: 'gnd:1', to: 'U1:p7' },
      { from: 'vcc:3', to: 'U2:p14' }, { from: 'gnd:3', to: 'U2:p7' },
      { from: 'vcc:5', to: 'U3:p14' }, { from: 'gnd:5', to: 'U3:p7' },
      { from: 'in:1', to: 'U1:p1' }, { from: 'in:2', to: 'U1:p3' },
      { from: 'in:1', to: 'U2:p1' }, { from: 'U1:p4', to: 'U2:p2' }, { from: 'U2:p3', to: 'out:1' },
      { from: 'U1:p2', to: 'U2:p4' }, { from: 'in:2', to: 'U2:p5' }, { from: 'U2:p6', to: 'out:3' },
      { from: 'in:1', to: 'U3:p1' }, { from: 'in:2', to: 'U3:p2' }, { from: 'U3:p3', to: 'U1:p5' }, { from: 'U1:p6', to: 'out:2' }
    ],
    viva: [
      { q: 'What is the boolean expression for A = B in a 1-bit comparator?', a: 'A = B is given by XNOR: (A ⊕ B)̅.' }
    ]
  },

  exp6: {
    id: 'exp6',
    title: '6. Even Parity Generator and Checker',
    aim: 'To construct and test a 3-bit Even Parity Generator using IC 7486 (XOR gates).',
    requiredIcs: ['7486'],
    socketLayout: { U1: '7486' },
    inputsDesc: 'Input Switches: S3 = D2, S2 = D1, S1 = D0',
    outputsDesc: 'Output LEDs: L1 = Parity Bit P (Even)',
    instructions: [
      '1. Seat IC 7486 into U1. Connect Pin 14 to VCC and Pin 7 to GND.',
      '2. Wire S3 (D2) to U1:p1; S2 (D1) to U1:p2 (produces D2⊕D1 on p3).',
      '3. Wire U1:p3 to U1:p4; S1 (D0) to U1:p5 (produces D2⊕D1⊕D0 on p6).',
      '4. Wire U1:p6 (Even Parity Bit P) to LED L1 (OP1).'
    ],
    truthTable: [
      { D2: 0, D1: 0, D0: 0, P_Even: 0 },
      { D2: 0, D1: 0, D0: 1, P_Even: 1 },
      { D2: 0, D1: 1, D0: 0, P_Even: 1 },
      { D2: 0, D1: 1, D0: 1, P_Even: 0 },
      { D2: 1, D1: 0, D0: 0, P_Even: 1 },
      { D2: 1, D1: 0, D0: 1, P_Even: 0 },
      { D2: 1, D1: 1, D0: 0, P_Even: 0 },
      { D2: 1, D1: 1, D0: 1, P_Even: 1 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p14' }, { from: 'gnd:1', to: 'U1:p7' },
      { from: 'in:3', to: 'U1:p1' }, { from: 'in:2', to: 'U1:p2' },
      { from: 'U1:p3', to: 'U1:p4' }, { from: 'in:1', to: 'U1:p5' },
      { from: 'U1:p6', to: 'out:1' }
    ],
    viva: [
      { q: 'What is Even Parity?', a: 'The parity bit is set such that the total count of 1s in the codeword is always even.' }
    ]
  },

  exp7: {
    id: 'exp7',
    title: '7. Odd Parity Generator and Checker',
    aim: 'To construct and test an Odd Parity Generator using IC 7486 and IC 7404.',
    requiredIcs: ['7486', '7404'],
    socketLayout: { U1: '7486', U2: '7404' },
    inputsDesc: 'Input Switches: S3 = D2, S2 = D1, S1 = D0',
    outputsDesc: 'Output LED: L1 = Odd Parity Bit (P_Odd)',
    instructions: [
      '1. Seat U1: 7486, U2: 7404. Connect VCC and GND.',
      '2. XOR data bits: S3(D2) to U1:p1, S2(D1) to U1:p2; U1:p3 to U1:p4; S1(D0) to U1:p5.',
      '3. Invert the XOR result: Wire U1:p6 to U2:p1 (NOT gate).',
      '4. Wire U2:p2 to LED L1 (Terminal OP1).'
    ],
    truthTable: [
      { D2: 0, D1: 0, D0: 0, P_Odd: 1 },
      { D2: 0, D1: 0, D0: 1, P_Odd: 0 },
      { D2: 0, D1: 1, D0: 0, P_Odd: 0 },
      { D2: 0, D1: 1, D0: 1, P_Odd: 1 },
      { D2: 1, D1: 0, D0: 0, P_Odd: 0 },
      { D2: 1, D1: 0, D0: 1, P_Odd: 1 },
      { D2: 1, D1: 1, D0: 0, P_Odd: 1 },
      { D2: 1, D1: 1, D0: 1, P_Odd: 0 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p14' }, { from: 'gnd:1', to: 'U1:p7' },
      { from: 'vcc:3', to: 'U2:p14' }, { from: 'gnd:3', to: 'U2:p7' },
      { from: 'in:3', to: 'U1:p1' }, { from: 'in:2', to: 'U1:p2' },
      { from: 'U1:p3', to: 'U1:p4' }, { from: 'in:1', to: 'U1:p5' },
      { from: 'U1:p6', to: 'U2:p1' }, { from: 'U2:p2', to: 'out:1' }
    ],
    viva: [
      { q: 'What is Odd Parity?', a: 'The parity bit is set such that the total count of 1s in the codeword is always odd.' }
    ]
  },

  exp8: {
    id: 'exp8',
    title: '8. 8-to-1 Multiplexer Verification (IC 74151)',
    aim: 'To verify the truth table and operation of the 8-line to 1-line multiplexer IC 74151.',
    requiredIcs: ['74151'],
    socketLayout: { U1: '74151' },
    inputsDesc: 'S11 = C (S2), S10 = B (S1), S9 = A (S0); S7 = Enable G̅; S1..S8 = Data D0..D7',
    outputsDesc: 'Output LEDs: L1 = Y (True Output), L2 = W (Inverted Output)',
    instructions: [
      '1. Seat IC 74151 into Socket U1. Wire Pin 16 to VCC and Pin 8 to GND.',
      '2. Wire Enable/Strobe Pin 7 to GND to enable.',
      '3. Wire Select Lines: S11 to Pin 9 (C), S10 to Pin 10 (B), S9 to Pin 11 (A).',
      '4. Wire Data Lines D0..D7 to Switches S1..S8 (Pin 4=D0, 3=D1, 2=D2, 1=D3, 15=D4, 14=D5, 13=D6, 12=D7).',
      '5. Wire Pin 5 (Y) to LED L1 and Pin 6 (W) to LED L2.'
    ],
    truthTable: [
      { G: 1, C: 'X', B: 'X', A: 'X', Y: 0, W: 1 },
      { G: 0, C: 0, B: 0, A: 0, Y: 'D0', W: 'D0̅' },
      { G: 0, C: 0, B: 0, A: 1, Y: 'D1', W: 'D1̅' },
      { G: 0, C: 1, B: 1, A: 1, Y: 'D7', W: 'D7̅' }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p16' }, { from: 'gnd:1', to: 'U1:p8' },
      { from: 'gnd:2', to: 'U1:p7' },
      { from: 'in:11', to: 'U1:p9' }, { from: 'in:10', to: 'U1:p10' }, { from: 'in:9', to: 'U1:p11' },
      { from: 'in:1', to: 'U1:p4' }, { from: 'in:2', to: 'U1:p3' }, { from: 'in:3', to: 'U1:p2' }, { from: 'in:4', to: 'U1:p1' },
      { from: 'in:5', to: 'U1:p15' }, { from: 'in:6', to: 'U1:p14' }, { from: 'in:7', to: 'U1:p13' }, { from: 'in:8', to: 'U1:p12' },
      { from: 'U1:p5', to: 'out:1' }, { from: 'U1:p6', to: 'out:2' }
    ],
    viva: [
      { q: 'What is the function of the Strobe G̅ pin on IC 74151?', a: 'Active-low enable input. When HIGH, Y is forced LOW and W is forced HIGH.' }
    ]
  },

  exp9: {
    id: 'exp9',
    title: '9. Boolean Function: F(A,B,C) = Σm(0,3,5,6) via 74151',
    aim: 'To implement the 3-variable logic function F(A,B,C) = Σm(0,3,5,6) using the 8-to-1 MUX IC 74151.',
    requiredIcs: ['74151'],
    socketLayout: { U1: '74151' },
    inputsDesc: 'Input Switches: S3 = A (S2/C), S2 = B (S1/B), S1 = C (S0/A)',
    outputsDesc: 'Output LED: L1 = Function Output Y',
    instructions: [
      '1. Seat IC 74151 into Socket U1. Wire Pin 16 to VCC and Pin 8 to GND.',
      '2. Strobe (Pin 7) must be grounded: Wire Pin 7 to GND.',
      '3. Connect variables to select lines: S3(A) to Pin 9 (C), S2(B) to Pin 10 (B), S1(C) to Pin 11 (A).',
      '4. Connect minterms to VCC (+5V): D0 (Pin 4), D3 (Pin 1), D5 (Pin 14), D6 (Pin 13) to VCC terminals.',
      '5. Connect non-minterms to GND (0V): D1 (Pin 3), D2 (Pin 2), D4 (Pin 15), D7 (Pin 12) to GND terminals.',
      '6. Connect Pin 5 (Output Y) to LED L1 (Terminal OP1).'
    ],
    truthTable: [
      { A: 0, B: 0, C: 0, F: 1 },
      { A: 0, B: 0, C: 1, F: 0 },
      { A: 0, B: 1, C: 0, F: 0 },
      { A: 0, B: 1, C: 1, F: 1 },
      { A: 1, B: 0, C: 0, F: 0 },
      { A: 1, B: 0, C: 1, F: 1 },
      { A: 1, B: 1, C: 0, F: 1 },
      { A: 1, B: 1, C: 1, F: 0 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p16' }, { from: 'gnd:1', to: 'U1:p8' },
      { from: 'gnd:2', to: 'U1:p7' },
      { from: 'in:3', to: 'U1:p9' }, { from: 'in:2', to: 'U1:p10' }, { from: 'in:1', to: 'U1:p11' },
      { from: 'vcc:2', to: 'U1:p4' },  // D0
      { from: 'vcc:3', to: 'U1:p1' },  // D3
      { from: 'vcc:4', to: 'U1:p14' }, // D5
      { from: 'vcc:5', to: 'U1:p13' }, // D6
      { from: 'gnd:3', to: 'U1:p3' },  // D1
      { from: 'gnd:4', to: 'U1:p2' },  // D2
      { from: 'gnd:5', to: 'U1:p15' }, // D4
      { from: 'gnd:6', to: 'U1:p12' }, // D7
      { from: 'U1:p5', to: 'out:1' }
    ],
    viva: [
      { q: 'Why is a multiplexer called a universal function generator?', a: 'Because any arbitrary boolean function of n variables can be realized without needing external logic gates.' }
    ]
  },

  exp10: {
    id: 'exp10',
    title: '10. Boolean Function: F(A,B,C,D) = Σm(1,2,4,7,8,10,11,13,15) via 74151',
    aim: 'To realize a 4-variable boolean function using an 8-to-1 MUX and an inverter.',
    requiredIcs: ['74151', '7404'],
    socketLayout: { U1: '74151', U2: '7404' },
    inputsDesc: 'Input Switches: S4 = A, S3 = B, S2 = C, S1 = D',
    outputsDesc: 'Output LED: L1 = Function Output Y',
    instructions: [
      '1. Seat U1: 74151 and U2: 7404. Connect VCC and GND.',
      '2. Connect A, B, C to Select pins: S4(A) to U1:p9, S3(B) to U1:p10, S2(C) to U1:p11.',
      '3. Invert D: Wire S1(D) to U2:p1 (NOT). Output D̅ is at U2:p2.',
      '4. Connect D to pins 4, 1, 14, 13, 12. Connect D̅ to pins 3, 2, 15. Wire Pin 7 (G̅) to GND.',
      '5. Wire Pin 5 (Y) to LED L1.'
    ],
    truthTable: [
      { A: 0, B: 0, C: 0, D: 1, F: 1 },
      { A: 0, B: 0, C: 1, D: 0, F: 1 },
      { A: 0, B: 1, C: 0, D: 0, F: 1 },
      { A: 0, B: 1, C: 1, D: 1, F: 1 },
      { A: 1, B: 0, C: 0, D: 0, F: 1 },
      { A: 1, B: 1, C: 1, D: 1, F: 1 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p16' }, { from: 'gnd:1', to: 'U1:p8' },
      { from: 'vcc:3', to: 'U2:p14' }, { from: 'gnd:3', to: 'U2:p7' },
      { from: 'gnd:2', to: 'U1:p7' },
      { from: 'in:4', to: 'U1:p9' }, { from: 'in:3', to: 'U1:p10' }, { from: 'in:2', to: 'U1:p11' },
      { from: 'in:1', to: 'U2:p1' },
      { from: 'in:1', to: 'U1:p4' }, { from: 'in:1', to: 'U1:p1' }, { from: 'in:1', to: 'U1:p14' }, { from: 'in:1', to: 'U1:p13' }, { from: 'in:1', to: 'U1:p12' },
      { from: 'U2:p2', to: 'U1:p3' }, { from: 'U2:p2', to: 'U1:p2' }, { from: 'U2:p2', to: 'U1:p15' },
      { from: 'U1:p5', to: 'out:1' }
    ],
    viva: [
      { q: 'How can an n-variable function be implemented with a 2ⁿ⁻¹:1 MUX?', a: 'Connect (n-1) variables to select lines and express data inputs as functions of the remaining variable.' }
    ]
  },

  exp11: {
    id: 'exp11',
    title: '11. 2-bit Asynchronous Ripple Up Counter (IC 7476)',
    aim: 'To design, construct, and verify a 2-bit Asynchronous Binary Ripple Up Counter using dual JK flip-flops (IC 7476).',
    requiredIcs: ['7476'],
    socketLayout: { U1: '7476' },
    inputsDesc: 'Clock: Manual Pulser or Clock CLK. Preset & Clear tied to VCC (inactive).',
    outputsDesc: 'Output LEDs: L2 = Q1 (MSB), L1 = Q0 (LSB)',
    instructions: [
      '1. Seat IC 7476 into Socket U1. Wire Pin 5 to VCC and Pin 13 to GND.',
      '2. Disable asynchronous inputs: Wire 1PRE̅ (Pin 4), 1CLR̅ (Pin 6), 2PRE̅ (Pin 12), 2CLR̅ (Pin 11) to VCC (+5V rail).',
      '3. Configure Toggle mode (J=1, K=1): Wire 1J (Pin 2), 1K (Pin 3), 2J (Pin 15), 2K (Pin 14) to VCC.',
      '4. FF1 Clock: Wire Pulser terminal (or CLK) to 1CLK (Pin 1). Wire 1Q (Pin 7) to LED L1 (Q0).',
      '5. Ripple Clock: Connect 1Q (Pin 7) to 2CLK (Pin 16) to drive the second flip-flop on falling edge.',
      '6. Output Q1: Wire 2Q (Pin 10) to LED L2 (Terminal OP2).'
    ],
    truthTable: [
      { ClockPulse: 0, Q1: 0, Q0: 0, Count: 0 },
      { ClockPulse: 1, Q1: 0, Q0: 1, Count: 1 },
      { ClockPulse: 2, Q1: 1, Q0: 0, Count: 2 },
      { ClockPulse: 3, Q1: 1, Q0: 1, Count: 3 },
      { ClockPulse: 4, Q1: 0, Q0: 0, Count: 0 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p5' }, { from: 'gnd:1', to: 'U1:p13' },
      { from: 'vcc:2', to: 'U1:p4' }, { from: 'vcc:2', to: 'U1:p6' },
      { from: 'vcc:3', to: 'U1:p12' }, { from: 'vcc:3', to: 'U1:p11' },
      { from: 'vcc:4', to: 'U1:p2' }, { from: 'vcc:4', to: 'U1:p3' },
      { from: 'vcc:5', to: 'U1:p15' }, { from: 'vcc:5', to: 'U1:p14' },
      { from: 'clk:pulse', to: 'U1:p1' },
      { from: 'U1:p7', to: 'out:1' },
      { from: 'U1:p7', to: 'U1:p16' },
      { from: 'U1:p10', to: 'out:2' }
    ],
    viva: [
      { q: 'Why is this counter called asynchronous or ripple?', a: 'Because the flip-flops are not clocked simultaneously; the output of each flip-flop acts as clock for the next stage.' }
    ]
  },

  exp12: {
    id: 'exp12',
    title: '12. 3-bit Asynchronous Ripple Up Counter (IC 7476)',
    aim: 'To construct and test a 3-bit Asynchronous Binary Ripple Up Counter (counts 0 to 7) using two IC 7476 chips.',
    requiredIcs: ['7476', '7476'],
    socketLayout: { U1: '7476', U2: '7476' },
    inputsDesc: 'Clock: Manual Pulser or Clock CLK. All J, K, PRE̅, CLR̅ tied to VCC.',
    outputsDesc: 'Output LEDs: L3 = Q2 (MSB), L2 = Q1, L1 = Q0 (LSB)',
    instructions: [
      '1. Seat U1: 7476 and U2: 7476. Wire Pin 5 to VCC and Pin 13 to GND on both ICs.',
      '2. Tie all PRE̅, CLR̅, J, K pins to VCC (+5V) to enable toggle mode.',
      '3. Wire Clock (clk:pulse) to U1:p1 (1CLK). Output U1:p7 (Q0) to LED L1.',
      '4. Wire U1:p7 (Q0) to U1:p16 (2CLK). Output U1:p10 (Q1) to LED L2.',
      '5. Wire U1:p10 (Q1) to U2:p1 (1CLK). Output U2:p7 (Q2) to LED L3.'
    ],
    truthTable: [
      { Pulse: 0, Q2: 0, Q1: 0, Q0: 0, Decimal: 0 },
      { Pulse: 1, Q2: 0, Q1: 0, Q0: 1, Decimal: 1 },
      { Pulse: 2, Q2: 0, Q1: 1, Q0: 0, Decimal: 2 },
      { Pulse: 3, Q2: 0, Q1: 1, Q0: 1, Decimal: 3 },
      { Pulse: 4, Q2: 1, Q1: 0, Q0: 0, Decimal: 4 },
      { Pulse: 7, Q2: 1, Q1: 1, Q0: 1, Decimal: 7 },
      { Pulse: 8, Q2: 0, Q1: 0, Q0: 0, Decimal: 0 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p5' }, { from: 'gnd:1', to: 'U1:p13' },
      { from: 'vcc:3', to: 'U2:p5' }, { from: 'gnd:3', to: 'U2:p13' },
      { from: 'vcc:2', to: 'U1:p4' }, { from: 'vcc:2', to: 'U1:p6' }, { from: 'vcc:2', to: 'U1:p12' }, { from: 'vcc:2', to: 'U1:p11' },
      { from: 'vcc:4', to: 'U2:p4' }, { from: 'vcc:4', to: 'U2:p6' },
      { from: 'vcc:5', to: 'U1:p2' }, { from: 'vcc:5', to: 'U1:p3' }, { from: 'vcc:5', to: 'U1:p15' }, { from: 'vcc:5', to: 'U1:p14' },
      { from: 'vcc:6', to: 'U2:p2' }, { from: 'vcc:6', to: 'U2:p3' },
      { from: 'clk:pulse', to: 'U1:p1' },
      { from: 'U1:p7', to: 'out:1' }, { from: 'U1:p7', to: 'U1:p16' },
      { from: 'U1:p10', to: 'out:2' }, { from: 'U1:p10', to: 'U2:p1' },
      { from: 'U2:p7', to: 'out:3' }
    ],
    viva: [
      { q: 'What is the modulus of a 3-bit counter?', a: 'MOD = 2³ = 8. It cycles through 8 states from 000 to 111.' }
    ]
  },

  exp13: {
    id: 'exp13',
    title: '13. 4-bit Asynchronous Ripple Up Counter (IC 7476)',
    aim: 'To construct and test a 4-bit Asynchronous Binary Ripple Up Counter (MOD-16, counts 0 to 15) using four JK flip-flops.',
    requiredIcs: ['7476', '7476'],
    socketLayout: { U1: '7476', U2: '7476' },
    inputsDesc: 'Clock: Pulser or CLK. Output LEDs: L4 = Q3 (MSB), L3 = Q2, L2 = Q1, L1 = Q0 (LSB)',
    outputsDesc: 'Connects to both 7-segment display A and LEDs L1..L4',
    instructions: [
      '1. Seat U1: 7476 and U2: 7476. Power Pin 5 to VCC and Pin 13 to GND.',
      '2. Tie all J, K, PRE̅, CLR̅ pins to VCC (+5V).',
      '3. Cascade: Clock -> U1:FF1 -> U1:FF2 -> U2:FF1 -> U2:FF2.',
      '4. Wire Q0..Q3 to LEDs L1..L4 and to 7-segment A inputs (A0..A3) to watch the digital count 0 to F!'
    ],
    truthTable: [
      { Count: '0 to 15 (0000 to 1111)', Hex: '0 to F on 7-Segment Display' }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p5' }, { from: 'gnd:1', to: 'U1:p13' },
      { from: 'vcc:3', to: 'U2:p5' }, { from: 'gnd:3', to: 'U2:p13' },
      { from: 'vcc:2', to: 'U1:p4' }, { from: 'vcc:2', to: 'U1:p6' }, { from: 'vcc:2', to: 'U1:p12' }, { from: 'vcc:2', to: 'U1:p11' },
      { from: 'vcc:4', to: 'U2:p4' }, { from: 'vcc:4', to: 'U2:p6' }, { from: 'vcc:4', to: 'U2:p12' }, { from: 'vcc:4', to: 'U2:p11' },
      { from: 'vcc:5', to: 'U1:p2' }, { from: 'vcc:5', to: 'U1:p3' }, { from: 'vcc:5', to: 'U1:p15' }, { from: 'vcc:5', to: 'U1:p14' },
      { from: 'vcc:6', to: 'U2:p2' }, { from: 'vcc:6', to: 'U2:p3' }, { from: 'vcc:6', to: 'U2:p15' }, { from: 'vcc:6', to: 'U2:p14' },
      { from: 'clk:pulse', to: 'U1:p1' },
      { from: 'U1:p7', to: 'out:1' }, { from: 'U1:p7', to: 'U1:p16' }, { from: 'U1:p7', to: 'seg:a0' },
      { from: 'U1:p10', to: 'out:2' }, { from: 'U1:p10', to: 'U2:p1' }, { from: 'U1:p10', to: 'seg:a1' },
      { from: 'U2:p7', to: 'out:3' }, { from: 'U2:p7', to: 'U2:p16' }, { from: 'U2:p7', to: 'seg:a2' },
      { from: 'U2:p10', to: 'out:4' }, { from: 'U2:p10', to: 'seg:a3' }
    ],
    viva: [
      { q: 'What is the count capacity of a 4-bit binary counter?', a: '2⁴ = 16 states, counting from 0000 (0) to 1111 (15).' }
    ]
  },

  exp14: {
    id: 'exp14',
    title: '14. 2-bit Asynchronous Ripple Down Counter (IC 7476)',
    aim: 'To construct and test a 2-bit Binary Down Counter (counts 3, 2, 1, 0, 3...) using IC 7476.',
    requiredIcs: ['7476'],
    socketLayout: { U1: '7476' },
    inputsDesc: 'Clock: Pulser or CLK. J, K, PRE̅, CLR̅ tied to VCC.',
    outputsDesc: 'Output LEDs: L2 = Q1, L1 = Q0',
    instructions: [
      '1. Seat IC 7476 into U1. Wire Pin 5 to VCC and Pin 13 to GND.',
      '2. Tie all J, K, PRE̅, CLR̅ pins to VCC (+5V).',
      '3. Clock input: Wire clk:pulse to 1CLK (Pin 1).',
      '4. Down Counter Ripple Trick: Connect complementary output 1Q̅ (Pin 8) to 2CLK (Pin 16).',
      '5. Take outputs from non-inverted pins: 1Q (Pin 7) to LED L1 (Q0), 2Q (Pin 10) to LED L2 (Q1).'
    ],
    truthTable: [
      { Pulse: 0, Q1: 1, Q0: 1, Count: 3 },
      { Pulse: 1, Q1: 1, Q0: 0, Count: 2 },
      { Pulse: 2, Q1: 0, Q0: 1, Count: 1 },
      { Pulse: 3, Q1: 0, Q0: 0, Count: 0 },
      { Pulse: 4, Q1: 1, Q0: 1, Count: 3 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p5' }, { from: 'gnd:1', to: 'U1:p13' },
      { from: 'vcc:2', to: 'U1:p4' }, { from: 'vcc:2', to: 'U1:p6' }, { from: 'vcc:2', to: 'U1:p12' }, { from: 'vcc:2', to: 'U1:p11' },
      { from: 'vcc:3', to: 'U1:p2' }, { from: 'vcc:3', to: 'U1:p3' }, { from: 'vcc:3', to: 'U1:p15' }, { from: 'vcc:3', to: 'U1:p14' },
      { from: 'clk:pulse', to: 'U1:p1' },
      { from: 'U1:p7', to: 'out:1' },
      { from: 'U1:p8', to: 'U1:p16' },
      { from: 'U1:p10', to: 'out:2' }
    ],
    viva: [
      { q: 'How does clocking from Q̅ convert an Up Counter into a Down Counter?', a: 'When Q goes 0->1, Q̅ goes 1->0, providing the negative edge needed to advance the next stage.' }
    ]
  },

  exp15: {
    id: 'exp15',
    title: '15. 3-bit Asynchronous Ripple Down Counter (IC 7476)',
    aim: 'To construct and test a 3-bit Binary Down Counter (counts 7 down to 0) using two IC 7476 chips.',
    requiredIcs: ['7476', '7476'],
    socketLayout: { U1: '7476', U2: '7476' },
    inputsDesc: 'Clock: Pulser or CLK. J, K, PRE̅, CLR̅ tied to VCC.',
    outputsDesc: 'Output LEDs: L3 = Q2, L2 = Q1, L1 = Q0',
    instructions: [
      '1. Seat U1: 7476 and U2: 7476. Connect VCC and GND.',
      '2. Tie all J, K, PRE̅, CLR̅ to VCC.',
      '3. Clock -> U1:1CLK; U1:1Q̅ (Pin 8) -> U1:2CLK; U1:2Q̅ (Pin 9) -> U2:1CLK.',
      '4. Read outputs from U1:1Q (L1), U1:2Q (L2), and U2:1Q (L3).'
    ],
    truthTable: [
      { Pulse: 0, Q2: 1, Q1: 1, Q0: 1, Dec: 7 },
      { Pulse: 1, Q2: 1, Q1: 1, Q0: 0, Dec: 6 },
      { Pulse: 2, Q2: 1, Q1: 0, Q0: 1, Dec: 5 },
      { Pulse: 7, Q2: 0, Q1: 0, Q0: 0, Dec: 0 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p5' }, { from: 'gnd:1', to: 'U1:p13' },
      { from: 'vcc:3', to: 'U2:p5' }, { from: 'gnd:3', to: 'U2:p13' },
      { from: 'vcc:2', to: 'U1:p4' }, { from: 'vcc:2', to: 'U1:p6' }, { from: 'vcc:2', to: 'U1:p12' }, { from: 'vcc:2', to: 'U1:p11' },
      { from: 'vcc:4', to: 'U2:p4' }, { from: 'vcc:4', to: 'U2:p6' },
      { from: 'vcc:5', to: 'U1:p2' }, { from: 'vcc:5', to: 'U1:p3' }, { from: 'vcc:5', to: 'U1:p15' }, { from: 'vcc:5', to: 'U1:p14' },
      { from: 'vcc:6', to: 'U2:p2' }, { from: 'vcc:6', to: 'U2:p3' },
      { from: 'clk:pulse', to: 'U1:p1' },
      { from: 'U1:p7', to: 'out:1' }, { from: 'U1:p8', to: 'U1:p16' },
      { from: 'U1:p10', to: 'out:2' }, { from: 'U1:p9', to: 'U2:p1' },
      { from: 'U2:p7', to: 'out:3' }
    ],
    viva: [
      { q: 'What is the count sequence of a 3-bit Down Counter?', a: '7, 6, 5, 4, 3, 2, 1, 0, then wraps back to 7.' }
    ]
  },

  exp16: {
    id: 'exp16',
    title: '16. 4-bit Asynchronous Ripple Down Counter (IC 7476)',
    aim: 'To construct and test a 4-bit Binary Down Counter (counts 15 down to 0) using two IC 7476 chips.',
    requiredIcs: ['7476', '7476'],
    socketLayout: { U1: '7476', U2: '7476' },
    inputsDesc: 'Clock: Pulser or CLK. Output on LEDs L4..L1 and 7-Segment A.',
    outputsDesc: 'Counts F, E, D, C... down to 0 on 7-Segment Display',
    instructions: [
      '1. Seat U1: 7476 and U2: 7476. Connect VCC and GND.',
      '2. Tie all J, K, PRE̅, CLR̅ to VCC.',
      '3. Cascade complementary outputs Q̅ to subsequent CLK pins.',
      '4. Wire true outputs Q0..Q3 to LEDs L1..L4 and to 7-Segment inputs A0..A3.'
    ],
    truthTable: [
      { Count: '15 down to 0 (1111 to 0000)', Display: 'F down to 0' }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p5' }, { from: 'gnd:1', to: 'U1:p13' },
      { from: 'vcc:3', to: 'U2:p5' }, { from: 'gnd:3', to: 'U2:p13' },
      { from: 'vcc:2', to: 'U1:p4' }, { from: 'vcc:2', to: 'U1:p6' }, { from: 'vcc:2', to: 'U1:p12' }, { from: 'vcc:2', to: 'U1:p11' },
      { from: 'vcc:4', to: 'U2:p4' }, { from: 'vcc:4', to: 'U2:p6' }, { from: 'vcc:4', to: 'U2:p12' }, { from: 'vcc:4', to: 'U2:p11' },
      { from: 'vcc:5', to: 'U1:p2' }, { from: 'vcc:5', to: 'U1:p3' }, { from: 'vcc:5', to: 'U1:p15' }, { from: 'vcc:5', to: 'U1:p14' },
      { from: 'vcc:6', to: 'U2:p2' }, { from: 'vcc:6', to: 'U2:p3' }, { from: 'vcc:6', to: 'U2:p15' }, { from: 'vcc:6', to: 'U2:p14' },
      { from: 'clk:pulse', to: 'U1:p1' },
      { from: 'U1:p7', to: 'out:1' }, { from: 'U1:p8', to: 'U1:p16' }, { from: 'U1:p7', to: 'seg:a0' },
      { from: 'U1:p10', to: 'out:2' }, { from: 'U1:p9', to: 'U2:p1' }, { from: 'U1:p10', to: 'seg:a1' },
      { from: 'U2:p7', to: 'out:3' }, { from: 'U2:p8', to: 'U2:p16' }, { from: 'U2:p7', to: 'seg:a2' },
      { from: 'U2:p10', to: 'out:4' }, { from: 'U2:p10', to: 'seg:a3' }
    ],
    viva: [
      { q: 'What is the state transition from 0000 in a down counter?', a: 'It wraps around to 1111 (decimal 15).' }
    ]
  },

  exp17: {
    id: 'exp17',
    title: '17. 2-bit Asynchronous Ripple Up-Down Counter',
    aim: 'To construct and test a 2-bit Up/Down Counter using steering logic with IC 7476, IC 7408, IC 7404, IC 7432.',
    requiredIcs: ['7476', '7408', '7432', '7404'],
    socketLayout: { U1: '7476', U2: '7408', U3: '7432', U4: '7404' },
    inputsDesc: 'Switch S1 = Mode (1 = UP, 0 = DOWN); Clock: Pulser',
    outputsDesc: 'LEDs L2 = Q1, L1 = Q0',
    instructions: [
      '1. Seat U1: 7476, U2: 7408, U3: 7432, U4: 7404. Connect VCC & GND.',
      '2. Tie J, K, PRE, CLR to VCC.',
      '3. Steering logic for clocking FF2: CLK2 = (M·Q) + (M̅·Q̅).',
      '4. Wire S1(M) to U4:p1 (NOT, M̅ on p2).',
      '5. AND gate 1: S1(M) & U1:Q to U2:p1,p2. AND gate 2: U4:M̅ & U1:Q̅ to U2:p4,p5.',
      '6. OR gate: U2:p3 & U2:p6 to U3:p1,p2. Output U3:p3 to U1:2CLK (Pin 16).'
    ],
    truthTable: [
      { Mode: 'UP (M=1)', Sequence: '0 -> 1 -> 2 -> 3 -> 0' },
      { Mode: 'DOWN (M=0)', Sequence: '3 -> 2 -> 1 -> 0 -> 3' }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p5' }, { from: 'gnd:1', to: 'U1:p13' },
      { from: 'vcc:3', to: 'U2:p14' }, { from: 'gnd:3', to: 'U2:p7' },
      { from: 'vcc:5', to: 'U3:p14' }, { from: 'gnd:5', to: 'U3:p7' },
      { from: 'vcc:7', to: 'U4:p14' }, { from: 'gnd:7', to: 'U4:p7' },
      { from: 'vcc:2', to: 'U1:p4' }, { from: 'vcc:2', to: 'U1:p6' }, { from: 'vcc:2', to: 'U1:p12' }, { from: 'vcc:2', to: 'U1:p11' },
      { from: 'vcc:4', to: 'U1:p2' }, { from: 'vcc:4', to: 'U1:p3' }, { from: 'vcc:4', to: 'U1:p15' }, { from: 'vcc:4', to: 'U1:p14' },
      { from: 'clk:pulse', to: 'U1:p1' },
      { from: 'in:1', to: 'U4:p1' },
      { from: 'in:1', to: 'U2:p1' }, { from: 'U1:p7', to: 'U2:p2' },
      { from: 'U4:p2', to: 'U2:p4' }, { from: 'U1:p8', to: 'U2:p5' },
      { from: 'U2:p3', to: 'U3:p1' }, { from: 'U2:p6', to: 'U3:p2' },
      { from: 'U3:p3', to: 'U1:p16' },
      { from: 'U1:p7', to: 'out:1' }, { from: 'U1:p10', to: 'out:2' }
    ],
    viva: [
      { q: 'What is steering logic in an Up/Down counter?', a: 'Gating logic that steers either Q (for up) or Q̅ (for down) to the next clock terminal.' }
    ]
  },

  exp18: {
    id: 'exp18',
    title: '18. 4-bit Asynchronous Ripple Up-Down Counter',
    aim: 'To verify full 4-bit Up/Down counting using cascaded dual JK flip-flops.',
    requiredIcs: ['7476', '7476'],
    socketLayout: { U1: '7476', U2: '7476' },
    inputsDesc: 'Clock: Pulser. Switch S1 toggles UP/DOWN mode wiring.',
    outputsDesc: 'Output LEDs L1..L4 and 7-Segment Display A',
    instructions: [
      '1. Seat U1: 7476 and U2: 7476.',
      '2. Power VCC (Pin 5) and GND (Pin 13) on both.',
      '3. To count UP: Connect Q to next CLK.',
      '4. To count DOWN: Connect Q̅ to next CLK.'
    ],
    truthTable: [
      { Mode: 'UP', Hex: '0, 1, 2, ... F, 0' },
      { Mode: 'DOWN', Hex: 'F, E, D, ... 0, F' }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p5' }, { from: 'gnd:1', to: 'U1:p13' },
      { from: 'vcc:3', to: 'U2:p5' }, { from: 'gnd:3', to: 'U2:p13' },
      { from: 'vcc:2', to: 'U1:p4' }, { from: 'vcc:2', to: 'U1:p6' }, { from: 'vcc:2', to: 'U1:p12' }, { from: 'vcc:2', to: 'U1:p11' },
      { from: 'vcc:4', to: 'U2:p4' }, { from: 'vcc:4', to: 'U2:p6' }, { from: 'vcc:4', to: 'U2:p12' }, { from: 'vcc:4', to: 'U2:p11' },
      { from: 'vcc:5', to: 'U1:p2' }, { from: 'vcc:5', to: 'U1:p3' }, { from: 'vcc:5', to: 'U1:p15' }, { from: 'vcc:5', to: 'U1:p14' },
      { from: 'vcc:6', to: 'U2:p2' }, { from: 'vcc:6', to: 'U2:p3' }, { from: 'vcc:6', to: 'U2:p15' }, { from: 'vcc:6', to: 'U2:p14' },
      { from: 'clk:pulse', to: 'U1:p1' },
      { from: 'U1:p7', to: 'out:1' }, { from: 'U1:p7', to: 'U1:p16' }, { from: 'U1:p7', to: 'seg:a0' },
      { from: 'U1:p10', to: 'out:2' }, { from: 'U1:p10', to: 'U2:p1' }, { from: 'U1:p10', to: 'seg:a1' },
      { from: 'U2:p7', to: 'out:3' }, { from: 'U2:p7', to: 'U2:p16' }, { from: 'U2:p7', to: 'seg:a2' },
      { from: 'U2:p10', to: 'out:4' }, { from: 'U2:p10', to: 'seg:a3' }
    ],
    viva: [
      { q: 'How many states does a 4-bit counter have?', a: '16 states (0 to 15).' }
    ]
  },

  exp19: {
    id: 'exp19',
    title: '19. MOD-N Decade Counter using IC 7490 (BCD 0 to 9 & Modulo-6)',
    aim: 'To design, construct, and verify a BCD Decade Counter (MOD-10) and a MOD-6 Counter using IC 7490.',
    requiredIcs: ['7490'],
    socketLayout: { U1: '7490' },
    inputsDesc: 'Clock: Pulser or CLK. Resets R0(1), R0(2), R9(1), R9(2).',
    outputsDesc: 'Output LEDs: L4 = QD (MSB), L3 = QC, L2 = QB, L1 = QA (LSB) and 7-Segment A',
    instructions: [
      '1. Seat IC 7490 into Socket U1. Wire Pin 5 to VCC (+5V) and Pin 10 to GND (0V).',
      '2. Decade Counter Mode: Wire Output QA (Pin 12) to Input CKB (Pin 1). This cascades the divide-by-2 and divide-by-5 sections.',
      '3. Normal counting reset control: Wire R0(1) (Pin 2) and R0(2) (Pin 3) to GND (0V). Wire R9(1) (Pin 6) and R9(2) (Pin 7) to GND (0V).',
      '4. Connect Clock: Wire Pulser (clk:pulse) or Clock CLK to Input CKA (Pin 14).',
      '5. Wire Outputs: QD (Pin 11) to LED L4, QC (Pin 8) to LED L3, QB (Pin 9) to LED L2, QA (Pin 12) to LED L1.',
      '6. Also wire QD, QC, QB, QA to 7-Segment Display A (A3, A2, A1, A0) to see decimal digits 0 to 9!',
      '7. MOD-6 Configuration: To count 0 to 5 and reset at 6 (0110), connect QB (Pin 9) to R0(1) (Pin 2) and QC (Pin 8) to R0(2) (Pin 3)!'
    ],
    truthTable: [
      { Pulse: 0, QD: 0, QC: 0, QB: 0, QA: 0, Dec: 0 },
      { Pulse: 1, QD: 0, QC: 0, QB: 0, QA: 1, Dec: 1 },
      { Pulse: 2, QD: 0, QC: 0, QB: 1, QA: 0, Dec: 2 },
      { Pulse: 3, QD: 0, QC: 0, QB: 1, QA: 1, Dec: 3 },
      { Pulse: 4, QD: 0, QC: 1, QB: 0, QA: 0, Dec: 4 },
      { Pulse: 5, QD: 0, QC: 1, QB: 0, QA: 1, Dec: 5 },
      { Pulse: 6, QD: 0, QC: 1, QB: 1, QA: 0, Dec: 6 },
      { Pulse: 7, QD: 0, QC: 1, QB: 1, QA: 1, Dec: 7 },
      { Pulse: 8, QD: 1, QC: 0, QB: 0, QA: 0, Dec: 8 },
      { Pulse: 9, QD: 1, QC: 0, QB: 0, QA: 1, Dec: 9 },
      { Pulse: 10, QD: 0, QC: 0, QB: 0, QA: 0, Dec: 0 }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p5' }, { from: 'gnd:1', to: 'U1:p10' },
      { from: 'U1:p12', to: 'U1:p1' },
      { from: 'gnd:2', to: 'U1:p2' }, { from: 'gnd:2', to: 'U1:p3' },
      { from: 'gnd:3', to: 'U1:p6' }, { from: 'gnd:3', to: 'U1:p7' },
      { from: 'clk:pulse', to: 'U1:p14' },
      { from: 'U1:p12', to: 'out:1' }, { from: 'U1:p12', to: 'seg:a0' },
      { from: 'U1:p9', to: 'out:2' },  { from: 'U1:p9', to: 'seg:a1' },
      { from: 'U1:p8', to: 'out:3' },  { from: 'U1:p8', to: 'seg:a2' },
      { from: 'U1:p11', to: 'out:4' }, { from: 'U1:p11', to: 'seg:a3' }
    ],
    viva: [
      { q: 'What is IC 7490?', a: 'A monolithic BCD decade counter containing independent divide-by-2 and divide-by-5 counter sections.' },
      { q: 'How is IC 7490 configured as a BCD decade counter?', a: 'By connecting QA (Pin 12) to CKB (Pin 1) and clocking CKA (Pin 14).' },
      { q: 'What is the function of pins R9(1) and R9(2)?', a: 'They are master set-to-9 inputs. When both are HIGH, outputs are asynchronously forced to 1001 (BCD 9).' }
    ]
  },

  exp20: {
    id: 'exp20',
    title: '20. Dual 4-to-1 Multiplexer Verification (IC 74153)',
    aim: 'To verify the independent operation and truth table of both sections of the Dual 4-to-1 Multiplexer IC 74153.',
    requiredIcs: ['74153'],
    socketLayout: { U1: '74153' },
    inputsDesc: 'Select: S10 = B (S1), S9 = A (S0); Enables: S8 = 1G̅, S7 = 2G̅; Inputs: S1..S4 = 1C0..1C3',
    outputsDesc: 'Output LEDs: L1 = 1Y (Section 1), L2 = 2Y (Section 2)',
    instructions: [
      '1. Seat IC 74153 into Socket U1. Wire Pin 16 to VCC and Pin 8 to GND.',
      '2. Wire Enable inputs: 1G̅ (Pin 1) to Switch S8 (or GND), 2G̅ (Pin 15) to Switch S7 (or GND).',
      '3. Wire Select inputs: B/S1 (Pin 2) to Switch S10, A/S0 (Pin 14) to Switch S9.',
      '4. Wire MUX 1 data inputs: S1 to 1C0 (Pin 6), S2 to 1C1 (Pin 5), S3 to 1C2 (Pin 4), S4 to 1C3 (Pin 3).',
      '5. Wire MUX 2 data inputs: connect 2C0..2C3 (Pins 10, 11, 12, 13) to desired inputs or power rails.',
      '6. Wire Output 1Y (Pin 7) to LED L1 and Output 2Y (Pin 9) to LED L2.'
    ],
    truthTable: [
      { '1G̅': 1, B: 'X', A: 'X', '1Y': 0, Note: 'Disabled (forced LOW)' },
      { '1G̅': 0, B: 0, A: 0, '1Y': '1C0', Note: 'Select 1C0' },
      { '1G̅': 0, B: 0, A: 1, '1Y': '1C1', Note: 'Select 1C1' },
      { '1G̅': 0, B: 1, A: 0, '1Y': '1C2', Note: 'Select 1C2' },
      { '1G̅': 0, B: 1, A: 1, '1Y': '1C3', Note: 'Select 1C3' }
    ],
    referenceWires: [
      { from: 'vcc:1', to: 'U1:p16' }, { from: 'gnd:1', to: 'U1:p8' },
      { from: 'gnd:2', to: 'U1:p1' },  // 1G_bar grounded
      { from: 'gnd:3', to: 'U1:p15' }, // 2G_bar grounded
      { from: 'in:10', to: 'U1:p2' },  // Select B
      { from: 'in:9', to: 'U1:p14' },  // Select A
      { from: 'in:1', to: 'U1:p6' },   // 1C0
      { from: 'in:2', to: 'U1:p5' },   // 1C1
      { from: 'in:3', to: 'U1:p4' },   // 1C2
      { from: 'in:4', to: 'U1:p3' },   // 1C3
      { from: 'U1:p7', to: 'out:1' },  // 1Y
      { from: 'U1:p9', to: 'out:2' }   // 2Y
    ],
    viva: [
      { q: 'What is IC 74153?', a: 'A dual 4-to-1 data selector / multiplexer with common select inputs and separate active-low enables.' },
      { q: 'What is the state of output Y when enable G̅ is HIGH?', a: 'The output is forced LOW (0) regardless of the data or select inputs.' },
      { q: 'How many select lines does IC 74153 have?', a: 'Two select lines (A and B) that are shared across both multiplexer halves.' }
    ]
  }
};
