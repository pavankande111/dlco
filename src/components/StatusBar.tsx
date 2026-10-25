import React from 'react';

interface StatusBarProps {
  statusMessage: string;
  isStatusError: boolean;
  selectedTerminal: string | null;
  selectedWireId: number | null;
  wirePrompt: string;
  wireCount: number;
  activeIcCount: number;
  onCancelWire: () => void;
  onDeleteWire: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  statusMessage,
  isStatusError,
  selectedTerminal,
  selectedWireId,
  wirePrompt,
  wireCount,
  activeIcCount,
  onCancelWire,
  onDeleteWire
}) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 px-4 py-2 flex items-center justify-between text-xs text-slate-300 z-40 select-none shadow">
      {/* Left Message */}
      <div className="flex items-center gap-2 max-w-[40%]">
        <span className="text-amber-400 text-sm">⚡</span>
        <span
          className={`truncate transition-colors ${
            isStatusError ? 'text-red-400 font-bold' : 'text-slate-200'
          }`}
          title={statusMessage}
        >
          {statusMessage}
        </span>
      </div>

      {/* Center Actions */}
      <div className="flex items-center gap-2.5">
        <span className="text-slate-400 font-medium">{wirePrompt}</span>
        {selectedTerminal && (
          <button
            onClick={onCancelWire}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors"
          >
            Cancel Wire (Esc)
          </button>
        )}
        {selectedWireId && (
          <button
            onClick={onDeleteWire}
            className="bg-rose-700 hover:bg-rose-600 text-white px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors"
          >
            Delete Wire (Del)
          </button>
        )}
      </div>

      {/* Right Stats & Attribution */}
      <div className="flex items-center gap-3 text-slate-400 font-medium">
        <span>{wireCount} Wires</span>
        <span>|</span>
        <span>{activeIcCount} ICs Seated</span>
        <span>|</span>
        <span className="text-[10px] font-bold text-amber-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          Dev: Pavan Kande (KBTCOE IT)
        </span>
      </div>
    </footer>
  );
};
