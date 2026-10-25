import React from 'react';

interface HeaderProps {
  onOpenExperiments: () => void;
  onOpenDiagnostics: () => void;
  onOpenPinouts: () => void;
  diagStatus: 'ok' | 'warn' | 'err';
  wireColor: string;
  onWireColorChange: (color: string) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClearWires: () => void;
  onResetBoard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenExperiments,
  onOpenDiagnostics,
  onOpenPinouts,
  diagStatus,
  wireColor,
  onWireColorChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClearWires,
  onResetBoard
}) => {
  const badgeClasses = {
    ok: 'bg-emerald-600 text-white',
    warn: 'bg-amber-600 text-white',
    err: 'bg-rose-600 text-white'
  }[diagStatus];

  const badgeText = {
    ok: 'OK',
    warn: 'CHECK',
    err: 'ERROR'
  }[diagStatus];

  return (
    <header className="bg-slate-900 text-slate-100 border-b-2 border-slate-700 px-5 py-2.5 flex items-center justify-between gap-4 flex-wrap z-50 select-none shadow-md">
      <div className="header-brand">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-extrabold bg-red-700 text-white px-2 py-0.5 rounded tracking-wider inline-block">
            HARDWARE LAB INSTRUMENT
          </span>
          <span className="text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-600/40 px-2 py-0.5 rounded tracking-wide">
            KBTCOE • Information Technology
          </span>
        </div>
        <h1 className="text-lg font-bold tracking-wide text-white flex items-center gap-2">
          DLCO Pin-to-Pin Virtual Trainer Kit
        </h1>
        <p className="text-xs text-slate-400">
          Designed &amp; Developed by <strong className="text-slate-200">Pavan Kande — KBTCOE, Information Technology</strong> • Real IC Pin Wiring
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
        {/* IC Pinouts & Schematics Button */}
        <button
          onClick={onOpenPinouts}
          className="bg-indigo-700 hover:bg-indigo-600 text-white px-3 py-1.5 rounded border border-indigo-500 transition-colors shadow flex items-center gap-1.5 cursor-pointer font-bold"
          title="Inspect Exact IC Pinout Diagrams & Internal Gate Schematics per Datasheet"
        >
          <span>📐</span> IC Schematics &amp; Pinouts
        </button>

        {/* Lab Practicals Button */}
        <button
          onClick={onOpenExperiments}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded border border-blue-500 transition-colors shadow flex items-center gap-1.5 cursor-pointer"
          title="Open Lab Practicals, Wiring Guides & Viva Questions"
        >
          <span>📖</span> Lab Practicals &amp; Viva (19 Experiments)
        </button>

        {/* Circuit Diagnostics Button */}
        <button
          onClick={onOpenDiagnostics}
          className="bg-slate-700 hover:bg-slate-600 text-slate-100 px-3 py-1.5 rounded border border-slate-600 transition-colors flex items-center gap-2 cursor-pointer"
          title="View Real-Time Circuit Diagnostics"
        >
          <span>🔍</span> Circuit Diagnostics{' '}
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${badgeClasses}`}>
            {badgeText}
          </span>
        </button>

        {/* Wire Color Picker */}
        <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700 text-slate-300">
          <label htmlFor="wireColorSelect">Wire:</label>
          <select
            id="wireColorSelect"
            value={wireColor}
            onChange={e => onWireColorChange(e.target.value)}
            className="bg-slate-900 text-slate-100 border border-slate-600 rounded px-1.5 py-0.5 cursor-pointer text-xs focus:outline-none"
          >
            <option value="auto">Auto (VCC:Red, GND:Green, Signal:Blue)</option>
            <option value="#2563eb">Blue (Signal)</option>
            <option value="#dc2626">Red (VCC / High)</option>
            <option value="#16a34a">Green (GND / Low)</option>
            <option value="#d97706">Amber (Clock / Data)</option>
            <option value="#7c3aed">Purple</option>
            <option value="#0d9488">Cyan</option>
            <option value="#111827">Black</option>
          </select>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">
          <button
            onClick={onZoomOut}
            className="w-6 h-6 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold cursor-pointer flex items-center justify-center"
            title="Zoom Out"
          >
            −
          </button>
          <span className="w-12 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button
            onClick={onZoomIn}
            className="w-6 h-6 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold cursor-pointer flex items-center justify-center"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={onZoomReset}
            className="w-6 h-6 bg-slate-700 hover:bg-slate-600 text-white rounded cursor-pointer flex items-center justify-center"
            title="Reset View"
          >
            ⟲
          </button>
        </div>

        {/* Undo / Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`px-2.5 py-1.5 rounded border transition-colors flex items-center gap-1 ${
            canUndo
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600 cursor-pointer'
              : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-50'
          }`}
          title="Undo last wire action (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`px-2.5 py-1.5 rounded border transition-colors flex items-center gap-1 ${
            canRedo
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600 cursor-pointer'
              : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-50'
          }`}
          title="Redo last wire action (Ctrl+Y)"
        >
          ↷ Redo
        </button>

        {/* Clear Wires */}
        <button
          onClick={onClearWires}
          className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded border border-amber-500 transition-colors shadow cursor-pointer"
          title="Remove all wires from the board"
        >
          Clear Wires
        </button>

        {/* Reset Board */}
        <button
          onClick={onResetBoard}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded border border-red-500 transition-colors shadow cursor-pointer"
          title="Clear entire board (ICs and wires)"
        >
          Reset Board
        </button>
      </div>
    </header>
  );
};
