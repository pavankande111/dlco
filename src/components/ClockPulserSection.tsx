import React from 'react';
import { ClockState, PulserState } from '../types';

interface ClockPulserSectionProps {
  clock: ClockState;
  pulser: PulserState;
  onToggleClock: () => void;
  onFreqChange: (freq: number) => void;
  onManualPulse: () => void;
  onResetPulseCount: () => void;
  selectedTerminal: string | null;
  onTerminalClick: (tid: string) => void;
  connectedTerminals: Set<string>;
}

export const ClockPulserSection: React.FC<ClockPulserSectionProps> = ({
  clock,
  pulser,
  onToggleClock,
  onFreqChange,
  onManualPulse,
  onResetPulseCount,
  selectedTerminal,
  onTerminalClick,
  connectedTerminals
}) => {
  return (
    <div className="panel-section clock-section min-w-[320px]">
      <div className="flex items-center justify-between gap-4">
        {/* Continuous Clock Generator */}
        <div className="flex-1 bg-slate-200/60 p-2 rounded border border-slate-300">
          <div className="section-title text-clock">CLOCK SECTION</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div
                  id="clockStatusLed"
                  className={`lamp lamp-clock ${clock.running && clock.state === 1 ? 'on' : ''}`}
                />
                <span className="text-[10px] font-bold text-slate-700">
                  {clock.running ? 'RUNNING' : 'STOPPED'}
                </span>
              </div>
              <button
                id="btnClockStartStop"
                onClick={onToggleClock}
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded cursor-pointer transition-colors shadow ${
                  clock.running
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
                title="Start or Stop Continuous Clock"
              >
                {clock.running ? 'STOP' : 'RUN'}
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-600 font-semibold">
              <label htmlFor="clockFreqSlider">Rate: {clock.frequency.toFixed(1)} Hz</label>
              <input
                type="range"
                id="clockFreqSlider"
                min="0.2"
                max="5.0"
                step="0.2"
                value={clock.frequency}
                onChange={e => onFreqChange(parseFloat(e.target.value))}
                className="w-20 cursor-pointer accent-amber-600"
              />
            </div>

            <div className="flex items-center justify-around pt-1 border-t border-slate-300">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-700">CLK</span>
                <div
                  data-tid="clk:main"
                  onClick={() => onTerminalClick('clk:main')}
                  className={`terminal-jack jack-clk ${
                    selectedTerminal === 'clk:main' ? 'selected' : ''
                  } ${connectedTerminals.has('clk:main') ? 'connected' : ''}`}
                  title="Clock Output (Active High)"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-700">CLK̅</span>
                <div
                  data-tid="clk:bar"
                  onClick={() => onTerminalClick('clk:bar')}
                  className={`terminal-jack jack-clk-bar ${
                    selectedTerminal === 'clk:bar' ? 'selected' : ''
                  } ${connectedTerminals.has('clk:bar') ? 'connected' : ''}`}
                  title="Inverted Clock Output (Active Low)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Manual Pulser */}
        <div className="flex-1 bg-slate-200/60 p-2 rounded border border-slate-300">
          <div className="section-title text-pulser">PULSER</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div
                  id="pulserLed"
                  className={`lamp lamp-pulser ${pulser.state === 1 ? 'on' : ''}`}
                />
                <span className="text-[10px] font-bold text-slate-700">1-PULSE</span>
              </div>
              <button
                id="btnManualPulse"
                onClick={onManualPulse}
                className="text-[10px] font-black bg-sky-600 hover:bg-sky-700 active:scale-95 text-white px-3 py-1 rounded cursor-pointer transition-all shadow border border-sky-400"
                title="Press for a single clean clock pulse"
              >
                PUSH
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-300">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-slate-700">PULSE</span>
                <div
                  data-tid="clk:pulse"
                  onClick={() => onTerminalClick('clk:pulse')}
                  className={`terminal-jack jack-pulser ${
                    selectedTerminal === 'clk:pulse' ? 'selected' : ''
                  } ${connectedTerminals.has('clk:pulse') ? 'connected' : ''}`}
                  title="Manual Pulser Output Terminal"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-slate-600">PULSES:</span>
                <span className="font-mono font-bold text-xs bg-slate-900 text-sky-400 px-1.5 py-0.5 rounded border border-slate-700">
                  {String(clock.pulseCount % 100).padStart(2, '0')}
                </span>
                <button
                  id="btnResetCounter"
                  onClick={onResetPulseCount}
                  className="text-[8px] font-bold bg-slate-400 hover:bg-slate-500 text-white px-1 py-0.5 rounded cursor-pointer"
                  title="Reset Counter"
                >
                  CLR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
