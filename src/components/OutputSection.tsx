import React from 'react';
import { LogicValue } from '../types';

interface OutputSectionProps {
  outputLeds: Record<number, LogicValue>;
  selectedTerminal: string | null;
  onTerminalClick: (tid: string) => void;
  connectedTerminals: Set<string>;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  outputLeds,
  selectedTerminal,
  onTerminalClick,
  connectedTerminals
}) => {
  const units = [];
  // L16 on the left down to L1 on the right
  for (let i = 16; i >= 1; i--) {
    units.push(i);
  }

  return (
    <div className="panel-section output-section flex-1 min-w-[400px]">
      <div className="section-title text-red">OUTPUT SECTION</div>
      <div className="grid grid-flow-col auto-cols-fr gap-2 justify-items-center items-center py-1">
        {units.map(i => {
          const tid = `out:${i}`;
          const val = outputLeds[i];
          const isSelected = selectedTerminal === tid;
          const isConnected = connectedTerminals.has(tid);

          let lampClass = 'lamp';
          if (val === 1) lampClass += ' on';
          else if (val === 'CONFLICT') lampClass += ' conflict';

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-700 tracking-tight">L{i}</span>
              <div id={`led_${i}`} className={lampClass} />
              <div
                data-tid={tid}
                onClick={() => onTerminalClick(tid)}
                className={`terminal-jack ${isSelected ? 'selected' : ''} ${isConnected ? 'connected' : ''}`}
                title={`Output LED L${i} (Terminal OP${i})`}
              />
              <span className="text-[9px] font-semibold text-slate-500 tracking-tighter">OP{i}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
