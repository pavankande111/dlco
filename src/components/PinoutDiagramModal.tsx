import React, { useState } from 'react';
import { IC_DEFINITIONS } from '../logic/icDefinitions';
import { LogicValue } from '../types';

interface PinoutDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIcId?: string | null;
  activeSocketId?: string | null;
  livePinValues?: Record<number, LogicValue>;
}

export const PinoutDiagramModal: React.FC<PinoutDiagramModalProps> = ({
  isOpen,
  onClose,
  initialIcId,
  activeSocketId,
  livePinValues
}) => {
  const [selectedIcId, setSelectedIcId] = useState<string>(() => initialIcId || '7408');

  // If initialIcId changes when modal opens
  React.useEffect(() => {
    if (initialIcId && IC_DEFINITIONS[initialIcId]) {
      setSelectedIcId(initialIcId);
    }
  }, [initialIcId]);

  if (!isOpen) return null;

  const ic = IC_DEFINITIONS[selectedIcId] || IC_DEFINITIONS['7408'];
  const pinCount = ic.pins;
  const halfPins = pinCount / 2;

  // Render pin live badge
  const renderLiveBadge = (pinNum: number) => {
    if (!livePinValues) return null;
    const val = livePinValues[pinNum];
    if (val === undefined || val === 'Z') {
      return (
        <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">
          Z
        </span>
      );
    }
    if (val === 1) {
      return (
        <span className="text-[9px] px-1 rounded bg-red-600 text-white font-mono font-bold shadow-sm shadow-red-500/50">
          H (1)
        </span>
      );
    }
    if (val === 0) {
      return (
        <span className="text-[9px] px-1 rounded bg-emerald-700 text-white font-mono font-bold shadow-sm shadow-emerald-500/50">
          L (0)
        </span>
      );
    }
    return (
      <span className="text-[9px] px-1 rounded bg-amber-600 text-white font-mono font-bold">
        {String(val)}
      </span>
    );
  };

  // Render SVG Vector Schematic matching textbook diagrams
  const renderSchematicSvg = () => {
    // 14-Pin DIP standard canvas: 520 x 300
    // 16-Pin DIP standard canvas: 560 x 320
    const is16Pin = pinCount === 16;
    const width = is16Pin ? 620 : 560;
    const height = 340;
    const chipX = 70;
    const chipY = 40;
    const chipW = width - 140;
    const chipH = height - 80;

    // Pin spacing
    const topPins: number[] = [];
    const botPins: number[] = [];
    for (let p = halfPins + 1; p <= pinCount; p++) topPins.unshift(p); // 14..8 or 16..9 from left to right
    for (let p = 1; p <= halfPins; p++) botPins.push(p);              // 1..7 or 1..8 from left to right

    const pinSpacing = chipW / (halfPins + 1);

    return (
      <div className="relative bg-white rounded-lg border-2 border-slate-300 p-4 shadow-inner flex flex-col items-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[620px] h-auto select-none font-sans"
        >
          {/* Chip Body Outline */}
          <rect
            x={chipX}
            y={chipY}
            width={chipW}
            height={chipH}
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="2.5"
            rx="4"
          />

          {/* Left Notch / Index Mark */}
          <path
            d={`M ${chipX} ${chipY + chipH / 2 - 16} A 16 16 0 0 0 ${chipX} ${chipY + chipH / 2 + 16}`}
            fill="#f1f5f9"
            stroke="#1e293b"
            strokeWidth="2.5"
          />

          {/* Center Chip Label */}
          <text
            x={chipX + chipW / 2}
            y={chipY + chipH / 2 - 6}
            textAnchor="middle"
            className="text-base font-black fill-slate-900 tracking-wider font-mono"
            fontWeight="bold"
            fontSize="18"
          >
            IC {ic.id}
          </text>
          <text
            x={chipX + chipW / 2}
            y={chipY + chipH / 2 + 14}
            textAnchor="middle"
            className="text-xs font-semibold fill-slate-500"
            fontSize="11"
          >
            {ic.name.split('(')[0]}
          </text>

          {/* VCC and GND Markings */}
          {ic.vccPin && (
            <text
              x={
                ic.vccPin > halfPins
                  ? chipX + (pinCount - ic.vccPin + 1) * pinSpacing - 12
                  : chipX + ic.vccPin * pinSpacing - 12
              }
              y={ic.vccPin > halfPins ? chipY - 14 : chipY + chipH + 26}
              className="text-xs font-black fill-red-600"
              fontSize="12"
              fontWeight="bold"
            >
              VCC
            </text>
          )}
          {ic.gndPin && (
            <text
              x={
                ic.gndPin > halfPins
                  ? chipX + (pinCount - ic.gndPin + 1) * pinSpacing - 12
                  : chipX + ic.gndPin * pinSpacing - 12
              }
              y={ic.gndPin > halfPins ? chipY - 14 : chipY + chipH + 26}
              className="text-xs font-black fill-emerald-700"
              fontSize="12"
              fontWeight="bold"
            >
              GND
            </text>
          )}

          {/* Top Pins (Pins halfPins+1 to pinCount) */}
          {topPins.map((p, idx) => {
            const px = chipX + (idx + 1) * pinSpacing;
            const py = chipY;
            const pinName = ic.pinout[p]?.name || `${p}`;
            return (
              <g key={`top-${p}`}>
                {/* Pin lead */}
                <rect
                  x={px - 6}
                  y={py - 10}
                  width="12"
                  height="10"
                  fill="#f1f5f9"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                />
                {/* Pin Number */}
                <text
                  x={px}
                  y={py - 14}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#0f172a"
                >
                  {p}
                </text>
                {/* Pin Name Inside */}
                <text
                  x={px}
                  y={py + 18}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={p === ic.vccPin ? '#dc2626' : p === ic.gndPin ? '#16a34a' : '#2563eb'}
                >
                  {pinName}
                </text>
              </g>
            );
          })}

          {/* Bottom Pins (Pins 1 to halfPins) */}
          {botPins.map((p, idx) => {
            const px = chipX + (idx + 1) * pinSpacing;
            const py = chipY + chipH;
            const pinName = ic.pinout[p]?.name || `${p}`;
            return (
              <g key={`bot-${p}`}>
                {/* Pin lead */}
                <rect
                  x={px - 6}
                  y={py}
                  width="12"
                  height="10"
                  fill="#f1f5f9"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                />
                {/* Pin Number */}
                <text
                  x={px}
                  y={py + 24}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#0f172a"
                >
                  {p}
                </text>
                {/* Pin Name Inside */}
                <text
                  x={px}
                  y={py - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={p === ic.vccPin ? '#dc2626' : p === ic.gndPin ? '#16a34a' : '#2563eb'}
                >
                  {pinName}
                </text>
              </g>
            );
          })}

          {/* INTERNAL GATE LOGIC SCHEMATIC VECTORS */}
          {/* 7408 AND Gate */}
          {ic.id === '7408' && (
            <g stroke="#1e293b" strokeWidth="1.5" fill="none">
              {/* Gate 1: 1A(1), 1B(2) -> 1Y(3) */}
              <path d="M 100 240 L 100 215 L 115 215" />
              <path d="M 130 240 L 130 225 L 115 225" />
              <path d="M 115 210 L 130 210 A 10 10 0 0 1 130 230 L 115 230 Z" fill="#e0f2fe" />
              <path d="M 140 220 L 160 220 L 160 240" />

              {/* Gate 2: 2A(4), 2B(5) -> 2Y(6) */}
              <path d="M 190 240 L 190 215 L 205 215" />
              <path d="M 220 240 L 220 225 L 205 225" />
              <path d="M 205 210 L 220 210 A 10 10 0 0 1 220 230 L 205 230 Z" fill="#e0f2fe" />
              <path d="M 230 220 L 250 220 L 250 240" />

              {/* Gate 3: 3A(9), 3B(10) -> 3Y(8) */}
              <path d="M 250 60 L 250 85 L 265 85" />
              <path d="M 220 60 L 220 75 L 265 75" />
              <path d="M 265 70 L 280 70 A 10 10 0 0 1 280 90 L 265 90 Z" fill="#e0f2fe" />
              <path d="M 290 80 L 310 80 L 310 60" />

              {/* Gate 4: 4A(12), 4B(13) -> 4Y(11) */}
              <path d="M 160 60 L 160 85 L 175 85" />
              <path d="M 130 60 L 130 75 L 175 75" />
              <path d="M 175 70 L 190 70 A 10 10 0 0 1 190 90 L 175 90 Z" fill="#e0f2fe" />
              <path d="M 200 80 L 220 80 L 220 60" />
            </g>
          )}

          {/* 7400 NAND Gate */}
          {ic.id === '7400' && (
            <g stroke="#1e293b" strokeWidth="1.5" fill="none">
              {/* Gate 1 */}
              <path d="M 100 240 L 100 215 L 115 215" />
              <path d="M 130 240 L 130 225 L 115 225" />
              <path d="M 115 210 L 130 210 A 10 10 0 0 1 130 230 L 115 230 Z" fill="#fef3c7" />
              <circle cx="142" cy="220" r="2.5" fill="#fff" />
              <path d="M 145 220 L 160 220 L 160 240" />

              {/* Gate 2 */}
              <path d="M 190 240 L 190 215 L 205 215" />
              <path d="M 220 240 L 220 225 L 205 225" />
              <path d="M 205 210 L 220 210 A 10 10 0 0 1 220 230 L 205 230 Z" fill="#fef3c7" />
              <circle cx="232" cy="220" r="2.5" fill="#fff" />
              <path d="M 235 220 L 250 220 L 250 240" />

              {/* Gate 3 */}
              <path d="M 250 60 L 250 85 L 265 85" />
              <path d="M 220 60 L 220 75 L 265 75" />
              <path d="M 265 70 L 280 70 A 10 10 0 0 1 280 90 L 265 90 Z" fill="#fef3c7" />
              <circle cx="292" cy="80" r="2.5" fill="#fff" />
              <path d="M 295 80 L 310 80 L 310 60" />

              {/* Gate 4 */}
              <path d="M 160 60 L 160 85 L 175 85" />
              <path d="M 130 60 L 130 75 L 175 75" />
              <path d="M 175 70 L 190 70 A 10 10 0 0 1 190 90 L 175 90 Z" fill="#fef3c7" />
              <circle cx="202" cy="80" r="2.5" fill="#fff" />
              <path d="M 205 80 L 220 80 L 220 60" />
            </g>
          )}

          {/* 7432 OR Gate */}
          {ic.id === '7432' && (
            <g stroke="#1e293b" strokeWidth="1.5" fill="none">
              {/* Gate 1 */}
              <path d="M 100 240 L 100 215 L 115 215" />
              <path d="M 130 240 L 130 225 L 115 225" />
              <path d="M 112 210 Q 120 220 112 230 Q 132 230 142 220 Q 132 210 112 210 Z" fill="#ecfdf5" />
              <path d="M 142 220 L 160 220 L 160 240" />

              {/* Gate 2 */}
              <path d="M 190 240 L 190 215 L 205 215" />
              <path d="M 220 240 L 220 225 L 205 225" />
              <path d="M 202 210 Q 210 220 202 230 Q 222 230 232 220 Q 222 210 202 210 Z" fill="#ecfdf5" />
              <path d="M 232 220 L 250 220 L 250 240" />

              {/* Gate 3 */}
              <path d="M 250 60 L 250 85 L 265 85" />
              <path d="M 220 60 L 220 75 L 265 75" />
              <path d="M 262 70 Q 270 80 262 90 Q 282 90 292 80 Q 282 70 262 70 Z" fill="#ecfdf5" />
              <path d="M 292 80 L 310 80 L 310 60" />

              {/* Gate 4 */}
              <path d="M 160 60 L 160 85 L 175 85" />
              <path d="M 130 60 L 130 75 L 175 75" />
              <path d="M 172 70 Q 180 80 172 90 Q 192 90 202 80 Q 192 70 172 70 Z" fill="#ecfdf5" />
              <path d="M 202 80 L 220 80 L 220 60" />
            </g>
          )}

          {/* 7486 XOR Gate */}
          {ic.id === '7486' && (
            <g stroke="#1e293b" strokeWidth="1.5" fill="none">
              {/* Gate 1 */}
              <path d="M 100 240 L 100 215 L 115 215" />
              <path d="M 130 240 L 130 225 L 115 225" />
              <path d="M 108 210 Q 116 220 108 230" />
              <path d="M 112 210 Q 120 220 112 230 Q 132 230 142 220 Q 132 210 112 210 Z" fill="#ede9fe" />
              <path d="M 142 220 L 160 220 L 160 240" />

              {/* Gate 2 */}
              <path d="M 190 240 L 190 215 L 205 215" />
              <path d="M 220 240 L 220 225 L 205 225" />
              <path d="M 198 210 Q 206 220 198 230" />
              <path d="M 202 210 Q 210 220 202 230 Q 222 230 232 220 Q 222 210 202 210 Z" fill="#ede9fe" />
              <path d="M 232 220 L 250 220 L 250 240" />

              {/* Gate 3 */}
              <path d="M 250 60 L 250 85 L 265 85" />
              <path d="M 220 60 L 220 75 L 265 75" />
              <path d="M 258 70 Q 266 80 258 90" />
              <path d="M 262 70 Q 270 80 262 90 Q 282 90 292 80 Q 282 70 262 70 Z" fill="#ede9fe" />
              <path d="M 292 80 L 310 80 L 310 60" />

              {/* Gate 4 */}
              <path d="M 160 60 L 160 85 L 175 85" />
              <path d="M 130 60 L 130 75 L 175 75" />
              <path d="M 168 70 Q 176 80 168 90" />
              <path d="M 172 70 Q 180 80 172 90 Q 192 90 202 80 Q 192 70 172 70 Z" fill="#ede9fe" />
              <path d="M 202 80 L 220 80 L 220 60" />
            </g>
          )}

          {/* 74266 XNOR Gate (Diagram 3 layout!) */}
          {ic.id === '74266' && (
            <g stroke="#1e293b" strokeWidth="1.5" fill="none">
              {/* Gate 1: 1A(1), 1B(2) -> 1Y(3) */}
              <path d="M 100 240 L 100 215 L 115 215" />
              <path d="M 130 240 L 130 225 L 115 225" />
              <path d="M 108 210 Q 116 220 108 230" />
              <path d="M 112 210 Q 120 220 112 230 Q 130 230 140 220 Q 130 210 112 210 Z" fill="#fdf2f8" />
              <circle cx="143" cy="220" r="2.5" fill="#fff" />
              <path d="M 146 220 L 160 220 L 160 240" />

              {/* Gate 2: 2A(5), 2B(6) -> 2Y(4) (Exact Diagram 3!) */}
              <path d="M 220 240 L 220 215 L 205 215" />
              <path d="M 250 240 L 250 225 L 205 225" />
              <path d="M 198 210 Q 206 220 198 230" />
              <path d="M 202 210 Q 210 220 202 230 Q 220 230 230 220 Q 220 210 202 210 Z" fill="#fdf2f8" />
              <circle cx="233" cy="220" r="2.5" fill="#fff" />
              <path d="M 233 220 L 190 220 L 190 240" />

              {/* Gate 3: 3A(8), 3B(9) -> 3Y(10) (Exact Diagram 3!) */}
              <path d="M 310 60 L 310 85 L 295 85" />
              <path d="M 280 60 L 280 75 L 295 75" />
              <path d="M 288 70 Q 296 80 288 90" />
              <path d="M 292 70 Q 300 80 292 90 Q 310 90 320 80 Q 310 70 292 70 Z" fill="#fdf2f8" />
              <circle cx="323" cy="80" r="2.5" fill="#fff" />
              <path d="M 326 80 L 250 80 L 250 60" />

              {/* Gate 4: 4A(12), 4B(13) -> 4Y(11) (Exact Diagram 3!) */}
              <path d="M 160 60 L 160 85 L 175 85" />
              <path d="M 130 60 L 130 75 L 175 75" />
              <path d="M 168 70 Q 176 80 168 90" />
              <path d="M 172 70 Q 180 80 172 90 Q 190 90 200 80 Q 190 70 172 70 Z" fill="#fdf2f8" />
              <circle cx="203" cy="80" r="2.5" fill="#fff" />
              <path d="M 206 80 L 220 80 L 220 60" />
            </g>
          )}

          {/* 7404 Hex Inverter (Exact Diagram 3!) */}
          {ic.id === '7404' && (
            <g stroke="#1e293b" strokeWidth="1.5" fill="none">
              {/* Inverter 1: 1->2 */}
              <path d="M 100 240 L 100 220 L 112 220" />
              <path d="M 112 210 L 126 220 L 112 230 Z" fill="#fef2f2" />
              <circle cx="129" cy="220" r="2.5" fill="#fff" />
              <path d="M 132 220 L 130 220 L 130 240" />

              {/* Inverter 2: 3->4 */}
              <path d="M 160 240 L 160 220 L 172 220" />
              <path d="M 172 210 L 186 220 L 172 230 Z" fill="#fef2f2" />
              <circle cx="189" cy="220" r="2.5" fill="#fff" />
              <path d="M 192 220 L 190 220 L 190 240" />

              {/* Inverter 3: 5->6 */}
              <path d="M 220 240 L 220 220 L 232 220" />
              <path d="M 232 210 L 246 220 L 232 230 Z" fill="#fef2f2" />
              <circle cx="249" cy="220" r="2.5" fill="#fff" />
              <path d="M 252 220 L 250 220 L 250 240" />

              {/* Inverter 4: 9->8 */}
              <path d="M 250 60 L 250 80 L 265 80" />
              <path d="M 265 90 L 279 80 L 265 70 Z" fill="#fef2f2" />
              <circle cx="282" cy="80" r="2.5" fill="#fff" />
              <path d="M 285 80 L 310 80 L 310 60" />

              {/* Inverter 5: 11->10 */}
              <path d="M 190 60 L 190 80 L 205 80" />
              <path d="M 205 90 L 219 80 L 205 70 Z" fill="#fef2f2" />
              <circle cx="222" cy="80" r="2.5" fill="#fff" />
              <path d="M 225 80 L 220 80 L 220 60" />

              {/* Inverter 6: 13->12 */}
              <path d="M 130 60 L 130 80 L 145 80" />
              <path d="M 145 90 L 159 80 L 145 70 Z" fill="#fef2f2" />
              <circle cx="162" cy="80" r="2.5" fill="#fff" />
              <path d="M 165 80 L 160 80 L 160 60" />
            </g>
          )}

          {/* 7483 4-Bit Binary Full Adder (Exact Diagram 4!) */}
          {ic.id === '7483' && (
            <g stroke="#1e293b" strokeWidth="1.5" fill="none">
              {/* Internal Full Adder Block */}
              <rect
                x="140"
                y="100"
                width="340"
                height="100"
                fill="#f0fdf4"
                stroke="#15803d"
                strokeWidth="2"
                rx="6"
              />
              <text
                x="310"
                y="135"
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#166534"
              >
                4-BIT BINARY FULL ADDER WITH LOOKAHEAD CARRY
              </text>
              <text
                x="310"
                y="155"
                textAnchor="middle"
                fontSize="11"
                fontWeight="semibold"
                fill="#4b5563"
              >
                Sum = (A3..A0) + (B3..B0) + CIN =&gt; (COUT, S3..S0)
              </text>

              {/* Top Diagram Pins routing to Adder */}
              {/* Pin 1 (A3), Pin 3 (A2), Pin 8 (A1), Pin 10 (A0) */}
              {/* Pin 16 (B3), Pin 4 (B2), Pin 7 (B1), Pin 11 (B0) */}
              {/* Pin 13 (CIN), Pin 14 (COUT), Pin 15 (S3), Pin 2 (S2), Pin 6 (S1), Pin 9 (S0) */}
              <path d="M 100 240 L 100 190 L 160 190 L 160 200" stroke="#2563eb" />
              <path d="M 130 240 L 130 200" stroke="#16a34a" />
              <path d="M 160 240 L 160 200" stroke="#2563eb" />
              <path d="M 190 240 L 190 200" stroke="#2563eb" />
              <path d="M 220 240 L 220 200" stroke="#dc2626" />
              <path d="M 250 240 L 250 200" stroke="#16a34a" />
              <path d="M 280 240 L 280 200" stroke="#2563eb" />
              <path d="M 310 240 L 310 200" stroke="#2563eb" />
            </g>
          )}

          {/* 74153 Dual 4-to-1 Multiplexer (Exact Diagram 5!) */}
          {ic.id === '74153' && (
            <g stroke="#1e293b" strokeWidth="1.5" fill="none">
              {/* Mux 1 Box */}
              <rect
                x="110"
                y="110"
                width="180"
                height="90"
                fill="#eff6ff"
                stroke="#2563eb"
                strokeWidth="1.8"
                rx="4"
              />
              <text
                x="200"
                y="140"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#1e40af"
              >
                MULTIPLEXER 1
              </text>
              <text
                x="200"
                y="160"
                textAnchor="middle"
                fontSize="10"
                fontWeight="semibold"
                fill="#64748b"
              >
                1C0..1C3, 1G̅ =&gt; 1Y
              </text>

              {/* Mux 2 Box */}
              <rect
                x="330"
                y="110"
                width="180"
                height="90"
                fill="#eff6ff"
                stroke="#2563eb"
                strokeWidth="1.8"
                rx="4"
              />
              <text
                x="420"
                y="140"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#1e40af"
              >
                MULTIPLEXER 2
              </text>
              <text
                x="420"
                y="160"
                textAnchor="middle"
                fontSize="10"
                fontWeight="semibold"
                fill="#64748b"
              >
                2C0..2C3, 2G̅ =&gt; 2Y
              </text>
            </g>
          )}

          {/* 74151 8-Line to 1-Line Multiplexer */}
          {ic.id === '74151' && (
            <g stroke="#1e293b" strokeWidth="1.5" fill="none">
              <rect
                x="140"
                y="95"
                width="340"
                height="110"
                fill="#eff6ff"
                stroke="#2563eb"
                strokeWidth="2"
                rx="6"
              />
              <text
                x="310"
                y="130"
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#1e40af"
              >
                8-LINE TO 1-LINE DATA SELECTOR / MULTIPLEXER
              </text>
              <text
                x="310"
                y="152"
                textAnchor="middle"
                fontSize="11"
                fontWeight="semibold"
                fill="#475569"
              >
                Inputs: D0..D7 | Select: A, B, C | Enable: G̅ =&gt; True Y, Inverted W
              </text>
            </g>
          )}

          {/* 7476 Dual J-K Flip-Flop with Preset & Clear */}
          {ic.id === '7476' && (
            <g stroke="#1e293b" strokeWidth="1.5" fill="none">
              {/* FF 1 Box */}
              <rect
                x="110"
                y="100"
                width="180"
                height="100"
                fill="#faf5ff"
                stroke="#7c3aed"
                strokeWidth="1.8"
                rx="4"
              />
              <text
                x="200"
                y="135"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#6b21a8"
              >
                J-K FLIP-FLOP 1
              </text>
              <text
                x="200"
                y="155"
                textAnchor="middle"
                fontSize="10"
                fontWeight="semibold"
                fill="#64748b"
              >
                1J, 1K, 1CLK, 1PRE̅, 1CLR̅ =&gt; 1Q, 1Q̅
              </text>

              {/* FF 2 Box */}
              <rect
                x="330"
                y="100"
                width="180"
                height="100"
                fill="#faf5ff"
                stroke="#7c3aed"
                strokeWidth="1.8"
                rx="4"
              />
              <text
                x="420"
                y="135"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#6b21a8"
              >
                J-K FLIP-FLOP 2
              </text>
              <text
                x="420"
                y="155"
                textAnchor="middle"
                fontSize="10"
                fontWeight="semibold"
                fill="#64748b"
              >
                2J, 2K, 2CLK, 2PRE̅, 2CLR̅ =&gt; 2Q, 2Q̅
              </text>
            </g>
          )}

          {/* 7490 BCD Decade Counter */}
          {ic.id === '7490' && (
            <g stroke="#1e293b" strokeWidth="1.5" fill="none">
              <rect
                x="120"
                y="95"
                width="320"
                height="110"
                fill="#f0fdfa"
                stroke="#0d9488"
                strokeWidth="2"
                rx="6"
              />
              <text
                x="280"
                y="130"
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#115e59"
              >
                DECADE AND BCD COUNTER (4-BIT ASYNCHRONOUS)
              </text>
              <text
                x="280"
                y="152"
                textAnchor="middle"
                fontSize="11"
                fontWeight="semibold"
                fill="#475569"
              >
                Stage A: ÷2 (CKA → QA) | Stage BCD: ÷5 (CKB → QB, QC, QD) | R0(1..2), R9(1..2)
              </text>
            </g>
          )}
        </svg>

        <div className="mt-2 text-xs font-semibold text-slate-500 text-center">
          Exact Hardware Pinout &amp; Logic Diagram • Manufactured per TTL 74-Series Specification
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col text-slate-100 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="text-xl">📐</span>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>IC Pinout &amp; Internal Schematic Viewer</span>
                {activeSocketId && (
                  <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded">
                    Active Socket: {activeSocketId}
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400">
                Official Pinout, Internal Gates &amp; Electrical Logic Diagrams
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold cursor-pointer transition-colors w-8 h-8 flex items-center justify-center rounded hover:bg-slate-800"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* IC Quick Selector Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 mr-1">Select IC:</span>
            {Object.keys(IC_DEFINITIONS).map(id => (
              <button
                key={id}
                onClick={() => setSelectedIcId(id)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold cursor-pointer transition-all ${
                  selectedIcId === id
                    ? 'bg-blue-600 text-white shadow-md border border-blue-400 scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          {/* Active IC Info Header */}
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-mono font-black text-amber-400">{ic.id}</span>
                <span className="text-xs font-bold text-white">— {ic.name}</span>
                <span className="text-[10px] font-bold bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                  {ic.package}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{ic.description}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold block text-red-400">VCC Pin: {ic.vccPin}</span>
              <span className="text-[10px] font-bold block text-emerald-400">GND Pin: {ic.gndPin}</span>
              <span className="text-[10px] font-semibold text-slate-400 block">{ic.pins} Pins DIP</span>
            </div>
          </div>

          {/* Graphical Schematic Diagram */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🔍</span> Pin Assignment &amp; Internal Gate Schematic (Diagram Reference)
            </h3>
            {renderSchematicSvg()}
          </div>

          {/* Pin Function Reference Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>📋</span> Pin-by-Pin Electrical Specification
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-700">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-200 text-[11px] uppercase tracking-wider border-b border-slate-700 font-bold">
                  <tr>
                    <th className="py-2 px-3">Pin #</th>
                    <th className="py-2 px-3">Symbol / Name</th>
                    <th className="py-2 px-3">Direction</th>
                    <th className="py-2 px-4">Functional Description</th>
                    {livePinValues && <th className="py-2 px-3">Live State</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {Array.from({ length: ic.pins }, (_, i) => i + 1).map(p => {
                    const info = ic.pinout[p];
                    const isVcc = p === ic.vccPin;
                    const isGnd = p === ic.gndPin;
                    return (
                      <tr
                        key={p}
                        className={
                          isVcc
                            ? 'bg-red-950/20'
                            : isGnd
                            ? 'bg-emerald-950/20'
                            : 'hover:bg-slate-800/40'
                        }
                      >
                        <td className="py-2 px-3 font-mono font-bold text-slate-400">{p}</td>
                        <td
                          className={`py-2 px-3 font-mono font-extrabold ${
                            isVcc
                              ? 'text-red-400'
                              : isGnd
                              ? 'text-emerald-400'
                              : info?.type === 'out'
                              ? 'text-blue-400'
                              : info?.type === 'clk'
                              ? 'text-amber-400'
                              : 'text-slate-200'
                          }`}
                        >
                          {info ? info.name : 'NC'}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isVcc
                                ? 'bg-red-900/60 text-red-200'
                                : isGnd
                                ? 'bg-emerald-900/60 text-emerald-200'
                                : info?.type === 'out'
                                ? 'bg-blue-900/60 text-blue-200'
                                : info?.type === 'in'
                                ? 'bg-slate-700 text-slate-200'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isVcc ? 'PWR (+5V)' : isGnd ? 'GND (0V)' : info?.type?.toUpperCase() || 'NC'}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-slate-300">{info?.desc || 'Not Connected'}</td>
                        {livePinValues && <td className="py-2 px-3">{renderLiveBadge(p)}</td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer with Developer Attribution */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>
            DLCO Virtual IC Trainer Kit • Exact Pin Diagrams &amp; Electrical Architecture
          </span>
          <span className="font-semibold text-slate-300">
            Designed &amp; Developed by Pavan Kande — KBTCOE, Information Technology
          </span>
        </div>
      </div>
    </div>
  );
};
