import React from 'react';

interface PowerSwitchProps {
  mainsPower: boolean;
  onTogglePower: () => void;
}

export const PowerSwitch: React.FC<PowerSwitchProps> = ({ mainsPower, onTogglePower }) => {
  return (
    <div className="panel-section power-switch-section min-w-[100px] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex justify-between w-8 text-[9px] font-extrabold text-slate-700 tracking-wider">
          <span className={mainsPower ? 'text-red-700' : 'text-slate-400'}>ON</span>
          <span className={!mainsPower ? 'text-slate-900' : 'text-slate-400'}>OFF</span>
        </div>
        <div
          id="mainsPowerSwitch"
          onClick={onTogglePower}
          className={`rocker-switch ${mainsPower ? 'on' : 'off'}`}
          title="Toggle Main Trainer Power"
        >
          <div className="rocker-handle" />
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <div id="mainsPowerLed" className={`lamp lamp-power ${mainsPower ? 'on' : ''}`} />
          <span className="text-[10px] font-extrabold text-slate-800 tracking-wider">POWER</span>
        </div>
      </div>
    </div>
  );
};
