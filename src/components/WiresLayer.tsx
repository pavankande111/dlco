import React, { useEffect, useState, useCallback } from 'react';
import { Wire } from '../types';

interface WiresLayerProps {
  wires: Wire[];
  selectedWireId: number | null;
  onSelectWire: (wireId: number) => void;
  boardRef: React.RefObject<HTMLDivElement | null>;
  zoom: number;
}

interface Point {
  x: number;
  y: number;
}

export const WiresLayer: React.FC<WiresLayerProps> = ({
  wires,
  selectedWireId,
  onSelectWire,
  boardRef,
  zoom
}) => {
  const [, setTick] = useState(0);

  const getTerminalCenter = useCallback(
    (tid: string): Point | null => {
      if (!boardRef.current) return null;
      const el = boardRef.current.querySelector(`[data-tid="${tid}"]`);
      if (!el) return null;

      const elRect = el.getBoundingClientRect();
      const boardRect = boardRef.current.getBoundingClientRect();
      const currentZoom = zoom || 1.0;

      return {
        x: (elRect.left + elRect.width / 2 - boardRect.left) / currentZoom,
        y: (elRect.top + elRect.height / 2 - boardRect.top) / currentZoom
      };
    },
    [boardRef, zoom]
  );

  // Update wire positions on resize or zoom
  useEffect(() => {
    const handleResize = () => setTick(t => t + 1);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <svg className="wires-canvas" style={{ width: '100%', height: '100%' }}>
      {wires.map(wire => {
        const ptA = getTerminalCenter(wire.from);
        const ptB = getTerminalCenter(wire.to);
        if (!ptA || !ptB) return null;

        // Calculate natural catenary/bezier sag for realistic patch wire appearance
        const dist = Math.hypot(ptB.x - ptA.x, ptB.y - ptA.y);
        const sag = Math.min(80, Math.max(30, dist * 0.15));
        const midX = (ptA.x + ptB.x) / 2;
        const midY = (ptA.y + ptB.y) / 2 + sag;

        const d = `M ${ptA.x.toFixed(1)} ${ptA.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${ptB.x.toFixed(1)} ${ptB.y.toFixed(1)}`;
        const isSelected = wire.id === selectedWireId;

        return (
          <g key={wire.id}>
            {/* Thicker transparent stroke for easier clicking */}
            <path
              d={d}
              stroke="transparent"
              strokeWidth="14"
              fill="none"
              className="cursor-pointer pointer-events-stroke"
              onClick={e => {
                e.stopPropagation();
                onSelectWire(wire.id);
              }}
            />
            {/* Visual wire path */}
            <path
              d={d}
              stroke={wire.color || '#2563eb'}
              strokeWidth={isSelected ? '6' : '4'}
              className={`wire-path ${isSelected ? 'selected' : ''}`}
              onClick={e => {
                e.stopPropagation();
                onSelectWire(wire.id);
              }}
            />
          </g>
        );
      })}
    </svg>
  );
};
