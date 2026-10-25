import React from 'react';

interface SevenSegSectionProps {
  segA: string;
  segB: string;
  probeH: boolean;
  probeL: boolean;
  selectedTerminal: string | null;
  onTerminalClick: (tid: string) => void;
  connectedTerminals: Set<string>;
}

export const SevenSegSection: React.FC<SevenSegSectionProps> = ({
  segA,
  segB,
  probeH,
  probeL,
  selectedTerminal,
  onTerminalClick,
  connectedTerminals
}) => {
  const renderJack = (tid: string, label: string, title: string) => {
    const isSelected = selectedTerminal === tid;
    const isConnected = connectedTerminals.has(tid);

    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[9px] font-bold text-slate-600">{label}</span>
        <div
          data-tid={tid}
          onClick={() => onTerminalClick(tid)}
          className={`terminal-jack ${isSelected ? 'selected' : ''} ${isConnected ? 'connected' : ''}`}
          title={title}
        />
      </div>
    );
  };

  return (
    <div className="panel-section display-probe-section min-w-[280px]">
      <div className="section-title">7 SEGMENT DISPLAY</div>
      <div className="flex items-center justify-around gap-4">
        {/* Display A */}
        <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded border border-slate-300">
          <div className="seg-display" id="segA">
            {segA}
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            {renderJack('seg:a3', 'A3', '7-Seg A Bit 3 (MSB)')}
            {renderJack('seg:a2', 'A2', '7-Seg A Bit 2')}
            {renderJack('seg:a1', 'A1', '7-Seg A Bit 1')}
            {renderJack('seg:a0', 'A0', '7-Seg A Bit 0 (LSB)')}
          </div>
        </div>

        {/* Display B */}
        <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded border border-slate-300">
          <div className="seg-display" id="segB">
            {segB}
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            {renderJack('seg:b3', 'B3', '7-Seg B Bit 3 (MSB)')}
            {renderJack('seg:b2', 'B2', '7-Seg B Bit 2')}
            {renderJack('seg:b1', 'B1', '7-Seg B Bit 1')}
            {renderJack('seg:b0', 'B0', '7-Seg B Bit 0 (LSB)')}
          </div>
        </div>

        {/* Logic Probe */}
        <div className="flex flex-col items-center justify-center gap-1 bg-slate-200/60 px-2 py-1.5 rounded border border-slate-300">
          <span className="text-[9px] font-extrabold text-slate-700 text-center leading-tight">
            LOGIC<br />PROBE
          </span>
          <div className="flex items-center gap-2 my-0.5">
            <div className="flex items-center gap-1">
              <div id="probeLedH" className={`lamp probe-lamp-h ${probeH ? 'on' : ''}`} />
              <span className="text-[10px] font-bold text-slate-700">H</span>
            </div>
            <div className="flex items-center gap-1">
              <div id="probeLedL" className={`lamp probe-lamp-l ${probeL ? 'on' : ''}`} />
              <span className="text-[10px] font-bold text-slate-700">L</span>
            </div>
          </div>
          <div
            data-tid="probe"
            onClick={() => onTerminalClick('probe')}
            className={`terminal-jack ${selectedTerminal === 'probe' ? 'selected' : ''} ${
              connectedTerminals.has('probe') ? 'connected' : ''
            }`}
            title="Logic Probe Input Terminal"
          />
        </div>
      </div>
    </div>
  );
};
