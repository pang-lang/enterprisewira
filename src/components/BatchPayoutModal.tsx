import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Copy, 
  Download, 
  Building2, 
  X, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PayoutTransaction } from '../types';

interface BatchPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: PayoutTransaction;
  onViewDashboard?: () => void;
}

export const BatchPayoutModal: React.FC<BatchPayoutModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onViewDashboard,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const tx = transaction || {
    id: 'tx-10023',
    referenceId: 'WIRA-PAY-88293',
    totalAmount: 12342.00,
    workerCount: 11,
    bankAccount: 'HSBC Enterprise (**** 8822)',
    authorizedTime: 'Today, 10:42 AM',
    status: 'Authorized',
    eventName: 'Samsung Product Launch (Pre-event & Setup Roster)'
  };

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#10b981', '#3b82f6']
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyReference = () => {
    navigator.clipboard.writeText(tx.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `=====================================================
WIRA MARKETPLACE ENTERPRISE - BATCH PAYOUT RECEIPT
=====================================================
Reference ID:     ${tx.referenceId}
Transaction Date: ${tx.authorizedTime}
Event Scope:      ${tx.eventName}
Source Account:   ${tx.bankAccount}
Total Disbursed:  RM ${tx.totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
Total Workforce:  ${tx.workerCount} Verified Event Specialists

STATUS: AUTHORIZED & DISPATCHED TO HSBC DUITNOW BULK PAY
Estimated Bank Clearance: 1 - 2 Hours
Security Token:   WIRA-AUTH-SEC-99824-MY
=====================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WIRA-Receipt-${tx.referenceId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="modal-batch-payout-authorized"
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-200 relative">
        {/* Close button */}
        <button
          id="btn-close-payout-modal"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Centered Status Badge */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Batch Payout Authorized
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Your transaction has been successfully initiated and is now being processed by the bank.
          </p>
        </div>

        {/* Summary Card with Key Stats (Matching Image 13) */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">TOTAL AMOUNT</span>
            <span className="text-lg font-black text-slate-900">
              RM {tx.totalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">RECIPIENTS</span>
            <span className="font-bold text-slate-800">{tx.workerCount} Workers</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">ACCOUNT</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              {tx.bankAccount}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
            <span className="text-slate-500 font-medium">REFERENCE ID</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {tx.referenceId}
              </span>
              <button
                onClick={handleCopyReference}
                className="text-slate-400 hover:text-blue-600 p-1 rounded-md hover:bg-slate-200/60 transition-colors relative"
                title="Copy reference ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Status Timeline (Matching Image 13) */}
        <div className="space-y-4 px-2">
          {/* Step 1: Authorized */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Authorized</p>
              <p className="text-[11px] text-slate-400">{tx.authorizedTime}</p>
            </div>
          </div>

          {/* Step 2: Processing */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600">Processing</p>
              <p className="text-[11px] text-slate-500">Bank is verifying transaction details.</p>
            </div>
          </div>

          {/* Step 3: Estimated Arrival */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Clock className="w-4 h-4 text-slate-300" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Estimated Arrival</p>
              <p className="text-[11px] text-slate-400">
                Funds will reflect in workers' accounts within 1-2 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            id="btn-download-payout-receipt"
            onClick={handleDownloadReceipt}
            className="w-full sm:flex-1 py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </button>

          <button
            id="btn-return-dashboard-from-payout"
            onClick={() => {
              onClose();
              if (onViewDashboard) onViewDashboard();
            }}
            className="w-full sm:flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>View Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
