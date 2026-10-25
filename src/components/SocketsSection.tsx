import React from 'react';
import { SocketState } from '../types';
import { IC_DEFINITIONS } from '../logic/icDefinitions';

interface SocketsSectionProps {
  sockets: Record<string, SocketState>;
  socketPower: Record<string, boolean>;
  selectedTerminal: string | null;
  onTerminalClick: (tid: string) => void;
  connectedTerminals: Set<string>;
  onOpenIcModal: (sockId: string) => void;
  onEjectIc: (sockId: string) => void;
  onViewPinout?: (icId: string, socketId: string) => void;
}

export const SocketsSection: React.FC<SocketsSectionProps> = ({
  sockets,
  socketPower,
  selectedTerminal,
  onTerminalClick,
  connectedTerminals,
  onOpenIcModal,
  onEjectIc,
  onViewPinout
}) => {
  const socketIds = ['U1', 'U2', 'U3', 'U4', 'U5', 'U6'];

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'vcc':
        return 'text-red-600 font-extrabold';
      case 'gnd':
        return 'text-emerald-700 font-extrabold';
      case 'clk':
        return 'text-amber-600 font-bold';
      case 'out':
        return 'text-blue-600 font-bold';
      case 'in':
        return 'text-slate-700 font-semibold';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="flex items-start justify-between gap-3 overflow-x-auto py-2">
      {socketIds.map(sockId => {
        const sock = sockets[sockId];
        const icDef = sock?.ic ? IC_DEFINITIONS[sock.ic] : null;
        const maxPins = icDef ? icDef.pins : sockId === 'U6' ? 28 : 16;
        const isPowered = socketPower[sockId];

        const leftPins: number[] = [];
        const rightPins: number[] = [];
        const half = maxPins / 2;

        for (let p = 1; p <= half; p++) {
          leftPins.push(p);
        }
        for (let p = maxPins; p > half; p--) {
          rightPins.push(p);
        }

        let pwrClass = 'bg-slate-200 text-slate-600';
        let pwrText = 'EMPTY';
        if (sock?.ic) {
          if (isPowered) {
            pwrClass = 'bg-emerald-600 text-white animate-pulse';
            pwrText = '⚡ POWERED';
          } else {
            pwrClass = 'bg-rose-600 text-white';
            pwrText = '⚠ NO POWER';
          }
        }

        return (
          <div
            key={sockId}
            className="flex-1 min-w-[170px] max-w-[210px] bg-slate-100/80 rounded border border-slate-300 p-2 shadow-sm flex flex-col"
          >
            {/* Socket Header */}
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-300">
              <span className="text-xs font-black text-slate-800">{sockId}</span>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider ${pwrClass}`}>
                {pwrText}
              </span>
            </div>

            {/* Socket Body with Pin Columns */}
            <div className="flex items-center justify-between gap-1">
              {/* Left Column: Pins 1..half */}
              <div className="flex flex-col gap-1.5 items-end">
                {leftPins.map(p => {
                  const tid = `${sockId}:p${p}`;
                  const pinInfo = icDef?.pinout[p];
                  const fnLabel = pinInfo ? pinInfo.name : '—';
                  const isSelected = selectedTerminal === tid;
                  const isConnected = connectedTerminals.has(tid);

                  return (
                    <div key={p} className="flex items-center gap-1">
                      <span className="text-[9px] text-slate-500 font-mono w-3 text-right">{p}</span>
                      <div
                        data-tid={tid}
                        onClick={() => onTerminalClick(tid)}
                        className={`terminal-jack ${isSelected ? 'selected' : ''} ${
                          isConnected ? 'connected' : ''
                        }`}
                        title={`${sockId} Pin ${p}: ${fnLabel}`}
                      />
                      <span
                        className={`text-[9px] w-7 truncate text-left ${getTypeColor(pinInfo?.type)}`}
                        title={fnLabel}
                      >
                        {fnLabel}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Center ZIF Core */}
              <div
                onClick={() => {
                  if (!sock?.ic) onOpenIcModal(sockId);
                }}
                className={`zif-socket-core ${sock?.ic ? 'locked' : ''} ${sockId === 'U6' ? 'w-[100px]' : 'w-[80px]'}`}
                title={sock?.ic ? `${sock.ic} seated in ${sockId}` : `Click to insert IC into ${sockId}`}
              >
                <div className="zif-lever">
                  <div className="zif-lever-knob" />
                </div>

                {sock?.ic && icDef ? (
                  <div className="seated-ic">
                    <span className="text-xs font-black text-amber-400 tracking-wider font-mono">
                      {sock.ic}
                    </span>
                    <span className="text-[8px] text-slate-400 truncate max-w-[68px]">
                      {icDef.name.split(' ')[1] || 'TTL IC'}
                    </span>
                    <div className="flex flex-col gap-1 w-full px-1 mt-1">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onViewPinout?.(sock.ic!, sockId);
                        }}
                        className="text-[9px] font-bold bg-blue-700 hover:bg-blue-600 text-white px-1.5 py-0.5 rounded cursor-pointer transition-colors shadow flex items-center justify-center gap-1"
                        title="View Schematic & Pinout Diagram"
                      >
                        <span>📐</span> Pinout
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onEjectIc(sockId);
                        }}
                        className="text-[9px] font-bold bg-rose-800 hover:bg-rose-700 text-white px-1.5 py-0.5 rounded cursor-pointer transition-colors shadow flex items-center justify-center"
                        title="Remove this IC and disconnect its wires"
                      >
                        Eject
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-2 text-emerald-100 hover:text-white transition-colors">
                    <span className="text-xl font-bold leading-none mb-1">＋</span>
                    <span className="text-[10px] font-bold tracking-tight">Click to Insert IC</span>
                  </div>
                )}
              </div>

              {/* Right Column: Pins maxPins..half+1 */}
              <div className="flex flex-col gap-1.5 items-start">
                {rightPins.map(p => {
                  const tid = `${sockId}:p${p}`;
                  const pinInfo = icDef?.pinout[p];
                  const fnLabel = pinInfo ? pinInfo.name : '—';
                  const isSelected = selectedTerminal === tid;
                  const isConnected = connectedTerminals.has(tid);

                  return (
                    <div key={p} className="flex items-center gap-1">
                      <span
                        className={`text-[9px] w-7 truncate text-right ${getTypeColor(pinInfo?.type)}`}
                        title={fnLabel}
                      >
                        {fnLabel}
                      </span>
                      <div
                        data-tid={tid}
                        onClick={() => onTerminalClick(tid)}
                        className={`terminal-jack ${isSelected ? 'selected' : ''} ${
                          isConnected ? 'connected' : ''
                        }`}
                        title={`${sockId} Pin ${p}: ${fnLabel}`}
                      />
                      <span className="text-[9px] text-slate-500 font-mono w-3 text-left">{p}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
