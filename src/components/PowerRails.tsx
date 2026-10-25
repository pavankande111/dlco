import React from 'react';

interface PowerRailProps {
  type: 'vcc' | 'gnd';
  selectedTerminal: string | null;
  onTerminalClick: (tid: string) => void;
  connectedTerminals: Set<string>;
}

export const PowerRail: React.FC<PowerRailProps> = ({
  type,
  selectedTerminal,
  onTerminalClick,
  connectedTerminals
}) => {
  const isVcc = type === 'vcc';
  const title = isVcc ? 'VCC (+5V)' : 'GROUND (0V)';
  const titleColor = isVcc ? 'text-red-700' : 'text-emerald-700';
  const subtitle = isVcc
    ? 'All VCC terminals share the common +5V supply line. Connect IC VCC pins here.'
    : 'All GROUND terminals share the common 0V reference. Connect IC GND pins here.';
  const prefix = isVcc ? 'vcc' : 'gnd';
  const jackExtra = isVcc ? 'jack-vcc' : 'jack-gnd';

  // 10 terminals in 5 pairs
  const pairs = [1, 2, 3, 4, 5];

  return (
    <div className={`flex items-center justify-between px-3 py-1.5 rounded border ${
      isVcc ? 'bg-red-50/60 border-red-200' : 'bg-emerald-50/60 border-emerald-200'
    } shadow-inner`}>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-black tracking-wide ${titleColor}`}>{title}</span>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">{subtitle}</span>
      </div>

      <div className="flex items-center gap-6">
        {pairs.map(p => {
          const t1 = (p - 1) * 2 + 1;
          const t2 = (p - 1) * 2 + 2;
          const tid1 = `${prefix}:${t1}`;
          const tid2 = `${prefix}:${t2}`;

          return (
            <div key={p} className="flex items-center gap-1.5 bg-slate-200/50 px-2 py-0.5 rounded border border-slate-300">
              <span className="text-[9px] font-extrabold text-slate-600">
                {isVcc ? 'VCC' : 'GND'}
              </span>
              <div
                data-tid={tid1}
                onClick={() => onTerminalClick(tid1)}
                className={`terminal-jack ${jackExtra} ${selectedTerminal === tid1 ? 'selected' : ''} ${
                  connectedTerminals.has(tid1) ? 'connected' : ''
                }`}
                title={`${isVcc ? 'VCC (+5V)' : 'GROUND (0V)'} Terminal #${t1}`}
              />
              <div
                data-tid={tid2}
                onClick={() => onTerminalClick(tid2)}
                className={`terminal-jack ${jackExtra} ${selectedTerminal === tid2 ? 'selected' : ''} ${
                  connectedTerminals.has(tid2) ? 'connected' : ''
                }`}
                title={`${isVcc ? 'VCC (+5V)' : 'GROUND (0V)'} Terminal #${t2}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
