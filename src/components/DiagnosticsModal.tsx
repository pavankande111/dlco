import React from 'react';
import { DiagnosticItem } from '../types';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasErrors: boolean;
  hasWarnings: boolean;
  powerList: DiagnosticItem[];
  signalList: DiagnosticItem[];
  netList: DiagnosticItem[];
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({
  isOpen,
  onClose,
  hasErrors,
  hasWarnings,
  powerList,
  signalList,
  netList
}) => {
  if (!isOpen) return null;

  let bannerClass = 'bg-emerald-950/80 border-emerald-600 text-emerald-200';
  let bannerText = 'All circuits, power rails, and connected nets are operating normally.';

  if (hasErrors) {
    bannerClass = 'bg-rose-950/80 border-rose-600 text-rose-200';
    bannerText = 'Critical Electrical Warnings: Resolve unpowered ICs or bus conflicts.';
  } else if (hasWarnings) {
    bannerClass = 'bg-amber-950/80 border-amber-600 text-amber-200';
    bannerText = 'Circuit Advisory: Some IC inputs are floating or unconnected.';
  }

  const renderIcon = (type: DiagnosticItem['type']) => {
    switch (type) {
      case 'ok':
        return <span className="text-emerald-400 font-bold">✓</span>;
      case 'err':
        return <span className="text-rose-500 font-bold">✖</span>;
      case 'warn':
        return <span className="text-amber-400 font-bold">⚠</span>;
      default:
        return <span className="text-sky-400 font-bold">ℹ</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>🔍</span> Live Electrical Diagnostics &amp; Net Audit
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer transition-colors w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* Summary Banner */}
          <div className={`p-3.5 rounded-lg border text-xs font-semibold ${bannerClass}`}>
            {bannerText}
          </div>

          {/* 3 Grid Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Power & Ground Health */}
            <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/80 flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide border-b border-slate-700 pb-1.5 flex items-center justify-between">
                <span>Power &amp; Ground Health</span>
                <span className="text-[10px] text-slate-400 font-mono">({powerList.length})</span>
              </h4>
              <div className="flex flex-col gap-2 text-xs overflow-y-auto max-h-[260px] pr-1">
                {powerList.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-900/50 p-2 rounded">
                    {renderIcon(item.type)}
                    <span className="text-slate-300 leading-snug">{item.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Signal & Pin Integrity */}
            <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/80 flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide border-b border-slate-700 pb-1.5 flex items-center justify-between">
                <span>Signal &amp; Pin Integrity</span>
                <span className="text-[10px] text-slate-400 font-mono">({signalList.length})</span>
              </h4>
              <div className="flex flex-col gap-2 text-xs overflow-y-auto max-h-[260px] pr-1">
                {signalList.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-900/50 p-2 rounded">
                    {renderIcon(item.type)}
                    <span className="text-slate-300 leading-snug">{item.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Active Nets & Drivers */}
            <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/80 flex flex-col gap-2.5">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide border-b border-slate-700 pb-1.5 flex items-center justify-between">
                <span>Active Nets &amp; Drivers</span>
                <span className="text-[10px] text-slate-400 font-mono">({netList.length})</span>
              </h4>
              <div className="flex flex-col gap-2 text-xs font-mono overflow-y-auto max-h-[260px] pr-1">
                {netList.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-900/50 p-2 rounded text-[11px]">
                    {renderIcon(item.type)}
                    <span className="text-slate-300 leading-snug break-all">{item.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
