import React, { useState } from 'react';
import { Copy, Check, Send, CheckCircle2, ShieldCheck, Code, Globe, RotateCcw } from 'lucide-react';
import { ClaimFormPayload } from '../types/claim';

interface PortalSimulatorProps {
  payload: ClaimFormPayload;
}

export const PortalSimulator: React.FC<PortalSimulatorProps> = ({ payload }) => {
  const [isFilled, setIsFilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    submitted: boolean;
    trackingId: string;
    timestamp: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');
  const [copied, setCopied] = useState(false);

  // Form field state (initially empty or filled)
  const [formData, setFormData] = useState({
    patient_name: '',
    claim_id: '',
    policy_id: '',
    denied_amount: '',
    provider_name: '',
    dispute_category: '',
    primary_basis: '',
    grievance_tier: '',
  });

  const handleAutoFill = () => {
    setIsFilled(true);
    setFormData({
      patient_name: payload.patient_name,
      claim_id: payload.claim_id,
      policy_id: String(payload.form_fields.subscriber_policy_id || 'POL-8849201'),
      denied_amount: `$${Number(payload.denied_amount_inr).toFixed(2)}`,
      provider_name: payload.provider_name,
      dispute_category: String(payload.form_fields.dispute_category || 'EMERGENCY_OVERRIDE'),
      primary_basis: String(payload.form_fields.primary_dispute_basis || 'Prudent Layperson Standard Statutory Protection'),
      grievance_tier: String(payload.form_fields.grievance_tier || 'Level 1 Formal Dispute'),
    });
  };

  const handleResetForm = () => {
    setIsFilled(false);
    setSubmissionReceipt(null);
    setFormData({
      patient_name: '',
      claim_id: '',
      policy_id: '',
      denied_amount: '',
      provider_name: '',
      dispute_category: '',
      primary_basis: '',
      grievance_tier: '',
    });
  };

  const handleSubmitPortal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionReceipt({
        submitted: true,
        trackingId: `GRV-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleString(),
      });
    }, 1200);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Portal Top Bar */}
      <div className="bg-slate-900 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">
                National Payer Grievance & Dispute Portal
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-900/60 text-blue-300 rounded border border-blue-800">
                Simulator
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Electronic Grievance Intake API Gateway · ISO 27001 Compliant
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'form' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Web Form UI
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'json' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw Payload JSON
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'form' ? (
        <div className="p-6 space-y-6">
          {/* Simulation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/60">
            <div className="flex items-center gap-2 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                Demonstrates how <code className="font-mono font-bold text-blue-800">export_claim_form_payload</code> automatically populates electronic insurer dispute fields.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isFilled && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleAutoFill}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <span>⚡ Auto-Fill With Claim Payload</span>
              </button>
            </div>
          </div>

          {/* Submission Success Banner */}
          {submissionReceipt && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Formal Grievance Successfully Lodged With Payer</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-emerald-950 pt-2 font-mono">
                <div>
                  <span className="text-emerald-700 block text-[11px]">Portal Tracking Number:</span>
                  <span className="font-bold">{submissionReceipt.trackingId}</span>
                </div>
                <div>
                  <span className="text-emerald-700 block text-[11px]">Electronic Timestamp:</span>
                  <span>{submissionReceipt.timestamp}</span>
                </div>
                <div>
                  <span className="text-emerald-700 block text-[11px]">Statutory SLA Window:</span>
                  <span>30 Days (Prompt Pay Mandate)</span>
                </div>
              </div>
            </div>
          )}

          {/* Grievance Form */}
          <form onSubmit={handleSubmitPortal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Aggrieved Patient / Policyholder
                </label>
                <input
                  type="text"
                  required
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  placeholder="e.g., Eleanor Vance"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subscriber Policy ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.policy_id}
                  onChange={(e) => setFormData({ ...formData, policy_id: e.target.value })}
                  placeholder="e.g., AHM-8849201-02"
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Claim Reference Number (Denial Tracking)
                </label>
                <input
                  type="text"
                  required
                  value={formData.claim_id}
                  onChange={(e) => setFormData({ ...formData, claim_id: e.target.value })}
                  placeholder="e.g., CLM-2026-99412"
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Disputed Rejection Amount
                </label>
                <input
                  type="text"
                  required
                  value={formData.denied_amount}
                  onChange={(e) => setFormData({ ...formData, denied_amount: e.target.value })}
                  placeholder="e.g., $4,280.00"
                  className="w-full text-xs font-mono tabular-nums bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rendering Provider / Facility
                </label>
                <input
                  type="text"
                  required
                  value={formData.provider_name}
                  onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                  placeholder="e.g., St. Jude Trauma & Acute Care Center"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dispute Strategy Classification
                </label>
                <input
                  type="text"
                  required
                  value={formData.dispute_category}
                  onChange={(e) => setFormData({ ...formData, dispute_category: e.target.value })}
                  placeholder="e.g., OUT_OF_NETWORK_EXCEPTION"
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Contractual & Statutory Legal Grounds
              </label>
              <textarea
                rows={2}
                required
                value={formData.primary_basis}
                onChange={(e) => setFormData({ ...formData, primary_basis: e.target.value })}
                placeholder="Contract provisions and statutes supporting appeal..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !formData.claim_id}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  isSubmitting || !formData.claim_id
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Transmitting to Gateway...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmit Formal Dispute to Insurer</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Raw JSON Inspector */
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Structured JSON Payload (<code className="text-blue-600">export_claim_form_payload</code> schema)
            </span>
            <button
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-96">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
