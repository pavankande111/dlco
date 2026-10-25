import React, { useState } from 'react';
import { EXPERIMENTS } from '../data/experiments';

interface ExperimentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSetupIcs: (expId: string) => void;
  onAutoWire: (expId: string) => void;
  onVerify: (expId: string) => void;
  verifyResult: { pass: boolean; msg: string } | null;
}

export const ExperimentDrawer: React.FC<ExperimentDrawerProps> = ({
  isOpen,
  onClose,
  onSetupIcs,
  onAutoWire,
  onVerify,
  verifyResult
}) => {
  const [selectedExpId, setSelectedExpId] = useState<string>('exp1');
  const exp = EXPERIMENTS[selectedExpId] || EXPERIMENTS['exp1'];

  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col text-slate-100 animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="flex items-start justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>📖</span> DLCO Laboratory Practicals &amp; Viva Voce
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Curriculum reference guides, wiring schematics, truth tables, and viva answers
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer transition-colors w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800"
        >
          &times;
        </button>
      </div>

      {/* Drawer Content */}
      <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
        {/* Dropdown & Actions */}
        <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 flex flex-col gap-3">
          <div>
            <label htmlFor="practicalSelect" className="block text-xs font-bold text-slate-300 mb-1.5">
              Select Practical / Experiment:
            </label>
            <select
              id="practicalSelect"
              value={selectedExpId}
              onChange={e => setSelectedExpId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded px-2.5 py-1.5 text-xs text-slate-100 font-medium cursor-pointer focus:outline-none"
            >
              <optgroup label="Combinational Logic Practicals">
                <option value="exp1">1. Full Adder (Sum &amp; Carry using XOR, AND, OR)</option>
                <option value="exp2">2. Full Subtractor (Difference &amp; Borrow)</option>
                <option value="exp3">3. 3-bit Binary to Gray Code Converter</option>
                <option value="exp4">4. 4-bit Binary to Gray Code Converter</option>
                <option value="exp5">5. 1-bit Magnitude Comparator (A&gt;B, A=B, A&lt;B)</option>
                <option value="exp6">6. Even Parity Generator and Checker</option>
                <option value="exp7">7. Odd Parity Generator and Checker</option>
                <option value="exp8">8. 8-to-1 Multiplexer Verification (IC 74151)</option>
                <option value="exp9">9. Boolean Function: F(A,B,C) = Σm(0,3,5,6) via 74151</option>
                <option value="exp10">10. Boolean Function: F(A,B,C,D) = Σm(1,2,4,7,8,10,11,13,15) via 74151</option>
                <option value="exp20">20. Dual 4-to-1 Multiplexer Verification (IC 74153)</option>
              </optgroup>
              <optgroup label="Sequential Logic &amp; Counter Practicals">
                <option value="exp11">11. 2-bit Asynchronous Ripple Up Counter (IC 7476)</option>
                <option value="exp12">12. 3-bit Asynchronous Ripple Up Counter (IC 7476)</option>
                <option value="exp13">13. 4-bit Asynchronous Ripple Up Counter (IC 7476)</option>
                <option value="exp14">14. 2-bit Asynchronous Ripple Down Counter (IC 7476)</option>
                <option value="exp15">15. 3-bit Asynchronous Ripple Down Counter (IC 7476)</option>
                <option value="exp16">16. 4-bit Asynchronous Ripple Down Counter (IC 7476)</option>
                <option value="exp17">17. 2-bit Asynchronous Ripple Up-Down Counter</option>
                <option value="exp18">18. 4-bit Asynchronous Ripple Up-Down Counter</option>
                <option value="exp19">19. MOD-N Decade &amp; Modulo Counter using IC 7490</option>
              </optgroup>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => onSetupIcs(selectedExpId)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-2 rounded cursor-pointer transition-colors shadow text-center"
              title="Insert required ICs into sockets for this practical"
            >
              ⚡ Setup ICs
            </button>
            <button
              onClick={() => onAutoWire(selectedExpId)}
              className="bg-slate-700 hover:bg-slate-600 text-slate-100 text-[11px] font-bold py-1.5 px-2 rounded border border-slate-600 cursor-pointer transition-colors shadow text-center"
              title="Load complete reference wiring on the board for testing"
            >
              🔌 Auto-Wire
            </button>
            <button
              onClick={() => onVerify(selectedExpId)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 px-2 rounded cursor-pointer transition-colors shadow text-center"
              title="Test user circuit against expected truth table"
            >
              ✓ Verify Circuit
            </button>
          </div>
        </div>

        {/* Verification Result Banner */}
        {verifyResult && (
          <div
            className={`p-3 rounded-lg border text-xs font-medium leading-relaxed ${
              verifyResult.pass
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                : 'bg-rose-950/80 border-rose-600 text-rose-200'
            }`}
          >
            <strong className="font-bold mr-1">
              {verifyResult.pass ? '✓ TEST PASSED:' : '⚠ VERIFICATION FAILED:'}
            </strong>
            {verifyResult.msg}
          </div>
        )}

        {/* 1. Aim */}
        <div className="bg-slate-800/40 p-4 rounded border border-slate-800">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">1. Aim</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{exp.aim}</p>
        </div>

        {/* 2. Components */}
        <div className="bg-slate-800/40 p-4 rounded border border-slate-800">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
            2. Components &amp; ICs Required
          </h3>
          <div className="text-xs text-slate-300 flex flex-col gap-1">
            <div>
              <strong className="text-slate-100">ICs:</strong> {exp.requiredIcs.join(', ')}
            </div>
            <div>
              <strong className="text-slate-100">Inputs:</strong> {exp.inputsDesc}
            </div>
            <div>
              <strong className="text-slate-100">Outputs:</strong> {exp.outputsDesc}
            </div>
          </div>
        </div>

        {/* 3. Step-by-Step Guide */}
        <div className="bg-slate-800/40 p-4 rounded border border-slate-800">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            3. Step-by-Step Circuit Building Guide
          </h3>
          <ol className="text-xs text-slate-300 flex flex-col gap-2 list-decimal pl-4 leading-relaxed">
            {exp.instructions.map((inst, idx) => (
              <li key={idx}>{inst}</li>
            ))}
          </ol>
        </div>

        {/* 4. Truth Table */}
        <div className="bg-slate-800/40 p-4 rounded border border-slate-800">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            4. Expected Truth Table / State Sequence
          </h3>
          <div className="overflow-x-auto rounded border border-slate-700">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-300 border-b border-slate-700">
                  {Object.keys(exp.truthTable[0] || {}).map(k => (
                    <th key={k} className="px-3 py-1.5 font-bold">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                {exp.truthTable.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/50">
                    {Object.values(row).map((v, cIdx) => (
                      <td key={cIdx} className="px-3 py-1 text-slate-300">
                        {String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Viva Voce */}
        <div className="bg-slate-800/40 p-4 rounded border border-slate-800">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5">
            5. Lab Viva Voce Questions &amp; Answers
          </h3>
          <div className="flex flex-col gap-3">
            {exp.viva.map((v, idx) => (
              <div key={idx} className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <div className="text-xs font-bold text-sky-400 mb-1">Q: {v.q}</div>
                <div className="text-xs text-slate-300 leading-relaxed">A: {v.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Drawer Footer Attribution */}
        <div className="text-[11px] text-slate-400 text-center py-3 border-t border-slate-800">
          DLCO Virtual Lab Practicals • Designed &amp; Developed by <span className="font-semibold text-slate-200">Pavan Kande — KBTCOE, Information Technology</span>
        </div>
      </div>
    </aside>
  );
};
