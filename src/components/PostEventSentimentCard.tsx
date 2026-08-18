import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Loader2,
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
} from 'lucide-react';

interface EventSentiment {
  id: string;
  name: string;
  date: string;
  category: string;
  workerReliabilityScore: number;
  logisticsScore: number;
  clientSatisfactionScore: number;
  healthScore: number;
  highlights: string[];
  improvements: string[];
  riskFlag: string | null;
  summary: string;
  reviews: string[];
}

const MOCK_EVENTS_DATA: Omit<EventSentiment, 'summary' | 'healthScore'>[] = [
  {
    id: 's-1',
    name: 'Samsung Galaxy S24 Launch',
    date: 'Oct 2023',
    category: 'Product Demo & VIP',
    workerReliabilityScore: 98,
    logisticsScore: 94,
    clientSatisfactionScore: 97,
    highlights: ['Zero no-shows', 'VIP handling rated excellent', 'All shifts started on time'],
    improvements: ['Briefing room was crowded', 'One AV mic issue during setup'],
    riskFlag: null,
    reviews: [
      'Siti led the registration counter flawlessly — the Samsung team was very impressed.',
      'All crew showed up on time, very professional appearance and conduct.',
      'One minor mic issue during setup but resolved quickly. No impact on event.',
      'VIP escort protocol was smooth. No complaints from ambassadors.'
    ],
  },
  {
    id: 's-2',
    name: 'KL Music Fest 2023',
    date: 'Aug 2023',
    category: 'Concert & Music',
    workerReliabilityScore: 85,
    logisticsScore: 78,
    clientSatisfactionScore: 82,
    highlights: ['Crowd control handled well', 'Stage crew performed above expectations'],
    improvements: ['2 no-shows in crowd management', 'Gate 4 crowd flow bottleneck'],
    riskFlag: 'High no-show risk for large concerts — pre-confirm 48h before',
    reviews: [
      'Two crew members did not show up at Gate 4 — we had to redistribute urgently.',
      'Stage team was excellent, Ahmad and his AV crew saved the main show transition.',
      'Crowd at Gate 4 got congested during peak entry, need better buffer crew.',
      'Overall great energy from the team despite the chaotic opening hour.',
    ],
  },
  {
    id: 's-3',
    name: 'Gourmet Food Fair 2023',
    date: 'Jun 2023',
    category: 'F&B Exhibition',
    workerReliabilityScore: 95,
    logisticsScore: 90,
    clientSatisfactionScore: 93,
    highlights: ['David Lee praised by all exhibitors', 'Zero hygiene incidents', '4-day event ran smoothly'],
    improvements: ['Shift handovers needed better briefing sheets', 'Overtime not pre-approved'],
    riskFlag: null,
    reviews: [
      'David Lee was exceptional — every exhibitor gave him personal feedback cards.',
      'No hygiene or food safety incidents across all 4 days. JAKIM standards met.',
      'The shift handover between Day 2 and Day 3 was slightly confusing.',
      'A few overtime hours were not pre-approved, caused payroll delay.',
    ],
  },
];

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';

async function generateSentimentSummary(event: Omit<EventSentiment, 'summary' | 'healthScore'>): Promise<string> {
  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

      const prompt = `Analyze these post-event worker reviews for "${event.name}" (${event.category}) and write a 2-sentence executive summary for an enterprise HR manager. Be direct, specific, and professional.

Reviews:
${event.reviews.map((r, i) => `${i + 1}. "${r}"`).join('\n')}

Highlights: ${event.highlights.join(', ')}
Areas to improve: ${event.improvements.join(', ')}

Write exactly 2 sentences. No headers, no bullet points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      return response.text?.trim() || '';
    } catch (e) {
      console.warn('Gemini sentiment failed:', e);
    }
  }

  // Fallback: algorithmic summary
  const avgScore = Math.round((event.workerReliabilityScore + event.logisticsScore + event.clientSatisfactionScore) / 3);
  return `${event.name} achieved a ${avgScore}% overall health score with ${event.highlights[0].toLowerCase()} as the top win. Key focus area for next event: ${event.improvements[0].toLowerCase()}.`;
}

const ScoreRing: React.FC<{ score: number; label: string; size?: 'sm' | 'md' }> = ({
  score, label, size = 'sm'
}) => {
  const radius = size === 'md' ? 30 : 22;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  const color = score >= 90 ? '#10b981' : score >= 75 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size === 'md' ? 76 : 56} height={size === 'md' ? 76 : 56} className="-rotate-90">
        <circle
          cx={size === 'md' ? 38 : 28}
          cy={size === 'md' ? 38 : 28}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="5"
        />
        <circle
          cx={size === 'md' ? 38 : 28}
          cy={size === 'md' ? 38 : 28}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
        <text
          x={size === 'md' ? 38 : 28}
          y={size === 'md' ? 38 : 28}
          textAnchor="middle"
          dominantBaseline="middle"
          className="rotate-90"
          style={{ transform: `rotate(90deg) translate(0, ${size === 'md' ? -76 : -56}px)`, fontSize: size === 'md' ? '13px' : '10px', fontWeight: 800, fill: color }}
        >
          {score}
        </text>
      </svg>
      <span className="text-[10px] font-semibold text-slate-500 text-center leading-tight max-w-[52px]">{label}</span>
    </div>
  );
};

export const PostEventSentimentCard: React.FC = () => {
  const [sentiments, setSentiments] = useState<EventSentiment[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [generatedIds, setGeneratedIds] = useState<Set<string>>(new Set());

  const handleGenerate = async (event: Omit<EventSentiment, 'summary' | 'healthScore'>) => {
    if (generatedIds.has(event.id)) return;
    setLoadingId(event.id);
    try {
      const summary = await generateSentimentSummary(event);
      const healthScore = Math.round(
        (event.workerReliabilityScore * 0.4 + event.logisticsScore * 0.3 + event.clientSatisfactionScore * 0.3)
      );
      setSentiments((prev) => [
        ...prev.filter((s) => s.id !== event.id),
        { ...event, summary, healthScore },
      ]);
      setGeneratedIds((prev) => new Set([...prev, event.id]));
    } finally {
      setLoadingId(null);
    }
  };

  const handleGenerateAll = async () => {
    for (const evt of MOCK_EVENTS_DATA) {
      if (!generatedIds.has(evt.id)) {
        await handleGenerate(evt);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Post-Event Sentiment Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">AI-generated health scores from worker reviews & client feedback</p>
        </div>
        <button
          id="btn-generate-all-sentiment"
          onClick={handleGenerateAll}
          disabled={loadingId !== null || generatedIds.size === MOCK_EVENTS_DATA.length}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          {loadingId !== null ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
          ) : generatedIds.size === MOCK_EVENTS_DATA.length ? (
            <><CheckCircle2 className="w-3.5 h-3.5" /> All Generated</>
          ) : (
            <><Sparkles className="w-3.5 h-3.5" /> Generate All</>
          )}
        </button>
      </div>

      {/* Event Cards */}
      <div className="divide-y divide-slate-50">
        {MOCK_EVENTS_DATA.map((evt) => {
          const generated = sentiments.find((s) => s.id === evt.id);
          const isLoading = loadingId === evt.id;

          return (
            <div key={evt.id} className="p-6 space-y-4">
              {/* Event Header Row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{evt.name}</h3>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                    <span>{evt.date}</span>
                    <span>•</span>
                    <span>{evt.category}</span>
                  </div>
                </div>

                {generated ? (
                  <div className="text-center shrink-0">
                    <div
                      className={`text-2xl font-black ${
                        generated.healthScore >= 90
                          ? 'text-emerald-600'
                          : generated.healthScore >= 75
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {generated.healthScore}
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">Health Score</div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleGenerate(evt)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-purple-200 bg-purple-50 text-purple-700 text-xs font-bold rounded-xl hover:bg-purple-100 transition-all disabled:opacity-60"
                  >
                    {isLoading ? (
                      <><Loader2 className="w-3 h-3 animate-spin" /> Analysing…</>
                    ) : (
                      <><Sparkles className="w-3 h-3" /> Analyse</>
                    )}
                  </button>
                )}
              </div>

              {/* Score rings */}
              <div className="flex items-center gap-6">
                <ScoreRing score={evt.workerReliabilityScore} label="Worker Reliability" />
                <ScoreRing score={evt.logisticsScore} label="Logistics" />
                <ScoreRing score={evt.clientSatisfactionScore} label="Client Satisfaction" />

                {/* AI summary */}
                {generated && (
                  <div className="flex-1 bg-purple-50/60 border border-purple-100 rounded-xl p-3">
                    <p className="text-xs text-purple-900 leading-relaxed italic">"{generated.summary}"</p>
                  </div>
                )}

                {isLoading && (
                  <div className="flex-1 bg-slate-50 rounded-xl p-3 animate-pulse h-16" />
                )}
              </div>

              {/* Highlights & improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> What went well
                  </p>
                  {evt.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-slate-600">{h}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                    <ThumbsDown className="w-3 h-3" /> Improvements needed
                  </p>
                  {evt.improvements.map((imp, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <TrendingDown className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-slate-600">{imp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk flag */}
              {evt.riskFlag && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 font-medium">{evt.riskFlag}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
