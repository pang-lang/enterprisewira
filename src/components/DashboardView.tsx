import React, { useState } from 'react';
import { 
  TrendingUp, 
  Star, 
  ChevronDown, 
  ChevronRight,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { UrgentEvent, NavTab } from '../types';

interface DashboardViewProps {
  events: UrgentEvent[];
  onSelectEvent: (event: UrgentEvent) => void;
  setActiveTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  events,
  onSelectEvent,
  setActiveTab,
}) => {
  const [timeRange, setTimeRange] = useState<'This Month' | 'Last Month' | 'Q3 2024'>('This Month');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Spend chart weekly/daily data
  const spendData = [
    { label: 'W1', value: 32, amount: 'RM 14,200' },
    { label: 'W2', value: 48, amount: 'RM 22,800' },
    { label: 'W3', value: 38, amount: 'RM 17,900' },
    { label: 'W4', value: 65, amount: 'RM 31,400' },
    { label: 'W5', value: 55, amount: 'RM 26,100' },
    { label: 'W6', value: 78, amount: 'RM 38,200' },
    { label: 'W7', value: 92, amount: 'RM 45,600' },
  ];

  // Shift fulfillment 4 gauge bars
  const fulfillmentGauges = [
    { label: 'Week 1', percent: 92 },
    { label: 'Week 2', percent: 96 },
    { label: 'Week 3', percent: 94 },
    { label: 'Week 4', percent: 98 },
  ];

  return (
    <div id="view-dashboard" className="p-8 sm:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, Klook Events
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Here is your live workforce deployment across all upcoming events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-quick-find-talent"
            onClick={() => setActiveTab('talent-search')}
            className="px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-blue-200/60"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search Verified Talent</span>
          </button>

          <button
            id="btn-new-event-booking"
            onClick={() => setActiveTab('bookings')}
            className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <span>Staff an Event</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5 Key Metric Cards (Row from Image 1) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {/* Active Events */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Active Events</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">12</span>
          </div>
        </div>

        {/* Workers Needed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Workers Needed</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">86</span>
          </div>
        </div>

        {/* Fill Rate (With accent underline & green badge) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <span className="text-xs font-medium text-slate-500">Fill Rate</span>
          <div className="mt-3 flex items-center gap-2.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">94%</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>+2%</span>
            </span>
          </div>
          {/* Green accent bottom bar */}
          <div className="absolute bottom-0 left-0 w-1/3 h-1 bg-emerald-600 rounded-r-full"></div>
        </div>

        {/* Avg Rating */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Avg Rating</span>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">4.7</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400 stroke-1" />
          </div>
        </div>

        {/* Staffing Spend (subtle styling matching screenshot) */}
        <div className="bg-white/80 p-5 rounded-2xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400">Staffing Spend</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-400 tracking-tight">RM128.4k</span>
          </div>
        </div>
      </div>

      {/* Middle Grid (Spend Overview + Shift Fulfillment & Top Skills) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: Staffing Spend Overview */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Staffing Spend Overview</h2>
            <div className="relative">
              <button
                id="btn-dropdown-spend-time"
                onClick={() => {
                  const options: ('This Month' | 'Last Month' | 'Q3 2024')[] = ['This Month', 'Last Month', 'Q3 2024'];
                  const nextIndex = (options.indexOf(timeRange) + 1) % options.length;
                  setTimeRange(options[nextIndex]);
                }}
                className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 bg-blue-50/60 px-3 py-1.5 rounded-lg border border-blue-100"
              >
                <span>{timeRange}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bar Chart Container matching screenshot's clean blue tone */}
          <div className="bg-blue-50/40 rounded-xl p-6 h-64 flex items-end justify-between gap-3 relative">
            {spendData.map((item, idx) => {
              const isHovered = hoveredBarIndex === idx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-10 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap z-10 animate-in fade-in zoom-in-95 duration-150">
                      {item.amount}
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    style={{ height: `${item.value}%` }}
                    className={`w-full max-w-[48px] rounded-t-md transition-all duration-300 ${
                      isHovered
                        ? 'bg-blue-600 shadow-md shadow-blue-500/20'
                        : 'bg-blue-400 hover:bg-blue-500'
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Shift Fulfillment Rate & Top Requested Skills */}
        <div className="lg:col-span-4 space-y-6">
          {/* Shift Fulfillment Rate */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Shift Fulfillment Rate</h2>
            <div className="grid grid-cols-4 gap-3 h-28 items-end">
              {fulfillmentGauges.map((gauge, idx) => (
                <div key={idx} className="flex flex-col items-center h-full justify-end group cursor-default">
                  <div className="w-full bg-slate-100 rounded-md h-full flex items-end p-0.5 overflow-hidden">
                    <div
                      style={{ height: `${gauge.percent}%` }}
                      className="w-full bg-emerald-800 group-hover:bg-emerald-700 rounded-sm transition-all duration-300"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Requested Skills */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-3">Top Requested Skills</h2>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="font-medium text-slate-700">Event Registration</span>
                <span className="font-semibold text-slate-900">45 shifts</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="font-medium text-slate-700">Ushering</span>
                <span className="font-semibold text-slate-900">32 shifts</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-medium text-slate-700">Stage Hand</span>
                <span className="font-semibold text-slate-900">15 shifts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Staffing Needs Table (Bottom of Image 1) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Urgent Staffing Needs</h2>
          <button
            id="btn-view-all-urgent-events"
            onClick={() => setActiveTab('bookings')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-6">Event</th>
                <th className="py-3 px-6">Workers Needed</th>
                <th className="py-3 px-6">Confirmed</th>
                <th className="py-3 px-6">Fill Rate</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {events.map((evt) => {
                const isAtRisk = evt.status === 'At Risk';
                const isOnTrack = evt.status === 'On Track';
                const isCritical = evt.status === 'Critical';

                return (
                  <tr
                    key={evt.id}
                    onClick={() => {
                      onSelectEvent(evt);
                      setActiveTab('bookings');
                    }}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-6 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {evt.name}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {evt.workersNeeded}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {evt.confirmed}
                    </td>
                    <td className="py-4 px-6 min-w-[140px]">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 w-9">{evt.fillRate}%</span>
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            style={{ width: `${evt.fillRate}%` }}
                            className={`h-full rounded-full ${
                              isCritical
                                ? 'bg-rose-500'
                                : isAtRisk
                                ? 'bg-amber-500'
                                : 'bg-emerald-600'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          isCritical
                            ? 'bg-rose-100 text-rose-700'
                            : isAtRisk
                            ? 'bg-amber-900/10 text-amber-800'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
