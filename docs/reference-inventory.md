# System Inventory & Hardware Specification: DLCO Pin-to-Pin Virtual Trainer Kit

- **Application Title**: DLCO Virtual IC Trainer Kit Simulator — Real Pin-to-Pin Lab Kit
- **Subtitle**: Digital Logic & Computer Organization • Real IC Pin Wiring & Electrical Simulation
- **Creator & Developer**: Pavan Kande — KBTCOE, Information Technology
- **Status**: Production Release

---

## 1. Physical Hardware & UI Architecture Observed
The application simulates a physical hardware laboratory trainer kit mounted inside a protective wooden briefcase enclosure:
- **Outer Wooden Enclosure**:
  - Dark polished wood grain finish with bevels and shadows.
  - Three brass hinges at the top (`hinge-left`, `hinge-center`, `hinge-right`).
  - Metal inner rim with recessed panel styling.
- **Main Trainer Faceplate**:
  - Brushed aluminum / metallic plate with six corner and center screws.
  - Sockets, switches, jacks, lamps, and displays mounted in organized sections.
- **Top Utility & Header Bar**:
  - Application title, subtitle, and "HARDWARE LAB INSTRUMENT" badge.
  - "Lab Practicals & Viva (19 Experiments)" button (opens slide-out drawer).
  - "Circuit Diagnostics" button with live status badge (`HEALTHY`, `CHECK`, `ERROR`).
  - Patch wire color picker: Auto (VCC:Red, GND:Green, Signal:Blue), Blue, Red, Green, Amber, Purple, Cyan, Black.
  - Canvas zoom controls: Zoom Out (−), current zoom label (e.g., 100%), Zoom In (+), Reset view (⟲).
  - Undo (Ctrl+Z) and Redo (Ctrl+Y) wire buttons.
  - "Clear Wires" and "Reset Board" buttons.
- **Output Section**:
  - 16 red LED lamps labeled `L16` down to `L1`.
  - 16 output banana socket terminals labeled `OP16` down to `OP1`.
- **7-Segment Display & Logic Probe Section**:
  - Display A (Hex/BCD 0–F) with 4 bit input terminals (`A3` MSB, `A2`, `A1`, `A0` LSB).
  - Display B (Hex/BCD 0–F) with 4 bit input terminals (`B3` MSB, `B2`, `B1`, `B0` LSB).
  - Logic Probe with `H` (High, Red/Green LED) and `L` (Low, Green LED) indicators and input jack terminal `PROBE`.
- **Mains Power Switch**:
  - Rocker switch (`ON` / `OFF`) with mechanical rocking action and red indicator LED.
- **Power Rails**:
  - Upper Rail: VCC (+5V) strip with 10 red banana sockets (5 pairs).
  - Lower Rail: GROUND (0V) strip with 10 green banana sockets (5 pairs).
- **IC Sockets Section**:
  - 5 DIP/ZIF sockets (`U1` to `U5`) for standard 14/16-pin ICs.
  - 1 extended ZIF socket (`U6`) for up to 28-pin ICs.
  - Each socket has:
    - Status badge (`EMPTY`, `⚠ NO POWER`, `⚡ POWERED`).
    - ZIF lever and insertion prompt ("+ Click to Insert IC").
    - Seated IC chip render with part number, subtitle, and "Eject" button.
    - Left column of numbered pin terminals with function labels.
    - Right column of numbered pin terminals with function labels.
- **Input Logic Switches Section**:
  - 16 toggle switches labeled `S16` down to `S1`.
  - Each switch has an input terminal jack (`IP16`..`IP1`), indicator LED, 3D toggle lever, and state display (`0` or `1`).
- **Clock & Pulser Section**:
  - Continuous Clock Generator:
    - RUN / STOPPED toggle button.
    - Frequency rate slider (0.2 Hz to 5.0 Hz).
    - Status LED and frequency readout.
    - Output jacks: `CLK` (Active High) and `CLK̅` (Active Low / inverted).
  - Manual Pulser:
    - Single pulse push button ("PUSH") generating clean falling edge pulses.
    - 1-Pulse indicator LED.
    - `PULSE` output terminal jack.
    - Digital pulse counter with 2-digit readout and `CLR` button.
- **Interactive Patch Wiring Engine**:
  - SVG overlay rendering realistic catenary / Bezier sag wires between terminals.
  - Click terminal A to select, click terminal B to complete wire.
  - Click wire to select; delete with Delete key or button.
  - Full undo/redo stack.
  - Automatic wire color coding based on terminal net types (VCC=Red, GND=Green, Clock=Amber, Output=Purple, Signal=Blue).
- **Status & Feedback Bar**:
  - Live system status message and prompt.
  - Cancel wire button.
  - Wire count and seated IC count displays.
- **Modals and Drawers**:
  - IC Selector Dialog: Grid of cards for inserting chips into selected socket.
  - Lab Practicals & Viva Voce Drawer: 19 structured experiments with aim, required ICs, step-by-step instructions, truth tables, viva questions, and automated wiring / verification.
  - Circuit Diagnostics Modal: Real-time electrical net audit, power/ground health, floating pins detection, and bus contention / short circuit warning.

---

## 2. Reference IC Inventory

### Existing ICs Discovered in Reference
| IC Code | Name | Package | VCC Pin | GND Pin | Key Functionality |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **7400** | Quad 2-Input NAND Gate | 14-Pin DIP | Pin 14 | Pin 7 | 4 independent 2-input NAND gates |
| **7404** | Hex Inverter (NOT Gates) | 14-Pin DIP | Pin 14 | Pin 7 | 6 independent NOT inverters |
| **7408** | Quad 2-Input AND Gate | 14-Pin DIP | Pin 14 | Pin 7 | 4 independent 2-input AND gates |
| **7432** | Quad 2-Input OR Gate | 14-Pin DIP | Pin 14 | Pin 7 | 4 independent 2-input OR gates |
| **7486** | Quad 2-Input XOR Gate | 14-Pin DIP | Pin 14 | Pin 7 | 4 independent 2-input XOR gates |
| **74151** | 8-to-1 Multiplexer | 16-Pin DIP | Pin 16 | Pin 8 | 8 data inputs, 3 select lines (C,B,A), Strobe G̅, true Y & inverted W outputs |
| **7476** | Dual J-K Flip-Flop | 16-Pin DIP | Pin 5 | Pin 13 | 2 independent negative-edge J-K flip-flops with active-low PRE̅ and CLR̅ |
| **7490** | Decade & Binary Counter | 14-Pin DIP | Pin 5 | Pin 10 | Divide-by-2 & divide-by-5 counters with master reset R0(1,2) and set R9(1,2) |

### Missing ICs Required by Specification (To Be Added)
| IC Code | Name | Package | VCC Pin | GND Pin | Key Functionality |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **74153** | Dual 4-to-1 Multiplexer | 16-Pin DIP | Pin 16 | Pin 8 | Two independent 4-input MUXes, shared select S0 (Pin 14) and S1 (Pin 2), separate active-low enables 1G̅ (Pin 1) and 2G̅ (Pin 15), outputs 1Y (Pin 7) and 2Y (Pin 9). |

### Complete Combined Suite: 9 ICs
1. **7400** — Quad 2-Input NAND Gate
2. **7404** — Hex Inverter
3. **7408** — Quad 2-Input AND Gate
4. **7432** — Quad 2-Input OR Gate
5. **7486** — Quad 2-Input XOR Gate
6. **74151** — 8-to-1 Multiplexer
7. **74153** — Dual 4-to-1 Multiplexer *(Added)*
8. **7476** — Dual J-K Flip-Flop with Preset & Clear
9. **7490** — Decade & Binary Counter

---

## 3. Discovered Laboratory Practicals (19 Curriculum Experiments)
1. **Full Adder** (Sum & Carry using XOR, AND, OR)
2. **Full Subtractor** (Difference & Borrow using XOR, NOT, AND, OR)
3. **3-bit Binary to Gray Code Converter**
4. **4-bit Binary to Gray Code Converter**
5. **1-bit Magnitude Comparator** (A>B, A=B, A<B)
6. **Even Parity Generator and Checker**
7. **Odd Parity Generator and Checker**
8. **8-to-1 Multiplexer Verification** (IC 74151)
9. **Boolean Function Realization**: $F(A,B,C) = \Sigma m(0,3,5,6)$ via 74151
10. **Boolean Function Realization**: $F(A,B,C,D) = \Sigma m(1,2,4,7,8,10,11,13,15)$ via 74151
11. **2-bit Asynchronous Ripple Up Counter** (IC 7476)
12. **3-bit Asynchronous Ripple Up Counter** (IC 7476)
13. **4-bit Asynchronous Ripple Up Counter** (IC 7476)
14. **2-bit Asynchronous Ripple Down Counter** (IC 7476)
15. **3-bit Asynchronous Ripple Down Counter** (IC 7476)
16. **4-bit Asynchronous Ripple Down Counter** (IC 7476)
17. **2-bit Asynchronous Ripple Up-Down Counter** (Steering logic)
18. **4-bit Asynchronous Ripple Up-Down Counter**
19. **MOD-N Decade Counter using IC 7490** (BCD 0 to 9 & Modulo-6)
+ Additional Lab Guide for **Dual 4-to-1 Multiplexer Verification (IC 74153)**.

---

## 4. Environment Notes & Verification Status
- During initial inspection, automated browser launching via subagent encountered a Playwright driver 404 download issue from the CDN in this Windows environment.
- The reference web application source code (`index.html`, `app.js`, `style.css`) and reference screenshot were directly retrieved and analyzed to verify all 19 practicals, exact pinout definitions, simulation graph resolution, and styling tokens.
