import React from 'react';
import { ProcessingAuditLog } from '../types/claim';

interface AgentActivityLogProps {
  logs: ProcessingAuditLog[];
  isAnalyzing: boolean;
  grounds: {
    check_type: string;
    finding: string;
    supporting_clause: string;
  }[];
  activeStrategy?: string;
  denialCode?: string;
}

export const AgentActivityLog: React.FC<AgentActivityLogProps> = ({
  logs,
  isAnalyzing,
  grounds,
  activeStrategy,
  denialCode,
}) => {
  if (logs.length === 0 && !isAnalyzing) {
    return null;
  }

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-sm border border-slate-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Step 2: Agent Processing Log
          </span>
          <span className="text-xs text-slate-400">· Real-time Policy Audit</span>
        </div>
        {activeStrategy && (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
            Strategy: {activeStrategy}
          </span>
        )}
      </div>

      {/* Structured Terminal-Style Processing Log */}
      <div className="space-y-3 font-mono text-xs">
        {/* Step 1: Multimodal Vision OCR */}
        <div className="flex items-start gap-3">
          <span className="shrink-0 text-base">🔍</span>
          <div className="space-y-0.5">
            <p className="font-semibold text-slate-200">
              Parsing documents using Gemini Multimodal Vision...
            </p>
            {logs.find((l) => l.step === 'PARSE') && (
              <p className="text-[11px] text-slate-400">
                {logs.find((l) => l.step === 'PARSE')?.detail}
              </p>
            )}
          </div>
        </div>

        {/* Step 2: Policy Cross-Check */}
        <div className="flex items-start gap-3">
          <span className="shrink-0 text-base">⚖️</span>
          <div className="space-y-0.5">
            <p className="font-semibold text-slate-200">
              Cross-checking denial code '{denialCode || 'ERR-402'}' against Policy Provisions...
            </p>
            <p className="text-[11px] text-slate-400">
              Running Check A (Explicit Coverage), Check B (Procedural Paperwork Errors), and Check C (Ambiguity & Statutory Exceptions).
            </p>
          </div>
        </div>

        {/* Step 3: Grounds Identified */}
        {grounds.length > 0 ? (
          grounds.map((g, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-lg">
              <span className="shrink-0 text-base">💡</span>
              <div className="space-y-1">
                <p className="font-semibold text-emerald-300">
                  Ground identified: {g.supporting_clause}
                </p>
                <p className="text-[11px] text-emerald-200/90 leading-relaxed font-sans">
                  {g.finding}
                </p>
              </div>
            </div>
          ))
        ) : isAnalyzing ? (
          <div className="flex items-center gap-3 text-blue-400 p-2">
            <div className="w-3.5 h-3.5 border-2 border-blue-400/40 border-t-blue-400 rounded-full animate-spin shrink-0" />
            <span className="text-xs">Locating governing override clauses and statutory exception precedents...</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
