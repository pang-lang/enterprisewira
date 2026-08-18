import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Briefcase,
  AlertCircle,
  ChevronRight,
  Wand2,
} from 'lucide-react';
import { UrgentEvent } from '../types';

interface AIBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: UrgentEvent) => void;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';

const EXAMPLE_PROMPTS = [
  '15 ushers + 3 AV techs for KLCC tech expo, Aug 30–31, budget RM 12,000',
  '8 VIP hosts for luxury car launch at Pavilion KL, Sept 5, RM 4,500 budget',
  '20 F&B staff + 2 supervisors for Gourmet Fair at Mid Valley, 3 days, RM 9,000',
];

async function parseBriefWithAI(brief: string): Promise<Partial<UrgentEvent>> {
  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

      const prompt = `You are an event staffing assistant for Wira Marketplace in Malaysia. Parse this natural language event brief into structured data.

Brief: "${brief}"

Extract the following and respond ONLY with valid JSON (no markdown):
{
  "name": "event name (string)",
  "location": "venue/location (string)",
  "date": "date range as string e.g. '30 - 31 Aug 2024'",
  "time": "shift hours e.g. '9:00 AM - 6:00 PM'",
  "workersNeeded": total number of workers (number),
  "category": "one of: Concert & Music | Corporate Conference | F&B Exhibition | Product Demo & VIP | Logistics & Expo | General Event",
  "budgetRM": total budget in RM (number, extract from text)
}

If any field is unclear, make a reasonable inference for a Malaysian event context.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      const text = response.text?.trim() || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('Gemini parse failed, using fallback:', e);
    }
  }

  // Algorithmic fallback parser
  const workerMatch = brief.match(/(\d+)\s*(workers?|staff|crew|ushers?|techs?|hosts?|supervisors?)/gi);
  const totalWorkers = workerMatch
    ? workerMatch.reduce((sum, m) => sum + parseInt(m), 0)
    : 10;

  const budgetMatch = brief.match(/RM\s*([\d,]+)/i);
  const budget = budgetMatch ? parseInt(budgetMatch[1].replace(',', '')) : 5000;

  const locationMatch = brief.match(/at\s+([A-Za-z\s]+?)(?:,|\.|$)/i);
  const location = locationMatch ? locationMatch[1].trim() : 'Kuala Lumpur';

  const dateMatch = brief.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{1,2}(?:\s*[-–]\s*\d{1,2})?,?\s*\d{0,4}/i);
  const date = dateMatch ? dateMatch[0] : '30 - 31 Aug 2024';

  return {
    name: 'New Event',
    location,
    date,
    time: '9:00 AM - 6:00 PM',
    workersNeeded: totalWorkers,
    category: 'General Event',
    budgetRM: budget,
  };
}

export const AIBriefModal: React.FC<AIBriefModalProps> = ({ isOpen, onClose, onCreateEvent }) => {
  const [brief, setBrief] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsed, setParsed] = useState<Partial<UrgentEvent> | null>(null);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(false);

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!brief.trim()) return;
    setIsLoading(true);
    setError('');
    setParsed(null);
    try {
      const result = await parseBriefWithAI(brief.trim());
      setParsed(result);
    } catch {
      setError('Could not parse brief. Please try again with more details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    if (!parsed) return;
    const newEvent: UrgentEvent = {
      id: `e-${Date.now()}`,
      name: parsed.name || 'New Event',
      location: parsed.location || 'Kuala Lumpur',
      date: parsed.date || 'TBD',
      time: parsed.time || '9:00 AM - 6:00 PM',
      workersNeeded: parsed.workersNeeded || 10,
      confirmed: 0,
      fillRate: 0,
      status: 'Critical',
      category: parsed.category || 'General Event',
      budgetRM: parsed.budgetRM || 5000,
    };
    onCreateEvent(newEvent);
    setCreated(true);
    setTimeout(() => {
      setCreated(false);
      setParsed(null);
      setBrief('');
      onClose();
    }, 1800);
  };

  const handleClose = () => {
    setParsed(null);
    setBrief('');
    setError('');
    setCreated(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white stroke-[2]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">AI Brief-to-Booking</h2>
                <p className="text-xs text-purple-200 mt-0.5">Describe your event in plain language</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Text Input */}
          <div>
            <textarea
              id="ai-brief-input"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="e.g. I need 15 ushers + 3 AV techs for a 2-day tech expo at KLCC, Aug 30–31, budget RM 12,000"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400/40 resize-none leading-relaxed placeholder:text-slate-400 placeholder:font-normal"
            />
            {/* Example prompts */}
            <div className="flex flex-wrap gap-2 mt-2">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setBrief(ex)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-medium border border-purple-100 hover:bg-purple-100 transition-colors truncate max-w-[200px]"
                  title={ex}
                >
                  {ex.substring(0, 32)}…
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Parse button */}
          {!parsed && (
            <button
              id="btn-ai-brief-parse"
              onClick={handleParse}
              disabled={isLoading || !brief.trim()}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm shadow-purple-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI is parsing your brief…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Parse with AI
                </>
              )}
            </button>
          )}

          {/* Parsed Preview */}
          {parsed && !created && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                AI parsed your brief — review before creating:
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="text-base font-extrabold text-slate-900">{parsed.name}</div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">{parsed.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">{parsed.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">{parsed.workersNeeded} workers needed</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">RM {parsed.budgetRM?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 col-span-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">{parsed.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setParsed(null); }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Edit Brief
                </button>
                <button
                  id="btn-ai-brief-confirm"
                  onClick={handleCreate}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  Create Event
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {created && (
            <div className="py-6 flex flex-col items-center gap-3 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-slate-900">Event Created!</p>
                <p className="text-xs text-slate-500 mt-1">Added to your dashboard. Navigating to bookings…</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
