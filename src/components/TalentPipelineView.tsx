import React, { useState } from 'react';
import { 
  Star, 
  Plus, 
  ShieldCheck, 
  Briefcase, 
  X, 
  Send,
  Calendar,
  Sparkles
} from 'lucide-react';
import { PipelineTalent, Worker } from '../types';

interface TalentPipelineViewProps {
  pipelineTalents: PipelineTalent[];
  allWorkers: Worker[];
}

export const TalentPipelineView: React.FC<TalentPipelineViewProps> = ({
  pipelineTalents,
  allWorkers,
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedCandidate, setSelectedCandidate] = useState<PipelineTalent | null>(
    pipelineTalents[0] // Default open Sarah Tan as shown in Image 11
  );
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showPostJobModal, setShowPostJobModal] = useState<boolean>(false);

  // Invite state
  const [interviewDate, setInterviewDate] = useState<string>('2024-08-28');
  const [interviewTime, setInterviewTime] = useState<string>('14:00');
  const [offeredRole, setOfferedRole] = useState<string>('Full-time Floor Manager');
  const [salaryOffer, setSalaryOffer] = useState<string>('RM 4,800 / month');
  const [inviteSuccess, setInviteSuccess] = useState<boolean>(false);

  // Filtered talent pool
  const filteredTalents = selectedStage === 'All'
    ? pipelineTalents
    : pipelineTalents.filter((t) => t.stage === selectedStage);

  const handleSendInterview = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setShowInviteModal(false);
    }, 1800);
  };

  return (
    <div id="view-talent-pipeline" className="p-8 sm:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title & Post a Job */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ready-to-Hire Talent
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Workers who have demonstrated the skills and performance required for full-time or extended employment.
          </p>
        </div>

        <button
          id="btn-post-job-top"
          onClick={() => setShowPostJobModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Post a Job</span>
        </button>
      </div>

      {/* Funnel Pipeline Flow (Image 11) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pipeline Flow</span>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Flagged', count: 24 },
            { label: 'Shortlisted', count: 12 },
            { label: 'Interview', count: 5 },
            { label: 'Offer', count: 2 },
          ].map((stage) => {
            const isSelected = selectedStage === stage.label;
            return (
              <div
                key={stage.label}
                onClick={() => setSelectedStage(isSelected ? 'All' : stage.label)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/70'
                }`}
              >
                <span className="text-xs font-medium text-slate-500 block">{stage.label}</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block tracking-tight">
                  {stage.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Table + Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Main Column: Proven Talent Pool Table */}
        <div className={`${selectedCandidate ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300`}>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Proven Talent Pool</h2>
            {selectedStage !== 'All' && (
              <button
                onClick={() => setSelectedStage('All')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Show All ({pipelineTalents.length})
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-5">Worker</th>
                  <th className="py-3 px-5">Career Level</th>
                  <th className="py-3 px-5">Track Record</th>
                  <th className="py-3 px-5">Training & Skills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredTalents.map((talent) => {
                  const isSelected = selectedCandidate?.id === talent.id;

                  return (
                    <tr
                      key={talent.id}
                      onClick={() => setSelectedCandidate(talent)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/40 font-medium' : 'hover:bg-slate-50/60'
                      }`}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={talent.avatar}
                            alt={talent.name}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 leading-snug">{talent.name}</p>
                            <p className="text-xs text-slate-400">ID: {talent.idCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-semibold text-slate-700">
                        {talent.careerLevel}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{talent.shifts} shifts</span>
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 stroke-1" />
                            {talent.rating}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                          {talent.certificationsCount} Certifications
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Slide-out Profile Drawer (Image 11) */}
        {selectedCandidate && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Header with Close */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={selectedCandidate.avatar}
                    alt={selectedCandidate.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 ring-2 ring-white">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-slate-900">{selectedCandidate.name}</h3>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      ✓ Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{selectedCandidate.careerLevel}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 gap-3 py-3 px-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed</span>
                <span className="text-base font-extrabold text-slate-900">{selectedCandidate.shifts} Shifts</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Client Rating</span>
                <span className="text-base font-extrabold text-slate-900 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 stroke-1" />
                  {selectedCandidate.rating}
                </span>
              </div>
            </div>

            {/* Recommended Roles */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Recommended Roles
              </span>
              <p className="text-xs font-bold text-blue-700 bg-blue-50/70 px-3 py-2 rounded-xl border border-blue-100">
                {selectedCandidate.recommendedRoles}
              </p>
            </div>

            {/* Career Progression */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Career Progression
              </span>
              <div className="space-y-3 text-xs pl-2 border-l-2 border-slate-200">
                <div className="relative pl-3">
                  <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100"></div>
                  <p className="font-bold text-slate-900">Senior Event Crew</p>
                  <p className="text-slate-400 text-[11px]">Current Level · Wira Platform</p>
                </div>
                <div className="relative pl-3">
                  <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                  <p className="font-semibold text-slate-600">Event Crew</p>
                  <p className="text-slate-400 text-[11px]">Completed · 45 shifts</p>
                </div>
              </div>
            </div>

            {/* Recent Major Events */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Recent Major Events
              </span>
              <div className="space-y-2 text-xs">
                {selectedCandidate.recentMajorEvents.map((event, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{event.title}</p>
                      <p className="text-[11px] text-slate-500">{event.role}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{event.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Training & Skills (Matching Sarah Tan's certs in Image 11) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Training & Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Leadership',
                  'Event Operations Masterclass',
                  'Food Hygiene',
                  'First Aid Level 3',
                  'Fire Safety',
                  'Crowd Flow Cert',
                  'Samsung Product Specialist',
                  'Brand Ambassador Cert',
                ].map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action: Invite to Interview */}
            <button
              id="btn-invite-to-interview"
              onClick={() => setShowInviteModal(true)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Invite to Interview</span>
            </button>
          </div>
        )}
      </div>

      {/* Invite to Interview Modal */}
      {showInviteModal && selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Invite {selectedCandidate.name}</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteSuccess ? (
              <div className="py-8 text-center space-y-3 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Interview Invitation Dispatched!</h4>
                <p className="text-xs text-slate-500">
                  {selectedCandidate.name} has received the calendar invite and offer package on their mobile app.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInterview} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Position</label>
                  <input
                    type="text"
                    value={offeredRole}
                    onChange={(e) => setOfferedRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Interview Date</label>
                    <input
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Time</label>
                    <input
                      type="time"
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Compensation Range</label>
                  <input
                    type="text"
                    value={salaryOffer}
                    onChange={(e) => setSalaryOffer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                  >
                    Send Official Invite
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Post a Job Modal */}
      {showPostJobModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Post Enterprise Event Job</h3>
              <button
                onClick={() => setShowPostJobModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Job / Shift Title</label>
                <input
                  type="text"
                  placeholder="e.g., Senior VIP Usher & Protocol Captain"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    defaultValue="Kuala Lumpur (KLCC)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Headcount Needed</label>
                  <input
                    type="number"
                    defaultValue="15"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Required Certifications</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['First Aid', 'VIP Etiquette', 'Halal Handling', 'Crowd Safety'].map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
                      ✓ {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowPostJobModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Job broadcasted to 1,500+ verified candidates across Klang Valley!');
                  setShowPostJobModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
              >
                Broadcast Job Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
