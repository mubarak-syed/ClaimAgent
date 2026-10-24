import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, AlertCircle, Send, Paperclip, ShieldCheck, UserCheck, LogOut, ArrowRight, Clock } from 'lucide-react';
import { User } from 'firebase/auth';
import { ClaimAnalysisResponse, DisputeAppealResult, GmailDispatchReceipt } from '../types/claim';
import {
  initAuth,
  googleSignIn,
  logout,
  sendDisputeViaGmail,
  generateAppealEmailHtml,
} from '../utils/gmailService';

interface GmailDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ClaimAnalysisResponse;
  appeal: DisputeAppealResult;
  onDispatchSuccess: (receipt: GmailDispatchReceipt) => void;
  autonomousMode: boolean;
  setAutonomousMode: (enabled: boolean) => void;
}

export const GmailDispatchModal: React.FC<GmailDispatchModalProps> = ({
  isOpen,
  onClose,
  analysis,
  appeal,
  onDispatchSuccess,
  autonomousMode,
  setAutonomousMode,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<GmailDispatchReceipt | null>(null);

  // Form fields
  const defaultRecipient =
    appeal.appeal_strategy === 'OUT_OF_NETWORK_EXCEPTION'
      ? 'appeals-grievances@apexhealth.com'
      : appeal.appeal_strategy === 'MEDICAL_NECESSITY'
      ? 'claims-appeals@deltadentaltrust.org'
      : 'priorauth-disputes@optumhealth.com';

  const [recipientEmail, setRecipientEmail] = useState<string>(defaultRecipient);
  const [subject, setSubject] = useState<string>(
    `FORMAL FIRST-LEVEL APPEAL: Claim #${appeal.claim_id} - ${analysis.extracted_entities.patient_name}`
  );
  const [customNote, setCustomNote] = useState<string>('');

  useEffect(() => {
    setRecipientEmail(defaultRecipient);
    setSubject(`FORMAL FIRST-LEVEL APPEAL: Claim #${appeal.claim_id} - ${analysis.extracted_entities.patient_name}`);
  }, [appeal.claim_id, appeal.appeal_strategy, analysis.extracted_entities.patient_name]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setHasToken(!!token);
      },
      () => {
        setCurrentUser(null);
        setHasToken(false);
      }
    );
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setSendError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setHasToken(true);
      }
    } catch (err: any) {
      setSendError(err.message || 'Failed to authenticate with Google');
    } finally {
      setIsSigningIn(false);
    }
  };


  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setHasToken(false);
  };

  const handleSendEmail = async () => {
    if (!hasToken) {
      setSendError('Please sign in with Google to grant email sending permissions.');
      return;
    }

    if (!recipientEmail || !recipientEmail.includes('@')) {
      setSendError('Please provide a valid recipient email address.');
      return;
    }

    setIsSending(true);
    setSendError(null);

    try {
      const htmlBody = generateAppealEmailHtml(analysis, appeal, customNote);
      const dispatchReceipt = await sendDisputeViaGmail({
        recipientEmail,
        subject,
        htmlBody,
        appeal,
      });

      setReceipt(dispatchReceipt);
      onDispatchSuccess(dispatchReceipt);
    } catch (err: any) {
      console.error('Send error:', err);
      setSendError(err.message || 'Failed to send appeal email via Gmail');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Autonomous Gmail Appeal Dispatch</h3>
              <p className="text-xs text-slate-300">
                Official dispute transmission via Gmail API with signed PDF attachment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer text-lg leading-none"
          >
            &times;
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Success Receipt View */}
          {receipt ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-950">
                    Appeal Dispatched Successfully via Gmail API!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    The formal dispute notice and complete legal PDF were transmitted to the insurer's grievance department.
                  </p>
                </div>
              </div>

              {/* Receipt Details */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Gmail Message ID</span>
                  <span className="font-mono text-slate-900 font-semibold">{receipt.messageId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Recipient Dept</span>
                  <span className="font-mono text-slate-900">{receipt.recipient}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Attached PDF</span>
                  <span className="text-blue-600 font-medium flex items-center gap-1">
                    <Paperclip className="w-3 h-3" />
                    {receipt.attachmentName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Dispatched Time</span>
                  <span className="text-slate-900">{new Date(receipt.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 pt-2 text-amber-800 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-[11px] font-medium leading-tight">
                    <strong>Statutory Clock Activated:</strong> Under 45 CFR § 147.136 & state prompt-pay law, the insurer has 30 days to issue a determination.
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Close & View Receipt
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Google Auth Status Bar */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                {currentUser && hasToken ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <span className="font-semibold text-slate-900 block">{currentUser.email}</span>
                        <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Gmail Send Scope Authorized
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md transition-colors cursor-pointer"
                      title="Disconnect Google Account"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">
                        Connect Google Account
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Sign in to dispatch appeals directly from your Gmail
                      </span>
                    </div>

                    {/* Official Sign in with Google Button Styled as per Google Branding Guidelines */}
                    <button
                      type="button"
                      onClick={handleSignIn}
                      disabled={isSigningIn}
                      className="inline-flex items-center justify-center gap-2.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg shadow-2xs hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                      <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Error Banner */}
              {sendError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              {/* Email Form */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Insurer Grievance Dept Email
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="appeals-department@insurer.com"
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                {/* Attached File Preview */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Attached Deliverable
                  </label>
                  <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-red-100 text-red-600 rounded-md flex items-center justify-center font-bold text-[10px]">
                        PDF
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          Appeal_Letter_Claim_{appeal.claim_id}.pdf
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Complete legal notice · Citing {appeal.violated_clauses?.length || 1} contract clauses
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-blue-700 font-semibold bg-blue-100/70 px-2 py-0.5 rounded">
                      Ready to Attach
                    </span>
                  </div>
                </div>

                {/* Autonomous Mode Toggle */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-900 block">
                      Autonomous Audit Dispatch
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Automatically stage appeal and prepare transmission on each audit
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autonomousMode}
                      onChange={(e) => setAutonomousMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Note Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Optional Policyholder Note
                  </label>
                  <textarea
                    rows={2}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Please note attending physician Dr. Mercer is available for peer-to-peer review."
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white resize-none"
                  />
                </div>
              </div>

              {/* Destructive Operation Confirmation & Send Action */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={isSending || !hasToken}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Transmitting via Gmail...' : 'Confirm & Send via Gmail'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
