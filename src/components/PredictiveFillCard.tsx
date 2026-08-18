import React, { useMemo } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { UrgentEvent, NavTab } from '../types';

interface PredictiveFillCardProps {
  events: UrgentEvent[];
  onSelectEvent: (event: UrgentEvent) => void;
  setActiveTab: (tab: NavTab) => void;
}

interface FillPrediction {
  event: UrgentEvent;
  daysUntilEvent: number;
  predictedFillRate: number;
  riskLevel: 'safe' | 'watch' | 'danger';
  riskLabel: string;
  action: string;
  velocity: number; // fill rate per day
}

function parseDaysUntil(dateStr: string): number {
  // Extract first date from strings like "18 - 20 Aug 2024" or "24 August 2024"
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const match = dateStr.match(/(\d{1,2})\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s*(\d{4})?/i);
  if (!match) return 7; // default
  const day = parseInt(match[1]);
  const month = months[match[2].substring(0, 3)];
  const year = match[3] ? parseInt(match[3]) : 2024;
  const eventDate = new Date(year, month, day);
  const today = new Date(2024, 7, 17); // anchored to mock date Aug 17 2024
  const diff = Math.max(0, Math.ceil((eventDate.getTime() - today.getTime()) / 86400000));
  return diff;
}

export const PredictiveFillCard: React.FC<PredictiveFillCardProps> = ({
  events,
  onSelectEvent,
  setActiveTab,
}) => {
  const predictions = useMemo<FillPrediction[]>(() => {
    return events
      .filter((e) => e.status !== 'Completed')
      .map((evt) => {
        const days = parseDaysUntil(evt.date);
        // Simulate historical velocity: assume filling started 14 days before
        const elapsed = Math.max(1, 14 - days);
        const velocity = days > 0 ? evt.fillRate / elapsed : evt.fillRate;
        const predictedRaw = Math.min(100, evt.fillRate + velocity * days);
        const predicted = Math.round(predictedRaw);

        let riskLevel: 'safe' | 'watch' | 'danger';
        let riskLabel: string;
        let action: string;

        if (predicted >= 90) {
          riskLevel = 'safe';
          riskLabel = 'On Forecast';
          action = 'No action needed';
        } else if (predicted >= 75) {
          riskLevel = 'watch';
          riskLabel = 'Needs Attention';
          action = `Recruit ${Math.ceil((90 - predicted) / 10)} more workers`;
        } else {
          riskLevel = 'danger';
          riskLabel = 'At Risk of Failure';
          action = `Urgent: ${Math.ceil(evt.workersNeeded * (1 - predicted / 100))} workers missing`;
        }

        return { event: evt, daysUntilEvent: days, predictedFillRate: predicted, riskLevel, riskLabel, action, velocity };
      })
      .sort((a, b) => {
        const order = { danger: 0, watch: 1, safe: 2 };
        return order[a.riskLevel] - order[b.riskLevel];
      });
  }, [events]);

  const dangerCount = predictions.filter((p) => p.riskLevel === 'danger').length;
  const watchCount = predictions.filter((p) => p.riskLevel === 'watch').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Predictive Fill Rate Forecast</h2>
            <p className="text-xs text-slate-500">AI-projected fill rates at event day based on velocity</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {dangerCount > 0 && (
            <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-[11px] font-bold rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {dangerCount} critical
            </span>
          )}
          {watchCount > 0 && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[11px] font-bold rounded-full">
              {watchCount} watch
            </span>
          )}
        </div>
      </div>

      {/* Predictions Table */}
      <div className="divide-y divide-slate-50">
        {predictions.map((pred) => {
          const delta = pred.predictedFillRate - pred.event.fillRate;
          const isSafe = pred.riskLevel === 'safe';
          const isDanger = pred.riskLevel === 'danger';
          const isWatch = pred.riskLevel === 'watch';

          return (
            <div
              key={pred.event.id}
              onClick={() => { onSelectEvent(pred.event); setActiveTab('bookings'); }}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 cursor-pointer transition-colors group"
            >
              {/* Risk indicator dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  isDanger ? 'bg-rose-500 animate-pulse' : isWatch ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
              />

              {/* Event info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {pred.event.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isDanger
                        ? 'bg-rose-100 text-rose-700'
                        : isWatch
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {pred.riskLabel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{pred.action}</p>
              </div>

              {/* Days remaining */}
              <div className="text-center shrink-0">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {pred.daysUntilEvent}d
                </div>
              </div>

              {/* Current → Predicted fill rate */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-medium">Now</div>
                  <div className="text-xs font-bold text-slate-700">{pred.event.fillRate}%</div>
                </div>
                <div className="flex items-center">
                  {delta >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-slate-300" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-medium">At Event</div>
                  <div
                    className={`text-xs font-bold ${
                      pred.predictedFillRate >= 90
                        ? 'text-emerald-600'
                        : pred.predictedFillRate >= 75
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {pred.predictedFillRate}%
                  </div>
                </div>
              </div>

              {/* Fill bar */}
              <div className="w-20 shrink-0">
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    style={{ width: `${pred.predictedFillRate}%` }}
                    className={`h-full rounded-full transition-all ${
                      isDanger ? 'bg-rose-500' : isWatch ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100">
        <p className="text-[11px] text-slate-400">
          Predictions based on current fill velocity × days remaining. Click any row to staff the event.
        </p>
      </div>
    </div>
  );
};
