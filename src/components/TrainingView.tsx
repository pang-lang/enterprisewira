import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Search, 
  Award, 
  BookOpen, 
  UserCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const TrainingView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Safety' | 'Hospitality' | 'Technical' | 'Compliance'>('All');

  const modules = [
    {
      id: 'mod-1',
      title: 'VIP Protocol & Diplomatic Hospitality Etiquette',
      category: 'Hospitality',
      enrolled: 420,
      completionRate: 98,
      duration: '45 mins',
      level: 'Advanced',
      badge: 'Gold Certified',
      description: 'Master stage decorum, ambassador escorting, and crisis communication for VIP suites.'
    },
    {
      id: 'mod-2',
      title: 'Crowd Safety, Evacuation & Incident Reporting Level 2',
      category: 'Safety',
      enrolled: 890,
      completionRate: 94,
      duration: '60 mins',
      level: 'Mandatory',
      badge: 'DOSH Compliant',
      description: 'Standard operating procedures for stadium flow management, turnstile bottlenecks, and first aid dispatch.'
    },
    {
      id: 'mod-3',
      title: 'AV Staging, DMX Lighting & Rigging Basics',
      category: 'Technical',
      enrolled: 260,
      completionRate: 91,
      duration: '90 mins',
      level: 'Specialist',
      badge: 'Pro AV Badge',
      description: 'Hands-on hardware troubleshooting for concert stages, wireless mic frequencies, and LED wall calibration.'
    },
    {
      id: 'mod-4',
      title: 'Halal Food Handling & Banquet Hygiene Certification',
      category: 'Compliance',
      enrolled: 640,
      completionRate: 99,
      duration: '30 mins',
      level: 'Mandatory',
      badge: 'JAKIM Endorsed',
      description: 'Essential compliance protocols for Malaysian F&B events, catering temperature control, and cross-contamination prevention.'
    },
  ];

  const filteredModules = activeCategory === 'All' 
    ? modules 
    : modules.filter((m) => m.category === activeCategory);

  return (
    <div id="view-training" className="p-8 sm:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Workforce Training & Certifications
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Upskilling modules, safety accreditations, and event-readiness credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>1,840 Active Verified Badges</span>
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', 'Safety', 'Hospitality', 'Technical', 'Compliance'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat} Modules
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredModules.map((mod) => (
          <div
            key={mod.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">
                  {mod.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                  {mod.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{mod.title}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{mod.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {mod.duration}
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {mod.completionRate}% Pass
                </span>
              </div>

              <button
                onClick={() => alert(`Enrolling candidate roster in "${mod.title}" module.`)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>Assign to Staff</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
