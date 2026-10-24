import React, { useState } from 'react';
import { CheckSquare, Square, Calendar, AlertTriangle, Plus, Trash2 } from 'lucide-react';

interface EvidenceChecklistProps {
  requiredDocs: string[];
  claimId: string;
}

export const EvidenceChecklist: React.FC<EvidenceChecklistProps> = ({
  requiredDocs,
  claimId,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newDocText, setNewDocText] = useState('');

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDocText.trim()) {
      setCustomItems((prev) => [...prev, newDocText.trim()]);
      setNewDocText('');
    }
  };

  const removeCustom = (index: number) => {
    setCustomItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalItems = requiredDocs.length + customItems.length;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Required Supporting Documentation Checklist
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Attach these verified exhibits with your formal appeal packet for Claim #{claimId}.
          </p>
        </div>

        {/* Readiness Meter */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-800">
              {completedCount} of {totalItems} Ready
            </span>
            <p className="text-[10px] text-slate-400">Packet Completeness</p>
          </div>
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Submission Deadline Card */}
      <div className="flex items-start gap-3 p-4 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs text-amber-900">
        <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">
            Statutory Filing Deadline: 180 Calendar Days
          </p>
          <p className="text-amber-800 leading-relaxed">
            Under ERISA 29 C.F.R. § 2560.503-1 and state insurance codes, your complete First-Level Appeal packet must be postmarked or submitted via electronic portal within 180 days of the EOB denial date.
          </p>
        </div>
      </div>

      {/* Required Docs List */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Required Mandatory Exhibits
        </span>

        <div className="space-y-2">
          {requiredDocs.map((doc, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                    : 'bg-slate-50/80 border-slate-200 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div className="mt-0.5 text-blue-600 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 text-xs">
                  <p className={`font-medium ${isChecked ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {doc}
                  </p>
                </div>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-slate-200/70 text-slate-600 rounded">
                  Exhibit {String.fromCharCode(65 + idx)}
                </span>
              </div>
            );
          })}

          {/* Custom added docs */}
          {customItems.map((item, idx) => {
            const keyIndex = requiredDocs.length + idx;
            const isChecked = !!checkedItems[keyIndex];
            return (
              <div
                key={keyIndex}
                className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all ${
                  isChecked
                    ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                    : 'bg-slate-50/80 border-slate-200 text-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleCheck(keyIndex)}
                  className="mt-0.5 text-blue-600 shrink-0"
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                <div className="flex-1 text-xs">
                  <p className={`font-medium ${isChecked ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {item}
                  </p>
                </div>
                <button
                  onClick={() => removeCustom(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                  title="Remove exhibit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddCustom} className="flex gap-2 pt-2">
        <input
          type="text"
          value={newDocText}
          onChange={(e) => setNewDocText(e.target.value)}
          placeholder="Add additional custom exhibit (e.g., Physical therapy notes, MRI CD)..."
          className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Exhibit</span>
        </button>
      </form>
    </div>
  );
};
