import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Send,
  CheckCircle2,
  Users,
  Phone,
  Clock,
  MapPin,
  Calendar,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';

interface WorkerContact {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  role: string;
  confirmed: boolean;
}

interface WhatsAppDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  workers: WorkerContact[];
}

type SendStatus = 'idle' | 'sending' | 'sent';

export const WhatsAppDispatchModal: React.FC<WhatsAppDispatchModalProps> = ({
  isOpen,
  onClose,
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  workers,
}) => {
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<Set<string>>(
    new Set(workers.filter((w) => w.confirmed).map((w) => w.id))
  );
  const [customMessage, setCustomMessage] = useState('');
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  const [sentWorkerIds, setSentWorkerIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const selected = workers.filter((w) => selectedWorkerIds.has(w.id));

  const defaultMessage = `Hi {name}! 👋

Your shift confirmation for *${eventName}*:
📅 ${eventDate}
⏰ ${eventTime}
📍 ${eventLocation}

Please arrive 30 minutes early for briefing. Dress code: Smart Casual with your Wira ID badge.

Reply *CONFIRM* to acknowledge or *HELP* for assistance.

– Klook Events Team 🎉`;

  const messageToSend = customMessage || defaultMessage;

  const toggleWorker = (id: string) => {
    setSelectedWorkerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSendAll = async () => {
    if (selected.length === 0) return;
    setSendStatus('sending');

    // Simulate staggered sends
    for (const worker of selected) {
      await new Promise((r) => setTimeout(r, 400));
      setSentWorkerIds((prev) => new Set([...prev, worker.id]));
    }

    setSendStatus('sent');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageToSend);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setSendStatus('idle');
    setSentWorkerIds(new Set());
    setCustomMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={sendStatus === 'idle' ? handleClose : undefined}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#25D366] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">WhatsApp Shift Dispatch</h2>
              <p className="text-xs text-green-100 mt-0.5">
                Send shift confirmations to {workers.filter((w) => w.confirmed).length} confirmed workers
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {/* Left: Worker selection */}
            <div className="border-r border-slate-100 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Recipients</h3>
                <button
                  onClick={() =>
                    setSelectedWorkerIds(
                      selectedWorkerIds.size === workers.length
                        ? new Set()
                        : new Set(workers.map((w) => w.id))
                    )
                  }
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  {selectedWorkerIds.size === workers.length ? 'Deselect all' : 'Select all'}
                </button>
              </div>

              <div className="space-y-2">
                {workers.map((worker) => {
                  const isSelected = selectedWorkerIds.has(worker.id);
                  const isSent = sentWorkerIds.has(worker.id);

                  return (
                    <div
                      key={worker.id}
                      onClick={() => !isSent && toggleWorker(worker.id)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSent
                          ? 'bg-emerald-50 border-emerald-200 cursor-default'
                          : isSelected
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{worker.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{worker.role}</p>
                      </div>

                      {isSent ? (
                        <div className="flex items-center gap-1 text-emerald-600 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-[10px] font-bold">Sent ✓✓</span>
                        </div>
                      ) : (
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Event info summary */}
              <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{eventDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{eventTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{eventLocation}</span>
                </div>
              </div>
            </div>

            {/* Right: Message preview */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message Preview</h3>
                <button
                  onClick={handleCopyMessage}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-700"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* WhatsApp-style chat bubble */}
              <div className="bg-[#e5ddd5] rounded-xl p-3 min-h-[180px]">
                <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-sm max-w-[90%]">
                  <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                    {messageToSend.replace('{name}', selected[0]?.name || '[Worker Name]')}
                  </p>
                  <p className="text-[10px] text-slate-400 text-right mt-1.5">10:42 AM ✓✓</p>
                </div>
              </div>

              {/* Custom message override */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                  Custom message (optional — overrides default)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add a custom note or override the default message…"
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-400/40 resize-none"
                />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{selectedWorkerIds.size}</strong> recipients
                </span>
                {sentWorkerIds.size > 0 && (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {sentWorkerIds.size} sent
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Send button */}
        <div className="border-t border-slate-100 px-6 py-4 shrink-0">
          {sendStatus === 'sent' ? (
            <div className="flex items-center justify-center gap-3 py-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="text-sm font-bold text-slate-900">All messages dispatched!</p>
                <p className="text-xs text-slate-500">{sentWorkerIds.size} workers notified via WhatsApp</p>
              </div>
            </div>
          ) : (
            <button
              id="btn-whatsapp-send"
              onClick={handleSendAll}
              disabled={selectedWorkerIds.size === 0 || sendStatus === 'sending'}
              className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-green-500/20"
            >
              {sendStatus === 'sending' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending to {selected.length} workers…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send to {selectedWorkerIds.size} Worker{selectedWorkerIds.size !== 1 ? 's' : ''}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
