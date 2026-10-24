import React, { useState } from 'react';
import { Download, Printer, Copy, Check, Edit3, Eye, FileDown, Mail } from 'lucide-react';
import { DisputeAppealResult } from '../types/claim';
import { downloadAppealPdf } from '../utils/pdfGenerator';

interface AppealLetterStudioProps {
  appeal: DisputeAppealResult;
  onUpdateLetter: (updated: string) => void;
  onOpenPortal: () => void;
  onOpenGmailModal?: () => void;
  hasDispatchedGmail?: boolean;
}

export const AppealLetterStudio: React.FC<AppealLetterStudioProps> = ({
  appeal,
  onUpdateLetter,
  onOpenPortal,
  onOpenGmailModal,
  hasDispatchedGmail = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(appeal.appeal_letter_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      downloadAppealPdf(appeal);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };


  // Basic markdown renderer for preview
  const renderFormattedLetter = (markdown: string) => {
    const lines = markdown.split('\n');
    return (
      <div className="space-y-3 font-serif text-slate-800 leading-relaxed text-sm">
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-lg font-sans font-bold tracking-tight text-slate-950 pb-2 border-b border-slate-200">
                {line.replace('# ', '')}
              </h1>
            );
          }
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-sm font-sans font-semibold text-slate-900 pt-2 text-blue-900">
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('---')) {
            return <hr key={idx} className="border-slate-200 my-2" />;
          }
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <p key={idx} className="font-semibold font-sans text-slate-900">
                {line.replace(/\*\*/g, '')}
              </p>
            );
          }
          if (line.trim().length === 0) {
            return <div key={idx} className="h-1.5" />;
          }

          // Inline bold formatting
          const formatted = line.split(/(\*\*[^*]+\*\*)/g).map((chunk, cIdx) => {
            if (chunk.startsWith('**') && chunk.endsWith('**')) {
              return (
                <strong key={cIdx} className="font-semibold text-slate-950 font-sans">
                  {chunk.slice(2, -2)}
                </strong>
              );
            }
            return chunk;
          });

          return (
            <p key={idx} className="text-slate-700">
              {formatted}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Dispute Appeal Letter Studio
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium border border-blue-100">
              {appeal.appeal_strategy}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Citing exact policy provisions, regulatory exceptions, and prompt-payment statutes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Send via Gmail Button */}
          {onOpenGmailModal && (
            <button
              onClick={onOpenGmailModal}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer ${
                hasDispatchedGmail
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title="Dynamically and autonomously send appeal letter with attached PDF via Gmail"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{hasDispatchedGmail ? 'Gmail Sent (Options)' : 'Send via Gmail'}</span>
            </button>
          )}

          {/* Download as PDF Button (jsPDF) */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors shadow-xs cursor-pointer"
            title="Generate and download professional PDF using jsPDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download as PDF'}</span>
          </button>

          {/* Native Print / Browser Print Dialog */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Print directly to physical printer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {/* Copy Text */}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Copy letter Markdown text to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          {/* Inline Edit Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Preview Letter' : 'Edit Text'}</span>
          </button>

          {/* Auto-fill Portal action */}
          <button
            onClick={onOpenPortal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Auto-Fill Portal</span>
          </button>
        </div>

      </div>

      {/* Governing Violated Clauses Strip */}
      {appeal.violated_clauses && appeal.violated_clauses.length > 0 && (
        <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/70 space-y-2 print:hidden">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            Contract Clauses Supporting Reversal
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            {appeal.violated_clauses.map((clause, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 bg-white rounded-lg border border-blue-100 text-xs text-slate-800"
              >
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  {idx + 1}
                </div>
                <span className="font-medium">{clause}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Letter Display / Editor */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isEditing ? (
          <div className="p-5 space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Edit Formal Appeal Notice (Markdown Supported)
            </label>
            <textarea
              rows={22}
              value={appeal.appeal_letter_markdown}
              onChange={(e) => onUpdateLetter(e.target.value)}
              className="w-full font-mono text-xs p-4 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white resize-y leading-relaxed"
            />
          </div>
        ) : (
          <div className="p-8 md:p-12 max-w-4xl mx-auto bg-white" id="appeal-letter-printable">
            {renderFormattedLetter(appeal.appeal_letter_markdown)}
          </div>
        )}
      </div>
    </div>
  );
};
