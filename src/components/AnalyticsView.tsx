import React, { useState } from 'react';
import { 
  Download, 
  CreditCard, 
  CheckSquare, 
  Star, 
  Receipt, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb,
  Sparkles,
  Utensils,
  Megaphone,
  Radio,
  Truck
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState<'7 days' | '30 days' | '3 months' | '12 months'>('30 days');
  const [hoveredWeek, setHoveredWeek] = useState<{ week: string; spend: string; x: number; y: number } | null>(null);

  // SVG curved line chart points for Spend Over Time
  const curvePoints = [
    { week: 'Week 1', spend: 'RM 18,200', x: 50, y: 190 },
    { week: 'Week 2', spend: 'RM 36,400', x: 190, y: 155 },
    { week: 'Week 3', spend: 'RM 24,100', x: 330, y: 185 },
    { week: 'Week 4', spend: 'RM 51,700', x: 470, y: 45 },
    { week: 'Current', spend: 'RM 58,200', x: 520, y: 100 },
  ];

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value,Period\n"
      + "Total Spend,RM128400,30 Days\n"
      + "Fill Rate,94%,30 Days\n"
      + "Average Rating,4.7,30 Days\n"
      + "Cost Per Fill,RM182,30 Days\n"
      + "Shift Completion,97%,30 Days\n"
      + "Savings vs Agency,RM28 per placement,30 Days\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wira-workforce-analytics-${activePeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="view-analytics" className="p-8 sm:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header with Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Workforce Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Real-time operational efficiency, cost-per-fill metrics, and workforce reliability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Filter Pill Buttons */}
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
            {(['7 days', '30 days', '3 months', '12 months'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activePeriod === period
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Export Data Button */}
          <button
            id="btn-export-analytics"
            onClick={handleExportData}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold transition-all flex items-center gap-2 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Cards (Matching Image 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* TOTAL SPEND */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider">TOTAL SPEND</span>
            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">RM128,400</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-rose-600 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>+12% vs last month</span>
            </div>
          </div>
        </div>

        {/* FILL RATE */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider">FILL RATE</span>
            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">94%</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>+2% vs last month</span>
            </div>
          </div>
        </div>

        {/* AVG RATING */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider">AVG RATING</span>
            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
              <Star className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">4.7</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400 stroke-1" />
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">= No change</p>
          </div>
        </div>

        {/* COST PER FILL */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider">COST PER FILL</span>
            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">RM182</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-semibold">
              <TrendingDown className="w-3 h-3" />
              <span>-5% vs last month</span>
            </div>
          </div>
        </div>

        {/* SHIFT COMPLETION */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 tracking-wider">SHIFT COMPLETION</span>
            <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">97%</span>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>+1% vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row (Staffing Spend Over Time + Benchmark Comparison) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Staffing Spend Over Time (Curve Chart) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-slate-900">Staffing Spend Over Time</h2>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
              View Details
            </button>
          </div>

          {/* Interactive SVG Smooth Wave Chart */}
          <div className="relative w-full pt-2 pb-4">
            <div className="h-56 w-full">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 540 220"
                preserveAspectRatio="none"
              >
                {/* Background gradient fill */}
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="50" x2="540" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="120" x2="540" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="190" x2="540" y2="190" stroke="#f1f5f9" strokeWidth="1" />

                {/* Area fill */}
                <path
                  d="M 0 195 C 40 195, 120 180, 190 155 C 260 130, 270 190, 330 185 C 390 180, 430 30, 470 45 C 500 60, 520 80, 540 100 L 540 210 L 0 210 Z"
                  fill="url(#spendGradient)"
                />

                {/* Smooth Blue Bezier Curve Line matching Image 5 */}
                <path
                  d="M 0 195 C 40 195, 120 180, 190 155 C 260 130, 270 190, 330 185 C 390 180, 430 30, 470 45 C 500 60, 520 80, 540 100"
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* Data points */}
                {curvePoints.map((pt, i) => (
                  <g
                    key={i}
                    onMouseEnter={() => setHoveredWeek(pt)}
                    onMouseLeave={() => setHoveredWeek(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredWeek?.week === pt.week ? 7 : 5}
                      fill="#ffffff"
                      stroke="#1d4ed8"
                      strokeWidth="3.5"
                      className="transition-all"
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Tooltip */}
            {hoveredWeek && (
              <div
                style={{ left: `${(hoveredWeek.x / 540) * 100}%`, top: `${(hoveredWeek.y / 220) * 100 - 25}%` }}
                className="absolute -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-1 px-2.5 rounded-lg shadow-lg pointer-events-none z-10"
              >
                {hoveredWeek.week}: {hoveredWeek.spend}
              </div>
            )}

            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-slate-400 font-semibold px-6 pt-4 pb-3">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        {/* Cost per Fill vs Benchmark */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-5">Cost per Fill vs Benchmark</h2>
            
            <div className="space-y-5 text-xs">
              {/* Our Platform */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-700">Our Platform</span>
                  <span className="font-bold text-emerald-600">RM 182</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full w-[70%]"></div>
                </div>
              </div>

              {/* Agency Average */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-500">Agency Average</span>
                  <span className="font-bold text-slate-600">RM 210</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-indigo-200 h-full rounded-full w-[85%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Green Callout Highlight (Matching Image 5) */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 mt-6 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <p className="text-xs text-emerald-900 font-medium leading-relaxed">
              You are saving an average of <strong className="font-bold text-emerald-800">RM 28 per placement</strong> compared to traditional staffing agencies.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom 3-Card Row (Fill Rate by Events + Rating Distribution + Most Requested Skills) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fill Rate by Recent Events */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Fill Rate by Recent Events</h2>
          
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Samsung Launch</span>
                <span className="font-bold text-slate-900">100%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>KL Music Fest</span>
                <span className="font-bold text-slate-900">92%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[92%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Tech Expo 2024</span>
                <span className="font-bold text-slate-900">88%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[88%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Weekend Promo Staff</span>
                <span className="font-bold text-rose-600">75%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-600 h-full rounded-full w-[75%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Worker Rating Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <h2 className="text-base font-bold text-slate-900 mb-4">Worker Rating Distribution</h2>
          
          <div className="flex items-end justify-between gap-3 h-36 px-2">
            {[
              { star: '1★', percent: 4, count: 2 },
              { star: '2★', percent: 8, count: 4 },
              { star: '3★', percent: 18, count: 12 },
              { star: '4★', percent: 55, count: 48 },
              { star: '5★', percent: 92, count: 182 },
            ].map((rating, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] text-slate-400 group-hover:text-slate-700 mb-1 font-semibold">
                  {rating.count}
                </span>
                <div className="w-full bg-slate-100 rounded-t-md h-full flex items-end p-0.5">
                  <div
                    style={{ height: `${rating.percent}%` }}
                    className="w-full bg-blue-600 group-hover:bg-blue-500 rounded-xs transition-all duration-300"
                  ></div>
                </div>
                <span className="text-xs text-slate-600 font-bold mt-2">{rating.star}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Requested Skills */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Most Requested Skills</h2>
          
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/50 border border-amber-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                  <Utensils className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800">Hospitality</span>
              </div>
              <span className="font-bold text-slate-900">42%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
                  <Megaphone className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800">Product Demo</span>
              </div>
              <span className="font-bold text-slate-900">28%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-700 flex items-center justify-center font-bold">
                  <Radio className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800">Stage Crew</span>
              </div>
              <span className="font-bold text-slate-900">15%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-800">Logistics</span>
              </div>
              <span className="font-bold text-slate-900">15%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
