import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ChevronDown,
  Star,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  MapPin,
  Clock,
  AlertTriangle,
  TrendingUp,
  Send,
  MailCheck,
  XCircle,
  Timer,
  BellRing,
  UserCheck,
} from 'lucide-react';
import { Worker, UrgentEvent } from '../types';

interface SmartDispatchPanelProps {
  events: UrgentEvent[];
  workers: Worker[];
  onBookWorker: (worker: Worker, eventName: string) => void;
}

interface DispatchResult {
  worker: Worker;
  rank: number;
  reasoning: string;
  fitScore: number;
}

type InviteStatus = 'idle' | 'sending' | 'invited' | 'accepted' | 'declined';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';

async function runSmartDispatch(event: UrgentEvent, workers: Worker[]): Promise<DispatchResult[]> {
  const gapNeeded = event.workersNeeded - event.confirmed;
  const available = workers.filter((w) => w.status === 'Available Now');

  // Try Gemini AI first
  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const workerSummaries = available.slice(0, 9).map((w) => ({
        id: w.id,
        name: w.name,
        role: w.role,
        rating: w.rating,
        matchScore: w.matchScore,
        skills: w.skills,
        location: w.location,
        completedShifts: w.completedShifts,
        hourlyRate: w.hourlyRate,
      }));

      const prompt = `You are an AI staffing assistant for Wira Marketplace in Malaysia.

Event needing staff: "${event.name}"
Category: ${event.category}
Location: ${event.location}
Date: ${event.date}
Staff gap: ${gapNeeded} more workers needed out of ${event.workersNeeded} total
Budget remaining: RM ${Math.round((event.budgetRM * (1 - event.fillRate / 100)))} approx

Available workers (JSON):
${JSON.stringify(workerSummaries, null, 2)}

Rank the top ${Math.min(gapNeeded + 2, available.length)} workers for this specific event. For each, provide:
- id (exact worker id)
- fitScore (0-100)
- reasoning (one concise sentence, max 12 words, about why they fit)

Respond ONLY with a valid JSON array like:
[{"id":"w-1","fitScore":97,"reasoning":"Top event coordinator with VIP handling experience"},...]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      const text = response.text?.trim() || '';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed: { id: string; fitScore: number; reasoning: string }[] = JSON.parse(jsonMatch[0]);
        const results: DispatchResult[] = parsed
          .map((r, idx) => {
            const worker = available.find((w) => w.id === r.id);
            if (!worker) return null;
            return { worker, rank: idx + 1, reasoning: r.reasoning, fitScore: r.fitScore };
          })
          .filter(Boolean) as DispatchResult[];
        if (results.length > 0) return results;
      }
    } catch (e) {
      console.warn('Gemini API failed, falling back to algorithmic dispatch:', e);
    }
  }

  // Algorithmic fallback
  const reasoningMap: Record<string, string> = {
    'Concert & Music': 'crowd management & stage coordination',
    'Corporate Conference': 'professional VIP presentation & guest handling',
    'F&B Exhibition': 'food hygiene certification & active floor service',
    'Product Demo & VIP': 'VIP handling & fluent product pitch experience',
  };
  const keyword = reasoningMap[event.category] || 'event operations';

  return available
    .sort((a, b) => b.matchScore * b.rating - a.matchScore * a.rating)
    .slice(0, Math.min(gapNeeded + 2, 6))
    .map((worker, idx) => ({
      worker,
      rank: idx + 1,
      fitScore: Math.round(worker.matchScore * 0.6 + worker.rating * 8),
      reasoning: `Strong ${keyword} background with ${worker.completedShifts} completed shifts`,
    }));
}

export const SmartDispatchPanel: React.FC<SmartDispatchPanelProps> = ({
  events,
  workers,
  onBookWorker,
}) => {
  const urgentEvents = events.filter((e) => e.status !== 'On Track' && e.status !== 'Completed');
  const [selectedEventId, setSelectedEventId] = useState<string>(urgentEvents[0]?.id || events[0]?.id || '');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DispatchResult[] | null>(null);
  const [dispatchMode, setDispatchMode] = useState<'invite' | 'instant'>('invite');
  const [inviteStatuses, setInviteStatuses] = useState<Record<string, InviteStatus>>({});
  const [batchInviting, setBatchInviting] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const handleDispatch = async () => {
    if (!selectedEvent) return;
    setIsRunning(true);
    setResults(null);
    setInviteStatuses({});
    try {
      const res = await runSmartDispatch(selectedEvent, workers);
      setResults(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSendInvite = (result: DispatchResult) => {
    if (!selectedEvent) return;
    const workerId = result.worker.id;
    
    // Set sending state
    setInviteStatuses((prev) => ({ ...prev, [workerId]: 'sending' }));

    setTimeout(() => {
      setInviteStatuses((prev) => ({ ...prev, [workerId]: 'invited' }));
      setRecentNotification(`Shift invite sent to ${result.worker.name} (30m confirmation window)`);

      // Auto-simulate worker accepting after 4.5 seconds for interactive demonstration
      setTimeout(() => {
        setInviteStatuses((prev) => {
          if (prev[workerId] === 'invited') {
            onBookWorker(result.worker, selectedEvent.name);
            setRecentNotification(`🎉 ${result.worker.name} confirmed & accepted the shift for ${selectedEvent.name}!`);
            return { ...prev, [workerId]: 'accepted' };
          }
          return prev;
        });
      }, 4500);
    }, 600);
  };

  const handleSimulateResponse = (result: DispatchResult, response: 'accepted' | 'declined') => {
    if (!selectedEvent) return;
    const workerId = result.worker.id;
    setInviteStatuses((prev) => ({ ...prev, [workerId]: response }));
    
    if (response === 'accepted') {
      onBookWorker(result.worker, selectedEvent.name);
      setRecentNotification(`✅ ${result.worker.name} confirmed availability and is now booked for ${selectedEvent.name}!`);
    } else {
      setRecentNotification(`⚠️ ${result.worker.name} declined availability. AI recommending next best replacement.`);
    }
  };

  const handleInstantBook = (result: DispatchResult) => {
    if (!selectedEvent) return;
    onBookWorker(result.worker, selectedEvent.name);
    setInviteStatuses((prev) => ({ ...prev, [result.worker.id]: 'accepted' }));
    setRecentNotification(`Instant booking confirmed for ${result.worker.name}!`);
  };

  const handleBatchInviteAll = () => {
    if (!results || !selectedEvent) return;
    setBatchInviting(true);
    const uninvited = results.filter((r) => !inviteStatuses[r.worker.id] || inviteStatuses[r.worker.id] === 'idle');
    
    uninvited.forEach((r, idx) => {
      setTimeout(() => {
        handleSendInvite(r);
        if (idx === uninvited.length - 1) {
          setBatchInviting(false);
        }
      }, idx * 250);
    });
  };

  const gapNeeded = selectedEvent ? selectedEvent.workersNeeded - selectedEvent.confirmed : 0;
  const invitedCount = Object.values(inviteStatuses).filter((s) => s === 'invited').length;
  const acceptedCount = Object.values(inviteStatuses).filter((s) => s === 'accepted').length;

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/20 overflow-hidden">
      {/* Header */}
      <div
        className="p-5 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white stroke-[2]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              AI Smart Dispatch
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] text-white/90 font-semibold tracking-wide">
                GEMINI POWERED
              </span>
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              {dispatchMode === 'invite'
                ? 'Send shift availability invites & auto-confirm confirmed responders'
                : 'Directly assign & instantly book verified crew'}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-white/70 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          {/* Dispatch Mode Selector + Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/10 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-white/90">
              <span className="font-semibold text-white">Dispatch Mode:</span>
              <div className="inline-flex bg-black/20 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDispatchMode('invite')}
                  className={`px-3 py-1 rounded-md font-bold text-[11px] transition-all flex items-center gap-1.5 ${
                    dispatchMode === 'invite'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Send className="w-3 h-3" />
                  <span>Availability Invite</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDispatchMode('instant')}
                  className={`px-3 py-1 rounded-md font-bold text-[11px] transition-all flex items-center gap-1.5 ${
                    dispatchMode === 'instant'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>Instant Book</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-blue-100 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Timer className="w-3.5 h-3.5 text-blue-200" />
                Response Window: <strong>30 mins</strong>
              </span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-1">
                <BellRing className="w-3.5 h-3.5 text-emerald-300" />
                SMS & App Push
              </span>
            </div>
          </div>

          {/* Event Selector + Dispatch Button */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <select
                value={selectedEventId}
                onChange={(e) => {
                  setSelectedEventId(e.target.value);
                  setResults(null);
                  setInviteStatuses({});
                }}
                className="w-full appearance-none bg-white/15 border border-white/20 text-white text-xs font-semibold rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id} className="text-slate-900 bg-white">
                    {evt.name} — gap: {evt.workersNeeded - evt.confirmed} ({evt.location})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
            </div>

            <button
              id="btn-smart-dispatch-run"
              onClick={handleDispatch}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-50 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analysing Crew…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>AI Smart Match</span>
                </>
              )}
            </button>
          </div>

          {/* Event Status Bar */}
          {selectedEvent && (
            <div className="bg-white/10 rounded-xl p-3 flex flex-wrap items-center gap-4 text-xs text-white/90">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-200" />
                {selectedEvent.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-200" />
                {selectedEvent.date}
              </span>
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                <strong className="text-white">{gapNeeded}</strong>&nbsp;workers still needed
              </span>
              <span className="flex items-center gap-1.5 ml-auto">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
                {selectedEvent.fillRate}% filled
              </span>
            </div>
          )}

          {/* Live Notification Banner */}
          {recentNotification && (
            <div className="bg-emerald-500/25 border border-emerald-400/40 rounded-xl p-2.5 text-xs text-white font-medium flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                {recentNotification}
              </span>
              <button
                onClick={() => setRecentNotification(null)}
                className="text-white/60 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Loading shimmer */}
          {isRunning && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-white/10 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Results */}
          {results && !isRunning && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-blue-200 font-semibold uppercase tracking-wider">
                  AI Recommended Candidates ({results.length} matches)
                </p>
                {dispatchMode === 'invite' && (
                  <button
                    onClick={handleBatchInviteAll}
                    disabled={batchInviting || results.length === 0}
                    className="text-xs bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1 rounded-lg transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Invite All Top Matches ({results.length})</span>
                  </button>
                )}
              </div>

              {results.map((r) => {
                const status = inviteStatuses[r.worker.id] || 'idle';
                const isAccepted = status === 'accepted';
                const isInvited = status === 'invited';
                const isDeclined = status === 'declined';
                const isSending = status === 'sending';

                return (
                  <div
                    key={r.worker.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl p-3.5 transition-all shadow-xs ${
                      isAccepted
                        ? 'border-2 border-emerald-500/50 bg-emerald-50/20'
                        : isDeclined
                        ? 'opacity-60 bg-slate-50'
                        : ''
                    }`}
                  >
                    {/* Left: Rank, Avatar, Worker details */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank badge */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          r.rank === 1
                            ? 'bg-amber-100 text-amber-700'
                            : r.rank === 2
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-slate-50 text-slate-400'
                        }`}
                      >
                        #{r.rank}
                      </div>

                      {/* Avatar */}
                      <img
                        src={r.worker.avatar}
                        alt={r.worker.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs shrink-0"
                      />

                      {/* Info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">{r.worker.name}</span>
                          {r.worker.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          )}
                          <span className="text-[10px] text-slate-500 font-medium px-1.5 py-0.2 bg-slate-100 rounded">
                            RM {r.worker.hourlyRate}/hr
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{r.reasoning}</p>
                      </div>
                    </div>

                    {/* Right: Scores & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Fit Score */}
                      <div className="text-center shrink-0">
                        <div className="text-sm font-black text-emerald-600">{r.fitScore}%</div>
                        <div className="text-[9px] text-slate-400 font-medium uppercase">Match</div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-0.5 shrink-0 px-2 py-1 bg-amber-50 rounded-lg">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-900">{r.worker.rating}</span>
                      </div>

                      {/* Dynamic Action Button based on dispatchMode and status */}
                      <div className="flex items-center gap-1.5">
                        {dispatchMode === 'instant' ? (
                          <button
                            onClick={() => handleInstantBook(r)}
                            disabled={isAccepted}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                              isAccepted
                                ? 'bg-emerald-50 text-emerald-600 cursor-default'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                            }`}
                          >
                            {isAccepted ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Booked
                              </span>
                            ) : (
                              'Book Now'
                            )}
                          </button>
                        ) : (
                          <>
                            {status === 'idle' && (
                              <button
                                onClick={() => handleSendInvite(r)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all"
                              >
                                <Send className="w-3 h-3" />
                                <span>Send Invite</span>
                              </button>
                            )}

                            {isSending && (
                              <button
                                disabled
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg"
                              >
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Dispatching…</span>
                              </button>
                            )}

                            {isInvited && (
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold rounded-lg">
                                  <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                                  <span>Invited (Pending)</span>
                                </span>

                                {/* Quick simulation triggers */}
                                <button
                                  title="Simulate candidate accepting invite"
                                  onClick={() => handleSimulateResponse(r, 'accepted')}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md text-[10px] font-bold border border-emerald-200"
                                >
                                  Accept ✓
                                </button>
                                <button
                                  title="Simulate candidate declining invite"
                                  onClick={() => handleSimulateResponse(r, 'declined')}
                                  className="p-1 text-rose-500 hover:bg-rose-50 rounded-md text-[10px] font-bold border border-rose-200"
                                >
                                  Decline ✕
                                </button>
                              </div>
                            )}

                            {isAccepted && (
                              <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Accepted & Confirmed</span>
                              </div>
                            )}

                            {isDeclined && (
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-700 text-[11px] font-semibold rounded-lg">
                                  <XCircle className="w-3 h-3 text-rose-500" />
                                  <span>Declined</span>
                                </span>
                                <button
                                  onClick={() => handleSendInvite(r)}
                                  className="text-[10px] text-blue-600 hover:underline font-bold"
                                >
                                  Re-invite
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Status summary footer */}
              {(invitedCount > 0 || acceptedCount > 0) && (
                <div className="bg-white/15 border border-white/20 rounded-xl p-3 text-xs text-white font-medium flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <MailCheck className="w-4 h-4 text-amber-300" />
                      <strong>{invitedCount}</strong> pending response
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-300" />
                      <strong>{acceptedCount}</strong> confirmed & rostered
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-100">
                    Workers receive instant push notifications with shift terms
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

