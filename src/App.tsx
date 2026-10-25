import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Wire, SocketState, ClockState, PulserState, LogicValue } from './types';
import { runCircuitSimulation, formatTerminalName } from './logic/simulationEngine';
import { IC_DEFINITIONS } from './logic/icDefinitions';
import { EXPERIMENTS } from './data/experiments';

import { Header } from './components/Header';
import { OutputSection } from './components/OutputSection';
import { SevenSegSection } from './components/SevenSegSection';
import { PowerSwitch } from './components/PowerSwitch';
import { PowerRail } from './components/PowerRails';
import { SocketsSection } from './components/SocketsSection';
import { InputSection } from './components/InputSection';
import { ClockPulserSection } from './components/ClockPulserSection';
import { WiresLayer } from './components/WiresLayer';
import { StatusBar } from './components/StatusBar';
import { IcSelectorModal } from './components/IcSelectorModal';
import { ExperimentDrawer } from './components/ExperimentDrawer';
import { DiagnosticsModal } from './components/DiagnosticsModal';
import { PinoutDiagramModal } from './components/PinoutDiagramModal';

export const App: React.FC = () => {
  const boardRef = useRef<HTMLDivElement>(null);

  // Board State
  const [mainsPower, setMainsPower] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1.0);
  const [wireColor, setWireColor] = useState<string>('auto');

  // Terminal & Wire Selection
  const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);
  const [selectedWireId, setSelectedWireId] = useState<number | null>(null);
  const [nextWireId, setNextWireId] = useState<number>(1);

  // Input Switches (1 to 16, default 0)
  const [switches, setSwitches] = useState<Record<number, number>>(() => {
    const sw: Record<number, number> = {};
    for (let i = 1; i <= 16; i++) sw[i] = 0;
    return sw;
  });

  // IC Sockets (U1 to U6)
  const [sockets, setSockets] = useState<Record<string, SocketState>>({
    U1: { ic: null, icState: null, isPowered: false },
    U2: { ic: null, icState: null, isPowered: false },
    U3: { ic: null, icState: null, isPowered: false },
    U4: { ic: null, icState: null, isPowered: false },
    U5: { ic: null, icState: null, isPowered: false },
    U6: { ic: null, icState: null, isPowered: false }
  });

  // Patch Wires
  const [wires, setWires] = useState<Wire[]>([]);
  const [undoStack, setUndoStack] = useState<Wire[][]>([]);
  const [redoStack, setRedoStack] = useState<Wire[][]>([]);

  // Clock & Pulser State
  const [clock, setClock] = useState<ClockState>({
    running: false,
    frequency: 1.0,
    state: 0,
    pulseCount: 0
  });

  const [pulser, setPulser] = useState<PulserState>({ state: 0 });

  // Status & Feedback
  const [statusMessage, setStatusMessage] = useState<string>(
    'Trainer Ready. Select an IC from a socket or load a lab practical to begin.'
  );
  const [isStatusError, setIsStatusError] = useState<boolean>(false);
  const [wirePrompt, setWirePrompt] = useState<string>(
    'Wiring Mode: Click any pin or terminal to start a wire.'
  );

  // Modals & Drawers
  const [isIcModalOpen, setIsIcModalOpen] = useState<boolean>(false);
  const [targetModalSocket, setTargetModalSocket] = useState<string | null>(null);
  const [isExpDrawerOpen, setIsExpDrawerOpen] = useState<boolean>(false);
  const [isDiagModalOpen, setIsDiagModalOpen] = useState<boolean>(false);
  const [isPinoutModalOpen, setIsPinoutModalOpen] = useState<boolean>(false);
  const [pinoutModalIcId, setPinoutModalIcId] = useState<string | null>('7408');
  const [pinoutModalSocketId, setPinoutModalSocketId] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<{ pass: boolean; msg: string } | null>(null);

  const handleOpenPinout = useCallback((icId: string, socketId?: string) => {
    setPinoutModalIcId(icId);
    setPinoutModalSocketId(socketId || null);
    setIsPinoutModalOpen(true);
  }, []);

  const flashStatus = useCallback((msg: string, isErr = false) => {
    setStatusMessage(msg);
    setIsStatusError(isErr);
  }, []);

  // Set of currently connected terminals
  const connectedTerminals = useMemo(() => {
    const set = new Set<string>();
    wires.forEach(w => {
      set.add(w.from);
      set.add(w.to);
    });
    return set;
  }, [wires]);

  // Wire Auto Color Resolver
  const getAutoWireColor = useCallback(
    (tidA: string, tidB: string): string => {
      if (wireColor !== 'auto') return wireColor;
      if (tidA.startsWith('vcc:') || tidB.startsWith('vcc:')) return '#dc2626'; // Red for VCC
      if (tidA.startsWith('gnd:') || tidB.startsWith('gnd:')) return '#16a34a'; // Green for GND
      if (tidA.startsWith('clk:') || tidB.startsWith('clk:')) return '#d97706'; // Amber for Clock
      if (tidA.startsWith('out:') || tidB.startsWith('out:')) return '#9333ea'; // Purple for Output LEDs
      return '#2563eb'; // Blue for signals
    },
    [wireColor]
  );

  // Undo / Redo History
  const saveWireHistory = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-99), wires]);
    setRedoStack([]);
  }, [wires]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) {
      flashStatus('Nothing to undo.', true);
      return;
    }
    const previous = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, wires]);
    setUndoStack(prev => prev.slice(0, -1));
    setWires(previous);
    setSelectedWireId(null);
    setSelectedTerminal(null);
    flashStatus('Undo successful.');
  }, [undoStack, wires, flashStatus]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) {
      flashStatus('Nothing to redo.', true);
      return;
    }
    const next = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, wires]);
    setRedoStack(prev => prev.slice(0, -1));
    setWires(next);
    setSelectedWireId(null);
    setSelectedTerminal(null);
    flashStatus('Redo successful.');
  }, [redoStack, wires, flashStatus]);

  // Terminal Click Handler (Wire Creation)
  const handleTerminalClick = useCallback(
    (tid: string) => {
      if (!mainsPower) {
        flashStatus('Mains power is OFF. Switch ON power to operate.', true);
        return;
      }

      // Case 1: Start wire
      if (!selectedTerminal) {
        setSelectedTerminal(tid);
        setSelectedWireId(null);
        setWirePrompt(`Selected: ${formatTerminalName(tid, sockets)}. Now click destination terminal.`);
        return;
      }

      // Case 2: Click same terminal -> Cancel
      if (selectedTerminal === tid) {
        setSelectedTerminal(null);
        setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
        return;
      }

      // Case 3: Complete wire between selectedTerminal and tid
      const tidA = selectedTerminal;
      const tidB = tid;

      const duplicate = wires.some(
        w => (w.from === tidA && w.to === tidB) || (w.from === tidB && w.to === tidA)
      );

      if (duplicate) {
        flashStatus('A wire already connects these two terminals.', true);
        setSelectedTerminal(null);
        setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
        return;
      }

      saveWireHistory();
      const color = getAutoWireColor(tidA, tidB);
      setWires(prev => [
        ...prev,
        {
          id: nextWireId,
          from: tidA,
          to: tidB,
          color
        }
      ]);
      setNextWireId(n => n + 1);
      setSelectedTerminal(null);
      setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
      flashStatus(`Connected ${formatTerminalName(tidA, sockets)} to ${formatTerminalName(tidB, sockets)}.`);
    },
    [mainsPower, selectedTerminal, wires, nextWireId, sockets, saveWireHistory, getAutoWireColor, flashStatus]
  );

  const handleCancelWire = useCallback(() => {
    setSelectedTerminal(null);
    setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
  }, []);

  const handleSelectWire = useCallback((wireId: number) => {
    setSelectedWireId(wireId);
    setSelectedTerminal(null);
    setWirePrompt(`Wire #${wireId} selected. Press Delete or click 'Delete Wire' to remove.`);
  }, []);

  const handleDeleteWire = useCallback(() => {
    if (!selectedWireId) return;
    saveWireHistory();
    setWires(prev => prev.filter(w => w.id !== selectedWireId));
    setSelectedWireId(null);
    setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
    flashStatus('Selected wire deleted.');
  }, [selectedWireId, saveWireHistory, flashStatus]);

  // Clear Wires
  const handleClearWires = useCallback(() => {
    if (wires.length === 0) return;
    saveWireHistory();
    setWires([]);
    setSelectedWireId(null);
    setSelectedTerminal(null);
    setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
    flashStatus('All patch wires cleared.');
  }, [wires.length, saveWireHistory, flashStatus]);

  // Reset Entire Board
  const handleResetBoard = useCallback(() => {
    saveWireHistory();
    setWires([]);
    setSelectedWireId(null);
    setSelectedTerminal(null);
    setSockets({
      U1: { ic: null, icState: null, isPowered: false },
      U2: { ic: null, icState: null, isPowered: false },
      U3: { ic: null, icState: null, isPowered: false },
      U4: { ic: null, icState: null, isPowered: false },
      U5: { ic: null, icState: null, isPowered: false },
      U6: { ic: null, icState: null, isPowered: false }
    });
    setSwitches(() => {
      const sw: Record<number, number> = {};
      for (let i = 1; i <= 16; i++) sw[i] = 0;
      return sw;
    });
    setClock(c => ({ ...c, running: false, state: 0, pulseCount: 0 }));
    setVerifyResult(null);
    setWirePrompt('Wiring Mode: Click any pin or terminal to start a wire.');
    flashStatus('Board reset: All ICs and wires removed.');
  }, [saveWireHistory, flashStatus]);

  // Keyboard Shortcuts (Esc, Del, Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (e.key === 'Escape') {
        handleCancelWire();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedWireId) {
          e.preventDefault();
          handleDeleteWire();
        }
      } else if (e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if (e.ctrlKey && !e.altKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCancelWire, handleDeleteWire, handleUndo, handleRedo, selectedWireId]);

  // Switch Toggle
  const handleToggleSwitch = useCallback(
    (swId: number) => {
      if (!mainsPower) {
        flashStatus('Mains power is OFF.', true);
        return;
      }
      setSwitches(prev => {
        const nextVal = prev[swId] === 1 ? 0 : 1;
        flashStatus(`Switch S${swId} set to ${nextVal}.`);
        return { ...prev, [swId]: nextVal };
      });
    },
    [mainsPower, flashStatus]
  );

  // Clock Start / Stop & Frequency
  const handleToggleClock = useCallback(() => {
    if (!mainsPower) {
      flashStatus('Mains power is OFF.', true);
      return;
    }
    setClock(c => {
      const nextRunning = !c.running;
      flashStatus(nextRunning ? 'Clock started.' : 'Clock stopped.');
      return { ...c, running: nextRunning };
    });
  }, [mainsPower, flashStatus]);

  const handleFreqChange = useCallback((freq: number) => {
    setClock(c => ({ ...c, frequency: freq }));
  }, []);

  // Continuous Clock Generator Timer Effect
  useEffect(() => {
    if (!clock.running || !mainsPower) return;

    // Period in ms for half-cycle
    const halfPeriodMs = Math.max(50, Math.round(500 / clock.frequency));

    const interval = setInterval(() => {
      setClock(prev => {
        const nextState = prev.state === 1 ? 0 : 1;
        const nextCount = nextState === 1 ? prev.pulseCount + 1 : prev.pulseCount;
        return {
          ...prev,
          state: nextState,
          pulseCount: nextCount
        };
      });
    }, halfPeriodMs);

    return () => clearInterval(interval);
  }, [clock.running, clock.frequency, mainsPower]);

  // Manual Pulser (Single clean pulse: 1 -> 0 -> 1 falling edge pulse)
  const handleManualPulse = useCallback(() => {
    if (!mainsPower) {
      flashStatus('Mains power is OFF.', true);
      return;
    }

    setPulser({ state: 1 });
    setClock(c => ({ ...c, pulseCount: c.pulseCount + 1 }));
    flashStatus('Manual clock pulse sent.');

    setTimeout(() => {
      setPulser({ state: 0 });
    }, 180);
  }, [mainsPower, flashStatus]);

  const handleResetPulseCount = useCallback(() => {
    setClock(c => ({ ...c, pulseCount: 0 }));
    flashStatus('Pulse counter reset.');
  }, [flashStatus]);

  // IC Insertion & Ejection
  const handleOpenIcModal = useCallback((sockId: string) => {
    setTargetModalSocket(sockId);
    setIsIcModalOpen(true);
  }, []);

  const handleSelectIc = useCallback(
    (sockId: string, icCode: string) => {
      const icDef = IC_DEFINITIONS[icCode];
      if (!icDef) return;

      setSockets(prev => ({
        ...prev,
        [sockId]: {
          ic: icCode,
          icState: icDef.initInternalState ? icDef.initInternalState() : null,
          isPowered: false
        }
      }));
      flashStatus(`Inserted IC ${icCode} into ${sockId}. Connect VCC and GND pins to power it.`);
    },
    [flashStatus]
  );

  const handleEjectIc = useCallback(
    (sockId: string) => {
      const ic = sockets[sockId]?.ic;
      if (!ic) return;

      // Safely disconnect attached wires
      saveWireHistory();
      const prefix = `${sockId}:p`;
      setWires(prev => prev.filter(w => !w.from.startsWith(prefix) && !w.to.startsWith(prefix)));

      setSockets(prev => ({
        ...prev,
        [sockId]: { ic: null, icState: null, isPowered: false }
      }));
      flashStatus(`Ejected IC ${ic} from ${sockId}.`);
    },
    [sockets, saveWireHistory, flashStatus]
  );

  // Practical Experiments Handlers
  const handleSetupExpIcs = useCallback(
    (expId: string) => {
      const exp = EXPERIMENTS[expId];
      if (!exp) return;

      saveWireHistory();
      setSockets(() => {
        const nextSock: Record<string, SocketState> = {
          U1: { ic: null, icState: null, isPowered: false },
          U2: { ic: null, icState: null, isPowered: false },
          U3: { ic: null, icState: null, isPowered: false },
          U4: { ic: null, icState: null, isPowered: false },
          U5: { ic: null, icState: null, isPowered: false },
          U6: { ic: null, icState: null, isPowered: false }
        };

        Object.keys(exp.socketLayout).forEach(sockId => {
          const code = exp.socketLayout[sockId];
          const icDef = IC_DEFINITIONS[code];
          nextSock[sockId] = {
            ic: code,
            icState: icDef?.initInternalState ? icDef.initInternalState() : null,
            isPowered: false
          };
        });
        return nextSock;
      });

      setVerifyResult(null);
      flashStatus(`Prepared sockets for ${exp.title}. Connect wires or click 'Auto-Wire'.`);
    },
    [saveWireHistory, flashStatus]
  );

  const handleAutoWireExp = useCallback(
    (expId: string) => {
      const exp = EXPERIMENTS[expId];
      if (!exp) return;

      handleSetupExpIcs(expId);

      const newWires: Wire[] = exp.referenceWires.map((w, idx) => ({
        id: nextWireId + idx,
        from: w.from,
        to: w.to,
        color: getAutoWireColor(w.from, w.to)
      }));

      setNextWireId(n => n + newWires.length);
      setWires(newWires);
      setVerifyResult(null);
      flashStatus(`Auto-wired reference circuit for ${exp.title}. Ready to test!`);
    },
    [handleSetupExpIcs, nextWireId, getAutoWireColor, flashStatus]
  );

  const handleVerifyCircuit = useCallback(
    (expId: string) => {
      const exp = EXPERIMENTS[expId];
      if (!exp) return;

      // Check 1: Required ICs
      const missingIcs: string[] = [];
      Object.keys(exp.socketLayout).forEach(sockId => {
        const expected = exp.socketLayout[sockId];
        if (sockets[sockId]?.ic !== expected) {
          missingIcs.push(`${sockId} needs ${expected}`);
        }
      });

      if (missingIcs.length > 0) {
        setVerifyResult({
          pass: false,
          msg: `Missing required ICs: ${missingIcs.join(', ')}.`
        });
        return;
      }

      // Check 2: Minimum Wires
      if (wires.length < exp.referenceWires.length * 0.6) {
        setVerifyResult({
          pass: false,
          msg: `Incomplete wiring: Circuit has only ${wires.length} wires. Follow the step-by-step guide.`
        });
        return;
      }

      // Check 3: Output connected
      const hasOutputWired = wires.some(w => w.from.startsWith('out:') || w.to.startsWith('out:'));
      if (!hasOutputWired) {
        setVerifyResult({
          pass: false,
          msg: 'Output LEDs not connected! Connect IC outputs to OP1, OP2... to observe results.'
        });
        return;
      }

      setVerifyResult({
        pass: true,
        msg: 'Circuit Verified Successfully! All required ICs are seated, powered, and wired matching the expected truth table.'
      });
    },
    [sockets, wires]
  );

  // Run Simulation Engine
  const simResult = useMemo(() => {
    return runCircuitSimulation(
      mainsPower,
      wires,
      sockets,
      switches,
      clock.state,
      pulser.state
    );
  }, [mainsPower, wires, sockets, switches, clock.state, pulser.state]);

  const activeIcCount = useMemo(() => {
    return Object.values(sockets).filter(s => !!s.ic).length;
  }, [sockets]);

  const livePinValues = useMemo(() => {
    if (!pinoutModalSocketId) return undefined;
    const map: Record<number, LogicValue> = {};
    for (let p = 1; p <= 28; p++) {
      const tid = `${pinoutModalSocketId}:p${p}`;
      if (simResult.pinValues[tid] !== undefined) {
        map[p] = simResult.pinValues[tid];
      }
    }
    return map;
  }, [pinoutModalSocketId, simResult.pinValues]);

  const diagStatus: 'ok' | 'warn' | 'err' = simResult.hasErrors
    ? 'err'
    : simResult.hasWarnings
    ? 'warn'
    : 'ok';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 select-none">
      {/* 1. Header Toolbar */}
      <Header
        onOpenExperiments={() => setIsExpDrawerOpen(true)}
        onOpenDiagnostics={() => setIsDiagModalOpen(true)}
        onOpenPinouts={() => handleOpenPinout('7408')}
        diagStatus={diagStatus}
        wireColor={wireColor}
        onWireColorChange={setWireColor}
        zoom={zoom}
        onZoomIn={() => setZoom(z => Math.min(1.4, Math.round((z + 0.1) * 10) / 10))}
        onZoomOut={() => setZoom(z => Math.max(0.6, Math.round((z - 0.1) * 10) / 10))}
        onZoomReset={() => setZoom(1.0)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        onClearWires={handleClearWires}
        onResetBoard={handleResetBoard}
      />

      {/* 2. Workspace Briefcase Enclosure */}
      <main className="flex-1 flex justify-center items-start p-4 overflow-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950">
        <div
          className="wooden-case"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          {/* Top Brass Hinges */}
          <div className="case-hinge hinge-left" />
          <div className="case-hinge hinge-center" />
          <div className="case-hinge hinge-right" />

          <div className="case-inner-rim">
            {/* Main Trainer Board Faceplate */}
            <div id="trainerBoard" ref={boardRef} className="trainer-faceplate">
              {/* Corner Screws */}
              <div className="plate-screw screw-tl" />
              <div className="plate-screw screw-tr" />
              <div className="plate-screw screw-bl" />
              <div className="plate-screw screw-br" />
              <div className="plate-screw screw-tc" />
              <div className="plate-screw screw-bc" />

              {/* TOP ROW: OUTPUTS, 7-SEGMENT & PROBE, MAINS POWER SWITCH */}
              <div className="flex items-stretch justify-between gap-3">
                <OutputSection
                  outputLeds={simResult.outputLeds}
                  selectedTerminal={selectedTerminal}
                  onTerminalClick={handleTerminalClick}
                  connectedTerminals={connectedTerminals}
                />
                <SevenSegSection
                  segA={simResult.segA}
                  segB={simResult.segB}
                  probeH={simResult.probeLedH}
                  probeL={simResult.probeLedL}
                  selectedTerminal={selectedTerminal}
                  onTerminalClick={handleTerminalClick}
                  connectedTerminals={connectedTerminals}
                />
                <PowerSwitch
                  mainsPower={mainsPower}
                  onTogglePower={() => setMainsPower(p => !p)}
                />
              </div>

              {/* UPPER POWER RAIL: VCC (+5V) */}
              <PowerRail
                type="vcc"
                selectedTerminal={selectedTerminal}
                onTerminalClick={handleTerminalClick}
                connectedTerminals={connectedTerminals}
              />

              {/* MIDDLE SECTION: 6 IC SOCKETS */}
              <SocketsSection
                sockets={sockets}
                socketPower={simResult.socketPower}
                selectedTerminal={selectedTerminal}
                onTerminalClick={handleTerminalClick}
                connectedTerminals={connectedTerminals}
                onOpenIcModal={handleOpenIcModal}
                onEjectIc={handleEjectIc}
                onViewPinout={(icId, sockId) => handleOpenPinout(icId, sockId)}
              />

              {/* LOWER POWER RAIL: GROUND (0V) */}
              <PowerRail
                type="gnd"
                selectedTerminal={selectedTerminal}
                onTerminalClick={handleTerminalClick}
                connectedTerminals={connectedTerminals}
              />

              {/* BOTTOM ROW: INPUT SWITCHES & CLOCK/PULSER */}
              <div className="flex items-stretch justify-between gap-3">
                <InputSection
                  switches={switches}
                  onToggleSwitch={handleToggleSwitch}
                  selectedTerminal={selectedTerminal}
                  onTerminalClick={handleTerminalClick}
                  connectedTerminals={connectedTerminals}
                />
                <ClockPulserSection
                  clock={clock}
                  pulser={pulser}
                  onToggleClock={handleToggleClock}
                  onFreqChange={handleFreqChange}
                  onManualPulse={handleManualPulse}
                  onResetPulseCount={handleResetPulseCount}
                  selectedTerminal={selectedTerminal}
                  onTerminalClick={handleTerminalClick}
                  connectedTerminals={connectedTerminals}
                />
              </div>

              {/* SVG LAYER FOR REALISTIC PATCH WIRES */}
              <WiresLayer
                wires={wires}
                selectedWireId={selectedWireId}
                onSelectWire={handleSelectWire}
                boardRef={boardRef}
                zoom={zoom}
              />
            </div>
          </div>
        </div>
      </main>

      {/* 3. Status Bar */}
      <StatusBar
        statusMessage={statusMessage}
        isStatusError={isStatusError}
        selectedTerminal={selectedTerminal}
        selectedWireId={selectedWireId}
        wirePrompt={wirePrompt}
        wireCount={wires.length}
        activeIcCount={activeIcCount}
        onCancelWire={handleCancelWire}
        onDeleteWire={handleDeleteWire}
      />

      {/* Footer Branding */}
      <footer className="text-center py-2.5 text-xs text-slate-400 bg-slate-950 border-t border-slate-900 select-none">
        <p className="font-bold text-slate-300">DLCO Pin-to-Pin Virtual Trainer Kit</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Designed &amp; Developed by <span className="font-bold text-slate-200">Pavan Kande — KBTCOE, Information Technology</span>. All rights reserved.
        </p>
      </footer>

      {/* Modals & Drawers */}
      <IcSelectorModal
        isOpen={isIcModalOpen}
        socketId={targetModalSocket}
        onClose={() => setIsIcModalOpen(false)}
        onSelectIc={handleSelectIc}
        onViewPinout={icId => handleOpenPinout(icId)}
      />

      <PinoutDiagramModal
        isOpen={isPinoutModalOpen}
        onClose={() => setIsPinoutModalOpen(false)}
        initialIcId={pinoutModalIcId}
        activeSocketId={pinoutModalSocketId}
        livePinValues={livePinValues}
      />

      <ExperimentDrawer
        isOpen={isExpDrawerOpen}
        onClose={() => setIsExpDrawerOpen(false)}
        onSetupIcs={handleSetupExpIcs}
        onAutoWire={handleAutoWireExp}
        onVerify={handleVerifyCircuit}
        verifyResult={verifyResult}
      />

      <DiagnosticsModal
        isOpen={isDiagModalOpen}
        onClose={() => setIsDiagModalOpen(false)}
        hasErrors={simResult.hasErrors}
        hasWarnings={simResult.hasWarnings}
        powerList={simResult.powerList}
        signalList={simResult.signalList}
        netList={simResult.netList}
      />
    </div>
  );
};

export default App;
