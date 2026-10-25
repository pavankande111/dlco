# Known Limitations & Simulation Boundaries

## 1. Digital Logic Simulation vs. Analog Electrical Modeling
- **Discrete Logic Levels**: The simulation engine operates on four discrete logic values:
  - `0`: Logic LOW (Ground reference, 0V)
  - `1`: Logic HIGH (VCC supply, +5V)
  - `'Z'`: High-impedance / Floating / Unconnected
  - `'CONFLICT'`: Bus contention / Short circuit (opposing drivers on the same electrical net)
- **Not a SPICE / Transistor-Level Simulator**: The application does not simulate sub-nanosecond analog transient phenomena, parasitic capacitance, gate input capacitance, trace inductance, or thermal dissipation. Propagation delays are evaluated via discrete multi-pass topological relaxation (up to 25 passes).

## 2. Floating Input Policy
- In physical bipolar TTL 74-series logic chips, unconnected input pins naturally drift toward a logic HIGH voltage due to internal pull-up emitter biasing.
- In this simulator, floating inputs are explicitly treated as `'Z'` (unconnected) and surfaced as advisory warnings in the Circuit Diagnostics panel. This design choice prevents student confusion and enforces proper laboratory wiring discipline.

## 3. Patch Wire Mechanics
- Patch wires are rendered as 2D quadratic Bezier curves with natural catenary sagging. They do not simulate rigid 3D wire bundle collisions or physical gravity wrapping around obstacles.

## 4. Test Environment Note
- During the initial inspection phase, headless browser launching via the subagent encountered a Playwright driver CDN download 404 in the Windows host environment.
- The reference web application source assets (`index.html`, `app.js`, `style.css`) and UI screenshots were directly retrieved and completely analyzed.
- All 44 automated unit, integration, and UI component tests were executed and passed cleanly via Vitest and JSDOM.
