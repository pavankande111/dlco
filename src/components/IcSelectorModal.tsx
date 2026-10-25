import React from 'react';
import { IC_DEFINITIONS } from '../logic/icDefinitions';

interface IcSelectorModalProps {
  isOpen: boolean;
  socketId: string | null;
  onClose: () => void;
  onSelectIc: (sockId: string, icCode: string) => void;
  onViewPinout?: (icId: string) => void;
}

export const IcSelectorModal: React.FC<IcSelectorModalProps> = ({
  isOpen,
  socketId,
  onClose,
  onSelectIc,
  onViewPinout
}) => {
  if (!isOpen || !socketId) return null;

  const icList = Object.values(IC_DEFINITIONS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>🔌</span> Insert IC into Socket {socketId}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer transition-colors w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <p className="text-xs text-slate-400 mb-4 font-medium">
            Select a TTL 74-Series digital logic IC to insert into this socket:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {icList.map(ic => (
              <div
                key={ic.id}
                onClick={() => {
                  onSelectIc(socketId, ic.id);
                  onClose();
                }}
                className="bg-slate-800/80 hover:bg-slate-750 hover:border-blue-500 border border-slate-700 rounded-lg p-3.5 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg flex flex-col gap-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-amber-400 font-mono tracking-wide group-hover:text-blue-400">
                    {ic.id}
                  </span>
                  <div className="flex items-center gap-2">
                    {onViewPinout && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onViewPinout(ic.id);
                        }}
                        className="text-[10px] bg-indigo-700 hover:bg-indigo-600 text-white font-bold px-2 py-0.5 rounded cursor-pointer transition-colors shadow flex items-center gap-1"
                        title="View Schematic Diagram"
                      >
                        <span>📐</span> Pinout
                      </button>
                    )}
                    <span className="text-[10px] font-bold bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                      {ic.package}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-200">{ic.name}</div>
                <div className="text-[11px] text-slate-400 leading-relaxed">{ic.description}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-700/60">
                  {ic.preview}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
