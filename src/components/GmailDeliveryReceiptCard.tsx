import React from 'react';
import { MailCheck, Paperclip, Clock, ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';
import { GmailDispatchReceipt } from '../types/claim';

interface GmailDeliveryReceiptCardProps {
  receipt: GmailDispatchReceipt;
  onResend: () => void;
}

export const GmailDeliveryReceiptCard: React.FC<GmailDeliveryReceiptCardProps> = ({
  receipt,
  onResend,
}) => {
  return (
    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <MailCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <span>Dispute Appeal Transmitted via Gmail API</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-mono font-semibold">
                DELIVERED
              </span>
            </h4>
            <p className="text-[11px] text-emerald-700">
              Dispatched directly to {receipt.recipient} with signed PDF attachment
            </p>
          </div>
        </div>

        <button
          onClick={onResend}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-200 rounded-md transition-colors cursor-pointer self-start sm:self-center"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Dispatch Options</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
        <div className="p-2.5 bg-white rounded-lg border border-emerald-100 space-y-0.5">
          <span className="text-[10px] text-slate-500 font-medium block">Gmail Message ID</span>
          <span className="font-mono text-slate-900 font-semibold truncate block">
            {receipt.messageId}
          </span>
        </div>

        <div className="p-2.5 bg-white rounded-lg border border-emerald-100 space-y-0.5">
          <span className="text-[10px] text-slate-500 font-medium block">Transmitted Exhibit</span>
          <span className="text-blue-700 font-medium flex items-center gap-1 truncate">
            <Paperclip className="w-3 h-3 shrink-0" />
            <span className="truncate">{receipt.attachmentName}</span>
          </span>
        </div>

        <div className="p-2.5 bg-white rounded-lg border border-emerald-100 space-y-0.5">
          <span className="text-[10px] text-slate-500 font-medium block">Statutory 30-Day Window</span>
          <span className="text-amber-800 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 shrink-0 text-amber-600" />
            <span>Determination Clock Active</span>
          </span>
        </div>
      </div>
    </div>
  );
};
