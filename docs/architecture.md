# Architecture & Simulation Design: DLCO Pin-to-Pin Virtual Trainer Kit

## 1. System Overview
The DLCO Pin-to-Pin Virtual Trainer Kit is a web-based, standalone digital logic hardware instrument simulator. It provides full schematic and pin-to-pin wiring capabilities, live electrical graph resolution, gate-level combinational evaluation, and edge-triggered sequential flip-flop and counter models.

---

## 2. Technology Stack
- **Framework**: React 18 with TypeScript in strict mode
- **Bundler / Server**: Vite 6
- **Styling**: Tailwind CSS + Custom Authenticated Hardware Theme (CSS variables for metallic faceplate, brass hinges, mahogany briefcase enclosure, realistic 3D LED glow, toggle switches, and rocker power controls)
- **State Management**: Reactive React Hooks with centralized simulation engine pipeline
- **Testing**: Vitest with React Testing Library and JSDOM

---

## 3. High-Level Modular Architecture

```
[UI / User Interaction Layer]
   │
   ├── Header (Power, Diagnostics, Wire Palette, Zoom, Undo/Redo, Reset)
   ├── OutputSection (16 LED Lamps L16..L1 with banana sockets OP16..OP1)
   ├── SevenSegSection (Dual 7-Segment Displays A & B + Logic Probe)
   ├── PowerRails (VCC +5V Rail & GND 0V Rail with 10 banana sockets each)
   ├── SocketsSection (U1..U5 14/16-pin ZIF Sockets + U6 28-pin ZIF Socket)
   ├── InputSection (16 3D Hardware Toggle Switches S16..S1 with lamps & IP16..IP1)
   ├── ClockPulserSection (Variable 0.2–5.0Hz Clock + Single-Pulse Debounced Pulser)
   ├── WiresLayer (SVG overlay calculating natural catenary/quadratic Bezier sags)
   └── StatusBar (Live connection prompt, wire count, and seated IC audit)
         │
         ▼
[Simulation Engine Pipeline (src/logic/simulationEngine.ts)]
   │
   ├── 1. Disjoint-Set / Union-Find Net Partitioning
   │      Groups all wired terminals into electrical equipotential nets.
   │
   ├── 2. Supply Rail & IC Power Verification
   │      Checks if VCC and GND pins of each seated IC reach active power rails.
   │
   ├── 3. Primary Driver Registration
   │      Registers VCC (1), GND (0), Switches (0/1), and Clock/Pulser (0/1).
   │
   ├── 4. Iterative Multi-Pass Propagation Loop (up to 25 iterations)
   │      - Resolves net logic values (0, 1, Z, or CONFLICT).
   │      - Detects bus contention (simultaneous 1 and 0 driving same net).
   │      - Evaluates combinational logic gates (7400, 7404, 7408, 7432, 7486).
   │      - Evaluates complex data selectors/multiplexers (74151, 74153).
   │      - Evaluates clocked sequential ICs (7476 JK Flip-Flop, 7490 Decade Counter).
   │      - Propagates outputs to downstream nets until stable state is reached.
   │
   └── 5. Board Display & Diagnostics Output
          - Drives 16 Output LEDs.
          - Updates 4-bit Hex/BCD 7-Segment Displays A & B.
          - Updates Logic Probe (High/Low LEDs).
          - Generates real-time Electrical Diagnostics report (Power, Signals, Nets).
```

---

## 4. IC Logic Models & Registries

### A. Centralized Typed Registry (`src/logic/icDefinitions.ts`)
Each IC is modeled with:
- Exact part number, package (DIP-14 or DIP-16), and description.
- Pinout map assigning pin number to functional name, signal type (`in`, `out`, `vcc`, `gnd`, `clk`, `nc`), and gate association.
- Pure evaluation function (`evaluate` or `evaluateSequential`).

### B. Supported ICs
1. **7400** — Quad 2-Input NAND Gate
2. **7404** — Hex Inverter (NOT Gates)
3. **7408** — Quad 2-Input AND Gate
4. **7432** — Quad 2-Input OR Gate
5. **7486** — Quad 2-Input XOR Gate
6. **74151** — 8-to-1 Multiplexer (Active-LOW Strobe $G$, Complementary Outputs $Y$ & $W$)
7. **74153** — Dual 4-to-1 Multiplexer (Two independent 4:1 sections, shared select $B,A$, separate active-LOW enables $1\bar{G}, 2\bar{G}$, outputs $1Y, 2Y$)
8. **7476** — Dual J-K Flip-Flop with Preset & Clear (Negative-edge triggered, active-low asynchronous $\bar{PRE}$ and $\bar{CLR}$)
9. **7490** — Decade & Binary Counter (Divide-by-2 section, divide-by-5 section, master reset $R_0(1,2)$, master set $R_9(1,2)$, full BCD $0-9$ decade cascade)

---

## 5. Wiring Engine & Coordinate Transformation
- Terminals are identified by unique string keys (e.g., `vcc:1`, `gnd:5`, `in:3`, `out:2`, `U1:p14`, `seg:a0`, `clk:main`, `probe`).
- `WiresLayer` queries the DOM for terminal centers relative to `trainerBoard.getBoundingClientRect()`.
- Zoom scaling factor is normalized in coordinate calculations to preserve alignment at any zoom level ($60\%$ to $140\%$).
- Wires are drawn with dynamic Bezier sag proportional to terminal Euclidean distance ($sag = \min(80, \max(30, dist \times 0.15))$).
- Auto-wire color coding rules:
  - VCC nets $\rightarrow$ Red (`#dc2626`)
  - GND nets $\rightarrow$ Green (`#16a34a`)
  - Clock nets $\rightarrow$ Amber (`#d97706`)
  - Output LED nets $\rightarrow$ Purple (`#9333ea`)
  - Signal nets $\rightarrow$ Blue (`#2563eb`)

---

## 6. Practicals & Verification Engine (`src/data/experiments.ts`)
- Features 20 full laboratory experiments (19 from reference + 1 dedicated 74153 practical).
- Each practical defines:
  - Required ICs and socket allocations.
  - Step-by-step wiring instructions.
  - Truth table or state transition table.
  - Full reference patch wire schematic.
  - Viva voce questions and answers.
- Automated Verification checks:
  - Correct ICs seated in designated sockets.
  - All seated ICs powered via VCC and GND.
  - Minimum wire threshold satisfied.
  - Outputs connected to indicators.
