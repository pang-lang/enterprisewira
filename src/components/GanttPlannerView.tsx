import React, { useState } from 'react';
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  LayoutGrid,
  List,
} from 'lucide-react';
import { UrgentEvent, NavTab } from '../types';

interface GanttPlannerViewProps {
  events: UrgentEvent[];
  onSelectEvent: (event: UrgentEvent) => void;
  setActiveTab: (tab: NavTab) => void;
}

// Generate a 30-day grid starting from anchor date
const ANCHOR_DATE = new Date(2024, 7, 17); // Aug 17, 2024

function parseDateRange(dateStr: string): { start: number; end: number } {
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  // Try "18 - 20 Aug 2024"
  const rangeMatch = dateStr.match(/(\d{1,2})\s*[-–]\s*(\d{1,2})\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s*(\d{4})?/i);
  if (rangeMatch) {
    const startDay = parseInt(rangeMatch[1]);
    const endDay = parseInt(rangeMatch[2]);
    const month = months[rangeMatch[3].substring(0, 3)];
    const year = rangeMatch[4] ? parseInt(rangeMatch[4]) : 2024;
    const startDate = new Date(year, month, startDay);
    const endDate = new Date(year, month, endDay);
    return {
      start: Math.ceil((startDate.getTime() - ANCHOR_DATE.getTime()) / 86400000),
      end: Math.ceil((endDate.getTime() - ANCHOR_DATE.getTime()) / 86400000),
    };
  }

  // Try "24 August 2024"
  const singleMatch = dateStr.match(/(\d{1,2})\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s*(\d{4})?/i);
  if (singleMatch) {
    const day = parseInt(singleMatch[1]);
    const month = months[singleMatch[2].substring(0, 3)];
    const year = singleMatch[3] ? parseInt(singleMatch[3]) : 2024;
    const date = new Date(year, month, day);
    const offset = Math.ceil((date.getTime() - ANCHOR_DATE.getTime()) / 86400000);
    return { start: offset, end: offset };
  }

  return { start: 5, end: 7 }; // default fallback
}

const TOTAL_DAYS = 30;

const DAY_LABELS = Array.from({ length: TOTAL_DAYS }, (_, i) => {
  const d = new Date(ANCHOR_DATE);
  d.setDate(ANCHOR_DATE.getDate() + i);
  return {
    day: d.getDate(),
    month: d.toLocaleString('default', { month: 'short' }),
    isWeekend: d.getDay() === 0 || d.getDay() === 6,
    label: `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`,
  };
});

const STATUS_COLORS: Record<string, string> = {
  'Critical': 'bg-rose-500',
  'At Risk': 'bg-amber-400',
  'On Track': 'bg-emerald-500',
  'Completed': 'bg-slate-300',
};

const STATUS_TEXT: Record<string, string> = {
  'Critical': 'text-rose-700 bg-rose-100',
  'At Risk': 'text-amber-700 bg-amber-100',
  'On Track': 'text-emerald-700 bg-emerald-100',
  'Completed': 'text-slate-500 bg-slate-100',
};

export const GanttPlannerView: React.FC<GanttPlannerViewProps> = ({
  events,
  onSelectEvent,
  setActiveTab,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [dayOffset, setDayOffset] = useState(0);

  const visibleDays = DAY_LABELS.slice(dayOffset, dayOffset + 14);

  const eventsWithPositions = events.map((evt) => {
    const { start, end } = parseDateRange(evt.date);
    return { ...evt, startOffset: start, endOffset: end };
  });

  // Summary stats
  const totalConfirmed = events.reduce((s, e) => s + e.confirmed, 0);
  const totalNeeded = events.reduce((s, e) => s + e.workersNeeded, 0);
  const criticalCount = events.filter((e) => e.status === 'Critical').length;

  return (
    <div id="view-planner" className="p-8 sm:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <CalendarRange className="w-7 h-7 text-blue-600" />
            Workforce Planner
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            30-day visual deployment timeline across all upcoming events
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'timeline' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Events</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{events.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Workers Deployed</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {totalConfirmed}
            <span className="text-sm text-slate-400 font-medium"> / {totalNeeded}</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Overall Fill Rate</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            {Math.round((totalConfirmed / totalNeeded) * 100)}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-rose-100 bg-rose-50/40 shadow-xs">
          <p className="text-xs text-rose-500 font-medium">Critical Events</p>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{criticalCount}</p>
        </div>
      </div>

      {viewMode === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              {visibleDays[0]?.label} — {visibleDays[visibleDays.length - 1]?.label}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDayOffset(Math.max(0, dayOffset - 7))}
                disabled={dayOffset === 0}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={() => setDayOffset(Math.min(TOTAL_DAYS - 14, dayOffset + 7))}
                disabled={dayOffset >= TOTAL_DAYS - 14}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-all"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Timeline Grid */}
          <div className="overflow-x-auto">
            <div style={{ minWidth: '700px' }}>
              {/* Day headers */}
              <div className="flex border-b border-slate-100">
                {/* Event label column */}
                <div className="w-48 shrink-0 px-4 py-2 border-r border-slate-100" />
                {/* Day columns */}
                {visibleDays.map((d, i) => (
                  <div
                    key={i}
                    className={`flex-1 py-2 text-center border-r border-slate-50 last:border-r-0 ${
                      d.isWeekend ? 'bg-slate-50/60' : ''
                    }`}
                  >
                    <div className="text-[10px] font-bold text-slate-500">{d.month}</div>
                    <div
                      className={`text-sm font-extrabold ${
                        d.isWeekend ? 'text-slate-400' : 'text-slate-700'
                      }`}
                    >
                      {d.day}
                    </div>
                  </div>
                ))}
              </div>

              {/* Event rows */}
              {eventsWithPositions.map((evt) => {
                const isHovered = hoveredEventId === evt.id;
                const statusColor = STATUS_COLORS[evt.status] || 'bg-blue-500';

                // Calculate bar position within visible window
                const visStart = dayOffset;
                const visEnd = dayOffset + 14;
                const barStart = Math.max(0, evt.startOffset - visStart);
                const barEnd = Math.min(14, evt.endOffset - visStart + 1);
                const isVisible = evt.endOffset >= visStart && evt.startOffset < visEnd;

                return (
                  <div
                    key={evt.id}
                    className="flex items-center border-b border-slate-50 hover:bg-blue-50/20 transition-colors group"
                    onMouseEnter={() => setHoveredEventId(evt.id)}
                    onMouseLeave={() => setHoveredEventId(null)}
                  >
                    {/* Event label */}
                    <div
                      className="w-48 shrink-0 px-4 py-3 border-r border-slate-100 cursor-pointer"
                      onClick={() => { onSelectEvent(evt); setActiveTab('bookings'); }}
                    >
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {evt.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{evt.location}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="w-2.5 h-2.5 text-slate-400" />
                        <span className="text-[10px] font-semibold text-slate-500">
                          {evt.confirmed}/{evt.workersNeeded}
                        </span>
                        <span
                          className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${STATUS_TEXT[evt.status]}`}
                        >
                          {evt.status}
                        </span>
                      </div>
                    </div>

                    {/* Timeline cells */}
                    <div className="flex flex-1 relative" style={{ height: '56px' }}>
                      {visibleDays.map((d, i) => (
                        <div
                          key={i}
                          className={`flex-1 border-r border-slate-50 last:border-r-0 h-full ${
                            d.isWeekend ? 'bg-slate-50/40' : ''
                          }`}
                        />
                      ))}

                      {/* Event bar */}
                      {isVisible && barEnd > barStart && (
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 ${statusColor} rounded-lg opacity-90 cursor-pointer hover:opacity-100 transition-all flex items-center px-2 gap-1.5 shadow-sm`}
                          style={{
                            left: `${(barStart / 14) * 100}%`,
                            width: `${((barEnd - barStart) / 14) * 100}%`,
                            height: '32px',
                          }}
                          onClick={() => { onSelectEvent(evt); setActiveTab('bookings'); }}
                        >
                          <span className="text-white text-[10px] font-bold truncate">
                            {evt.fillRate}% filled
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="px-6 py-3 border-t border-slate-100 flex items-center gap-6">
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${color}`} />
                <span className="text-[11px] text-slate-500 font-medium">{status}</span>
              </div>
            ))}
            <span className="text-[11px] text-slate-400 ml-auto">Weekends shaded</span>
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="space-y-3">
          {eventsWithPositions
            .sort((a, b) => a.startOffset - b.startOffset)
            .map((evt) => {
              const statusColor = STATUS_TEXT[evt.status];
              return (
                <div
                  key={evt.id}
                  onClick={() => { onSelectEvent(evt); setActiveTab('bookings'); }}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-center gap-5 hover:border-blue-300 cursor-pointer transition-all group"
                >
                  {/* Status dot */}
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 ${STATUS_COLORS[evt.status]} ${
                      evt.status === 'Critical' ? 'animate-pulse' : ''
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {evt.name}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${statusColor}`}>
                        {evt.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {evt.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {evt.date}
                      </span>
                    </div>
                  </div>

                  {/* Fill rate bar */}
                  <div className="w-36 shrink-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 font-medium">Fill Rate</span>
                      <span className="font-bold text-slate-900">{evt.fillRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        style={{ width: `${evt.fillRate}%` }}
                        className={`h-full rounded-full ${STATUS_COLORS[evt.status]}`}
                      />
                    </div>
                  </div>

                  {/* Workers */}
                  <div className="text-center shrink-0">
                    <p className="text-xs text-slate-500">Workers</p>
                    <p className="text-sm font-bold text-slate-900">
                      {evt.confirmed}<span className="text-slate-400 font-normal">/{evt.workersNeeded}</span>
                    </p>
                  </div>

                  {/* Budget */}
                  <div className="text-center shrink-0">
                    <p className="text-xs text-slate-500">Budget</p>
                    <p className="text-sm font-bold text-slate-900">RM {evt.budgetRM.toLocaleString()}</p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
