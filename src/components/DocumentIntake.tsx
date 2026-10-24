import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';
import { PresetScenario } from '../types/claim';

interface DocumentIntakeProps {
  presets: PresetScenario[];
  selectedPresetId: string;
  onSelectPreset: (preset: PresetScenario) => void;
  denialText: string;
  setDenialText: (text: string) => void;
  policyText: string;
  setPolicyText: (text: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  denialFileName: string;
  policyFileName: string;
  onFileUpload: (file: File, type: 'denial' | 'policy') => void;
}

export const DocumentIntake: React.FC<DocumentIntakeProps> = ({
  presets,
  selectedPresetId,
  onSelectPreset,
  denialText,
  setDenialText,
  policyText,
  setPolicyText,
  onAnalyze,
  isAnalyzing,
  denialFileName,
  policyFileName,
  onFileUpload,
}) => {
  const [showRawText, setShowRawText] = useState(false);
  const denialInputRef = useRef<HTMLInputElement>(null);
  const policyInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: 'denial' | 'policy') => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0], type);
    }
  };

  const hasDenial = Boolean(denialFileName || denialText.trim());
  const hasPolicy = Boolean(policyFileName || policyText.trim());
  const isReady = hasDenial && hasPolicy;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Step 1: Document Ingestion
          </span>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            Drop Claim Denial & Policy Documents
          </h2>
        </div>

        {/* 1-Click Preset Scenario Loader */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Quick Test:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {presets.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.badge} ({preset.denial_code})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dual Document Upload Dropzones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Dropzone 1: Claim Denial Document */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>1. Claim Denial Notice (PDF / Image)</span>
            </label>
            {hasDenial && (
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Attached
              </span>
            )}
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'denial')}
            onClick={() => denialInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
              hasDenial
                ? 'border-emerald-300 bg-emerald-50/20'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/60'
            }`}
          >
            <input
              type="file"
              ref={denialInputRef}
              onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0], 'denial')}
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              className="hidden"
            />
            <UploadCloud className={`w-8 h-8 mb-2 ${hasDenial ? 'text-emerald-500' : 'text-slate-400'}`} />
            <p className="text-xs font-semibold text-slate-800">
              {denialFileName || 'Drop Claim Denial Document (PDF/Image)'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {hasDenial ? 'Click to replace document' : 'or click to browse from device'}
            </p>
          </div>
        </div>

        {/* Dropzone 2: Policy Terms Document */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>2. Policy Terms Document (PDF / Image)</span>
            </label>
            {hasPolicy && (
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Attached
              </span>
            )}
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'policy')}
            onClick={() => policyInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
              hasPolicy
                ? 'border-emerald-300 bg-emerald-50/20'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/60'
            }`}
          >
            <input
              type="file"
              ref={policyInputRef}
              onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0], 'policy')}
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              className="hidden"
            />
            <UploadCloud className={`w-8 h-8 mb-2 ${hasPolicy ? 'text-emerald-500' : 'text-slate-400'}`} />
            <p className="text-xs font-semibold text-slate-800">
              {policyFileName || 'Drop Policy Terms Document (PDF/Image)'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {hasPolicy ? 'Click to replace document' : 'or click to browse from device'}
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Raw Text Viewer for Advanced Custom Edits */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowRawText(!showRawText)}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <span>{showRawText ? 'Hide extracted text fields' : 'View or edit document text directly'}</span>
          {showRawText ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showRawText && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Denial Notice Text Snippet
              </label>
              <textarea
                rows={5}
                value={denialText}
                onChange={(e) => setDenialText(e.target.value)}
                placeholder="Denial text snippet..."
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Policy Contract Text Snippet
              </label>
              <textarea
                rows={5}
                value={policyText}
                onChange={(e) => setPolicyText(e.target.value)}
                placeholder="Policy text snippet..."
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Primary Execution CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-500">
          Cross-references denial reason against policy provisions using Checks A, B, and C.
        </div>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !isReady}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
            isAnalyzing || !isReady
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-md'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Cross-Referencing Policy Clauses...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Audit Documents & Generate Appeal</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
