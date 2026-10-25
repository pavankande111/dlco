# IC Test Coverage & Verification Report

## Summary
- **Total Test Files**: 7
- **Total Automated Tests Executed**: 44
- **Passed**: 44
- **Failed**: 0
- **Execution Time**: ~10s via Vitest & JSDOM

---

## 1. Test Suite Breakdown

### Suite 1: Combinational Logic Gates (`src/test/icCombinational.test.ts`) — 10 Tests Passed
- **IC 7400 Quad 2-Input NAND Gate**:
  - Verified 14-pin DIP configuration, VCC=Pin 14, GND=Pin 7, and 4 gates.
  - Verified exhaustive truth table: $(0,0)\rightarrow 1$, $(0,1)\rightarrow 1$, $(1,0)\rightarrow 1$, $(1,1)\rightarrow 0$.
  - Verified floating/high-impedance input propagation ($Z \rightarrow Z$).
- **IC 7404 Hex Inverter (NOT Gates)**:
  - Verified 14-pin DIP configuration, VCC=Pin 14, GND=Pin 7, and 6 inverters.
  - Verified inversion for all 6 gates: $0 \rightarrow 1$, $1 \rightarrow 0$.
- **IC 7408 Quad 2-Input AND Gate**:
  - Verified 14-pin DIP configuration, VCC=Pin 14, GND=Pin 7, and 4 gates.
  - Verified exhaustive truth table: $(0,0)\rightarrow 0$, $(0,1)\rightarrow 0$, $(1,0)\rightarrow 0$, $(1,1)\rightarrow 1$.
- **IC 7432 Quad 2-Input OR Gate**:
  - Verified 14-pin DIP configuration, VCC=Pin 14, GND=Pin 7, and 4 gates.
  - Verified exhaustive truth table: $(0,0)\rightarrow 0$, $(0,1)\rightarrow 1$, $(1,0)\rightarrow 1$, $(1,1)\rightarrow 1$.
- **IC 7486 Quad 2-Input XOR Gate**:
  - Verified 14-pin DIP configuration, VCC=Pin 14, GND=Pin 7, and 4 gates.
  - Verified exhaustive truth table: $(0,0)\rightarrow 0$, $(0,1)\rightarrow 1$, $(1,0)\rightarrow 1$, $(1,1)\rightarrow 0$.

---

### Suite 2: 74151 8-to-1 Multiplexer (`src/test/ic74151.test.ts`) — 4 Tests Passed
- Verified 16-pin DIP package, VCC=Pin 16, GND=Pin 8.
- Verified active-low Strobe input $\bar{G}$ (Pin 7): when HIGH, output $Y$ is forced to $0$ and inverted output $W$ is forced to $1$.
- Verified all 8 select combinations ($C, B, A = 000$ to $111$) correctly route data inputs $D_0$ through $D_7$ to true output $Y$ (Pin 5) and complementary output $W$ (Pin 6).
- Verified floating input handling ($Z$).

---

### Suite 3: 74153 Dual 4-to-1 Multiplexer (`src/test/ic74153.test.ts`) — 6 Tests Passed
- Verified physical pin configuration per Texas Instruments SN74LS153 datasheet:
  - Pin 1: $1\bar{G}$ (Mux 1 Enable)
  - Pin 2: $B$ (Shared Select S1)
  - Pins 3–6: $1C_3, 1C_2, 1C_1, 1C_0$ (Mux 1 Data Inputs)
  - Pin 7: $1Y$ (Mux 1 Output)
  - Pin 8: GND
  - Pin 9: $2Y$ (Mux 2 Output)
  - Pins 10–13: $2C_0, 2C_1, 2C_2, 2C_3$ (Mux 2 Data Inputs)
  - Pin 14: $A$ (Shared Select S0)
  - Pin 15: $2\bar{G}$ (Mux 2 Enable)
  - Pin 16: VCC
- **Section 1 Testing**:
  - Disabled state: $1\bar{G} = 1 \implies 1Y = 0$.
  - Enabled state: Tested all 4 select combinations ($BA = 00, 01, 10, 11$) routing $1C_0, 1C_1, 1C_2, 1C_3$ to $1Y$ for both high and low data levels.
- **Section 2 Testing**:
  - Disabled state: $2\bar{G} = 1 \implies 2Y = 0$.
  - Enabled state: Tested all 4 select combinations ($BA = 00, 01, 10, 11$) routing $2C_0, 2C_1, 2C_2, 2C_3$ to $2Y$.
- **Simultaneous Operation**:
  - Verified both multiplexer halves operate concurrently with independent data inputs and separate enables.

---

### Suite 4: 7476 Dual J-K Flip-Flop (`src/test/ic7476.test.ts`) — 9 Tests Passed
- Verified physical pinout per Texas Instruments SN74LS76A datasheet:
  - Pin 5: VCC, Pin 13: GND (16-pin DIP).
  - FF1: Pin 1 (1CLK), Pin 2 (1J), Pin 3 (1K), Pin 4 ($1\bar{PRE}$), Pin 6 ($1\bar{CLR}$), Pin 7 (1Q), Pin 8 ($1\bar{Q}$).
  - FF2: Pin 16 (2CLK), Pin 15 (2J), Pin 14 (2K), Pin 12 ($2\bar{PRE}$), Pin 11 ($2\bar{CLR}$), Pin 10 (2Q), Pin 9 ($2\bar{Q}$).
- **Asynchronous Preset and Clear**:
  - $1\bar{PRE}=0, 1\bar{CLR}=1 \implies Q=1, \bar{Q}=0$ (overriding clock and J-K inputs).
  - $1\bar{PRE}=1, 1\bar{CLR}=0 \implies Q=0, \bar{Q}=1$ (overriding clock and J-K inputs).
  - Simultaneous active $1\bar{PRE}=0, 1\bar{CLR}=0 \implies Q=1, \bar{Q}=1$ (unstable condition modeled).
- **Clock-Triggered Transitions**:
  - Negative-edge triggering (transition from $1 \rightarrow 0$ on CLK):
    - $J=0, K=0 \implies$ Hold previous state.
    - $J=0, K=1 \implies$ Reset to $Q=0, \bar{Q}=1$.
    - $J=1, K=0 \implies$ Set to $Q=1, \bar{Q}=0$.
    - $J=1, K=1 \implies$ Toggle state ($0 \rightarrow 1 \rightarrow 0$).
  - Verified that rising clock edge ($0 \rightarrow 1$) does not trigger state changes.
- **Independent Dual Flip-Flop Execution**:
  - Verified FF2 transitions on 2CLK without disturbing FF1 state.

---

### Suite 5: 7490 Decade & Binary Counter (`src/test/ic7490.test.ts`) — 5 Tests Passed
- Verified physical pinout per Texas Instruments SN74LS90 datasheet:
  - Pin 5: VCC, Pin 10: GND (14-pin DIP).
  - Pin 14: CKA (divide-by-2 input, negative edge).
  - Pin 1: CKB (divide-by-5 input, negative edge).
  - Pins 2, 3: $R_0(1), R_0(2)$ (Master Reset to 0).
  - Pins 6, 7: $R_9(1), R_9(2)$ (Master Set to 9).
  - Pins 12, 9, 8, 11: $Q_A, Q_B, Q_C, Q_D$.
- **Asynchronous Controls**:
  - Master Reset: $R_0(1)=1 \land R_0(2)=1 \implies Q_D Q_C Q_B Q_A = 0000$.
  - Master Set: $R_9(1)=1 \land R_9(2)=1 \implies Q_D Q_C Q_B Q_A = 1001$ (BCD 9).
- **Divide-by-2 Section**:
  - Verified $Q_A$ toggles on each negative edge of CKA.
- **Complete Decade Counting Cascade**:
  - Connected $Q_A$ to CKB; applied 10 clock pulses to CKA.
  - Verified entire 10-state sequence:
    1. Pulse 1: 0001 (1)
    2. Pulse 2: 0010 (2)
    3. Pulse 3: 0011 (3)
    4. Pulse 4: 0100 (4)
    5. Pulse 5: 0101 (5)
    6. Pulse 6: 0110 (6)
    7. Pulse 7: 0111 (7)
    8. Pulse 8: 1000 (8)
    9. Pulse 9: 1001 (9)
    10. Pulse 10: 0000 (0, rolls over)

---

### Suite 6: Simulation Engine (`src/test/simulationEngine.test.ts`) — 7 Tests Passed
- Mains power switch off deactivates all outputs and displays.
- Unpowered ICs: pins remain floating ($Z$) if VCC or GND is missing.
- Powered IC validation: connects VCC to Pin 14 and GND to Pin 7.
- Bus Contention / Short Circuit Detection: flags opposing drivers (1 and 0 on same net) as critical diagnostic errors.
- End-to-end NAND circuit test with switches S1 & S2, gate routing, and output LED L1.
- 4-bit binary input decoding to 7-segment hex display (0 to F).
- Logic probe high and low level detection.

---

### Suite 7: UI Components (`src/test/uiComponents.test.tsx`) — 3 Tests Passed
- Header component rendering, practicals drawer toggle, clear wires, reset board.
- IC Selector Modal displaying cards for all 9 ICs, and selection event dispatch.
- Input Section toggle switch rendering and state changes.
