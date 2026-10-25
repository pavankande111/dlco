# DLCO Pin-to-Pin Virtual Trainer Kit Simulator

A complete, fully functional digital logic IC simulator and physical laboratory training instrument, designed and developed for digital logic and computer organization experiments.

---

## Key Features

- **Authentic Laboratory Instrument Aesthetic**:
  - Detailed wooden briefcase enclosure with brass hinges, inner metal rim, and corner mounting screws.
  - Metallic brushed faceplate with silk-screened section panels.
  - Real mechanical Rocker Switch for main power with indicator lamp.
  - 16 3D toggle switches (UP=1, DOWN=0) with individual LED indicators and input terminals `IP16`..`IP1`.
  - 16 red LED output units with terminal jacks `OP16`..`OP1`.
  - Dual 4-bit 7-segment displays (A & B) supporting full hexadecimal/BCD readouts ($0$ to $F$).
  - Integrated Logic Probe with separate High (H) and Low (L) indicator lamps.
  - Dual bus rails: Upper VCC (+5V, 10 red banana jacks) and Lower GROUND (0V, 10 green banana jacks).
  - Variable continuous clock generator ($0.2$ to $5.0$ Hz) with complementary `CLK` and `CLK̅` outputs.
  - Manual single-pulse debounced generator ("PUSH") with pulse counter display and `CLR` button.

- **Realistic Patch Wire Engine**:
  - Direct pin-to-pin wiring with interactive click-to-connect jacks.
  - Realistic quadratic Bezier sagging curves mimicking natural patch wires.
  - Automatic wire color-coding (Red for VCC, Green for GND, Amber for Clock, Purple for Outputs, Blue for Signals).
  - Interactive wire selection and deletion with the Delete key.
  - Full Undo (Ctrl+Z) and Redo (Ctrl+Y) support.

- **Comprehensive IC Library (All 9 74-Series ICs)**:
  1. **7400** — Quad 2-Input NAND Gate (14-pin DIP)
  2. **7404** — Hex Inverter (NOT Gates) (14-pin DIP)
  3. **7408** — Quad 2-Input AND Gate (14-pin DIP)
  4. **7432** — Quad 2-Input OR Gate (14-pin DIP)
  5. **7486** — Quad 2-Input XOR Gate (14-pin DIP)
  6. **74151** — 8-to-1 Multiplexer with Strobe and Complementary Outputs (16-pin DIP)
  7. **74153** — Dual 4-to-1 Multiplexer with Shared Selects and Independent Enables (16-pin DIP)
  8. **7476** — Dual J-K Flip-Flop with Active-Low Preset and Clear (16-pin DIP)
  9. **7490** — Decade & Binary Counter with Divide-by-2 and Divide-by-5 Sections (14-pin DIP)

- **20 Complete Laboratory Practicals & Viva Voce Guides**:
  - Full Adder & Full Subtractor circuits
  - 3-bit & 4-bit Binary-to-Gray Code converters
  - 1-bit Magnitude Comparator
  - Even & Odd Parity Generators and Checkers
  - Multiplexer verifications & Boolean function implementations (74151 & 74153)
  - 2-bit, 3-bit, and 4-bit Asynchronous Ripple Up and Down counters (7476)
  - 2-bit & 4-bit Up/Down Counters with steering logic
  - MOD-10 Decade Counter & MOD-6 Modulo Counters (7490)
  - Automated "Setup ICs", "Auto-Wire Reference Circuit", and "Check My Wiring" buttons.

- **Real-Time Electrical Diagnostics**:
  - Live power & ground audit for all seated ICs.
  - Floating input detection with advisory warnings.
  - Bus contention and short-circuit detection (opposing drivers on the same net).
  - Active net inspection list.

---

## Getting Started

### Prerequisites
- Node.js 18+ or later
- npm 9+ or later

### Installation
Clone or extract the repository, then install project dependencies:
```bash
npm install
```

### Running Locally in Development Mode
Start the local Vite development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173/` to use the simulator.

### Running Automated Tests
Run the complete Vitest test suite covering all 9 ICs, truth tables, sequential transitions, and simulation engine:
```bash
npm test
```

### Type Checking
Run strict TypeScript verification:
```bash
npm run typecheck
```

### Building for Production
Create an optimized production bundle:
```bash
npm run build
```
The compiled assets will be located in the `dist/` directory.

### Previewing the Production Build
Preview the generated production build locally:
```bash
npm run preview
```

---

## Documentation

- [`docs/reference-inventory.md`](docs/reference-inventory.md): Full inventory of all discovered reference ICs, controls, UI layout, and 19 practicals.
- [`docs/architecture.md`](docs/architecture.md): System architecture, simulation pipeline, and coordinate transformation details.
- [`docs/ic-test-report.md`](docs/ic-test-report.md): Automated test coverage and test results for all 9 ICs.
- [`docs/known-limitations.md`](docs/known-limitations.md): Electrical simulation assumptions and boundaries.

---

## Included ICs & Pinout Diagrams per Specifications
- **7400**: Quad 2-Input NAND Gate (14-Pin DIP: 1A, 1B, 1Y...)
- **7404**: Hex Inverter (14-Pin DIP: A1, Y1, A2, Y2...)
- **7408**: Quad 2-Input AND Gate (14-Pin DIP: 1A, 1B, 1Y...)
- **7432**: Quad 2-Input OR Gate (14-Pin DIP: 1A, 1B, 1Y...)
- **7486**: Quad 2-Input Exclusive-OR Gate (14-Pin DIP: 1A, 1B, 1Y...)
- **74266**: Quad 2-Input Exclusive-NOR Gate (14-Pin DIP: 1A=1, 1B=2, 1Y=3; 2Y=4, 2A=5, 2B=6; GND=7; 3A=8, 3B=9, 3Y=10; 4Y=11, 4A=12, 4B=13; VCC=14)
- **7483**: 4-Bit Binary Full Adder with Fast Carry / BCD Adder (16-Pin DIP: A3=1, S2=2, A2=3, B2=4, VCC=5, S1=6, B1=7, A1=8, S0=9, A0=10, B0=11, GND=12, CIN=13, COUT=14, S3=15, B3=16)
- **74151**: 8-Line to 1-Line Multiplexer (16-Pin DIP: D0..D7, S0..S2, G̅, Y, W)
- **74153**: Dual 4-Line to 1-Line Multiplexer (16-Pin DIP: 1G̅=1, B=2, 1C3..1C0=3..6, 1Y=7, GND=8, 2Y=9, 2C0..2C3=10..13, A=14, 2G̅=15, VCC=16)
- **7476**: Dual J-K Flip-Flop with Preset & Clear (16-Pin DIP)
- **7490**: Decade & BCD Counter (14-Pin DIP)

---

## License & Attribution
**DLCO Pin-to-Pin Virtual Trainer Kit**  
Designed & Developed by **Pavan Kande — KBTCOE, Information Technology**. All rights reserved.
