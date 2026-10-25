import React from 'react';

interface InputSectionProps {
  switches: Record<number, number>;
  onToggleSwitch: (swId: number) => void;
  selectedTerminal: string | null;
  onTerminalClick: (tid: string) => void;
  connectedTerminals: Set<string>;
}

export const InputSection: React.FC<InputSectionProps> = ({
  switches,
  onToggleSwitch,
  selectedTerminal,
  onTerminalClick,
  connectedTerminals
}) => {
  const switchIds = [];
  for (let i = 16; i >= 1; i--) {
    switchIds.push(i);
  }

  return (
    <div className="panel-section input-section flex-1 min-w-[500px]">
      <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-300">
        <span className="section-title">INPUT LOGIC SWITCHES</span>
        <span className="text-[10px] text-slate-500 font-medium hidden md:inline">
          Toggle switch UP = HIGH (1), DOWN = LOW (0). Connect terminals IP16..IP1 to IC inputs.
        </span>
      </div>

      <div className="grid grid-flow-col auto-cols-fr gap-2 justify-items-center items-center py-1">
        {switchIds.map(i => {
          const tid = `in:${i}`;
          const isHigh = switches[i] === 1;
          const isSelected = selectedTerminal === tid;
          const isConnected = connectedTerminals.has(tid);

          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-700 tracking-tight">S{i}</span>
              <div
                data-tid={tid}
                onClick={() => onTerminalClick(tid)}
                className={`terminal-jack ${isSelected ? 'selected' : ''} ${
                  isConnected ? 'connected' : ''
                }`}
                title={`Input Switch S${i} (Terminal IP${i})`}
              />
              <div
                id={`sw_led_${i}`}
                className={`lamp ${isHigh ? 'on' : ''}`}
              />
              <div
                id={`sw_toggle_${i}`}
                onClick={() => onToggleSwitch(i)}
                className={`toggle-switch-hardware ${isHigh ? 'up' : 'down'}`}
                title={`Toggle Switch S${i} (${isHigh ? 'HIGH (1)' : 'LOW (0)'})`}
              >
                <div className="switch-lever" />
              </div>
              <span
                id={`sw_lbl_${i}`}
                className={`text-[10px] font-mono font-bold ${
                  isHigh ? 'text-red-600' : 'text-slate-600'
                }`}
              >
                {isHigh ? '1' : '0'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
