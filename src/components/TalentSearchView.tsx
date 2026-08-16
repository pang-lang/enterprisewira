import React, { useState, useMemo } from 'react';
import { 
  Star, 
  ChevronDown, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  X,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Award,
  Filter,
  RotateCcw,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Worker, UrgentEvent } from '../types';

interface TalentSearchViewProps {
  workers: Worker[];
  events: UrgentEvent[];
  onBookWorker: (worker: Worker, eventName: string) => void;
  searchQuery?: string;
}

export const TalentSearchView: React.FC<TalentSearchViewProps> = ({
  workers,
  events,
  onBookWorker,
  searchQuery = '',
}) => {
  // Filter States
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minRate, setMinRate] = useState<number>(20);
  const [maxRate, setMaxRate] = useState<number>(50);
  const [minRating, setMinRating] = useState<number>(4.0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [minCompletedShifts, setMinCompletedShifts] = useState<number>(0);

  // Filter Modal visibility & active focus section
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [activeModalTab, setActiveModalTab] = useState<'all' | 'role' | 'location' | 'availability' | 'skills' | 'rates'>('all');

  // Booking Modal
  const [selectedBookingWorker, setSelectedBookingWorker] = useState<Worker | null>(null);
  const [targetEventName, setTargetEventName] = useState<string>(events[0]?.name || 'Samsung Product Launch');

  // Available options
  const roleOptions = [
    'All',
    'Senior Event Coordinator',
    'AV Technician',
    'Tech Presenter & Support',
    'VIP Host & Protocol Lead',
    'Usher & Registration Crew',
    'Stage Manager & VIP Host',
    'Senior Event Crew',
    'Logistics Specialist',
    'F&B Captain'
  ];

  const locationOptions = [
    'All',
    'Kuala Lumpur',
    'Petaling Jaya',
    'Shah Alam',
    'Cyberjaya',
    'Bukit Bintang',
    'KLCC Area',
    'Penang'
  ];

  const availabilityOptions = [
    { label: 'All Availability', value: 'All' },
    { label: 'Available Now', value: 'Available Now' },
    { label: 'Busy till 4PM', value: 'Busy till 4PM' },
    { label: 'Weekend Only', value: 'Weekend Only' },
    { label: 'Next 24 Hours', value: 'Next 24 Hours' }
  ];

  const allSkillsList = [
    'VIP Handling',
    'Product Demo',
    'Logistics',
    'Crowd Control',
    'Sound Systems',
    'Lighting',
    'Stage Hand',
    'Tech Events',
    'Bilingual (EN/BM)',
    'Multilingual (EN/BM/Mandarin)',
    'Usher',
    'Registration',
    'Queue Management',
    'Stage Manager',
    'Leadership',
    'First Aid',
    'Forklift',
    'Food Safety',
    'Barista',
    'Samsung Certified'
  ];

  // Helper to toggle skill in multi-select
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Quick rate preset handler
  const setRatePreset = (min: number, max: number) => {
    setMinRate(min);
    setMaxRate(max);
  };

  // Reset all filters to default
  const handleResetFilters = () => {
    setSelectedRole('All');
    setSelectedLocation('All');
    setSelectedAvailability('All');
    setSelectedSkills([]);
    setMinRate(20);
    setMaxRate(50);
    setMinRating(4.0);
    setVerifiedOnly(false);
    setMinCompletedShifts(0);
  };

  // Calculate active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedRole !== 'All') count++;
    if (selectedLocation !== 'All') count++;
    if (selectedAvailability !== 'All') count++;
    if (selectedSkills.length > 0) count += selectedSkills.length;
    if (minRate > 20 || maxRate < 50) count++;
    if (minRating > 4.0) count++;
    if (verifiedOnly) count++;
    if (minCompletedShifts > 0) count++;
    return count;
  }, [selectedRole, selectedLocation, selectedAvailability, selectedSkills, minRate, maxRate, minRating, verifiedOnly, minCompletedShifts]);

  // Filtered workers list
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      // 1. Search Query
      const matchSearch = searchQuery
        ? worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
          worker.location.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // 2. Role Filter
      const matchRole =
        selectedRole === 'All' ||
        worker.role.toLowerCase().includes(selectedRole.toLowerCase()) ||
        (selectedRole === 'Event Staff' && true);

      // 3. Location Filter
      const matchLocation =
        selectedLocation === 'All' ||
        worker.location.toLowerCase().includes(selectedLocation.toLowerCase());

      // 4. Availability Filter
      const matchAvailability =
        selectedAvailability === 'All' ||
        (selectedAvailability === 'Available Now' && worker.status === 'Available Now') ||
        (selectedAvailability === 'Busy till 4PM' && worker.status === 'Busy till 4PM') ||
        (selectedAvailability === 'Next 24 Hours' && (worker.status === 'Available Now' || worker.status === 'Busy till 4PM'));

      // 5. Skills Filter (matches if worker possesses ALL or ANY of selected skills)
      const matchSkills =
        selectedSkills.length === 0 ||
        selectedSkills.some((s) => 
          worker.skills.some(ws => ws.toLowerCase() === s.toLowerCase()) ||
          worker.certifications.some(wc => wc.toLowerCase().includes(s.toLowerCase()))
        );

      // 6. Hourly Rate Range
      const matchRate = worker.hourlyRate >= minRate && worker.hourlyRate <= maxRate;

      // 7. Rating
      const matchRating = worker.rating >= minRating;

      // 8. Verified status
      const matchVerified = !verifiedOnly || worker.verified;

      // 9. Completed shifts
      const matchShifts = worker.completedShifts >= minCompletedShifts;

      return (
        matchSearch &&
        matchRole &&
        matchLocation &&
        matchAvailability &&
        matchSkills &&
        matchRate &&
        matchRating &&
        matchVerified &&
        matchShifts
      );
    });
  }, [
    workers,
    searchQuery,
    selectedRole,
    selectedLocation,
    selectedAvailability,
    selectedSkills,
    minRate,
    maxRate,
    minRating,
    verifiedOnly,
    minCompletedShifts
  ]);

  // AI Recommended match cards (Siti Nurhaliza & Ahmad Faiz or top matching from filtered)
  const aiMatches = useMemo(() => {
    const defaultTop = workers.filter((w) => w.id === 'w-1' || w.id === 'w-2');
    if (filteredWorkers.length >= 2) {
      return filteredWorkers.slice(0, 2);
    }
    return defaultTop;
  }, [workers, filteredWorkers]);

  const handleConfirmBooking = () => {
    if (selectedBookingWorker) {
      onBookWorker(selectedBookingWorker, targetEventName);
      setSelectedBookingWorker(null);
    }
  };

  const openFilterModalAt = (tab: 'all' | 'role' | 'location' | 'availability' | 'skills' | 'rates') => {
    setActiveModalTab(tab);
    setIsFilterModalOpen(true);
  };

  return (
    <div id="view-talent-search" className="p-8 sm:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Verified Talent
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Discover top-rated professionals for your upcoming events with integrated skill, rate, and availability filtering.
          </p>
        </div>

        {/* Action Controls & Badges */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <span className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Verified Crew</span>
          </span>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            id="btn-advanced-filters"
            onClick={() => openFilterModalAt('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm relative ${
              activeFiltersCount > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-500/20'
                : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-0.5 px-2 py-0.5 rounded-full bg-white text-blue-700 text-[11px] font-extrabold shadow-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>



      {/* Active Filter Chips Bar (When filters applied) */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center flex-wrap gap-2 pt-1 pb-1 animate-in fade-in">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-600" /> Active:
          </span>

          {selectedRole !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Role: {selectedRole}
              <button onClick={() => setSelectedRole('All')} className="hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedLocation !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              Location: {selectedLocation}
              <button onClick={() => setSelectedLocation('All')} className="hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedAvailability !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              {selectedAvailability}
              <button onClick={() => setSelectedAvailability('All')} className="hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {(minRate > 20 || maxRate < 50) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              RM {minRate} - RM {maxRate}/hr
              <button onClick={() => { setMinRate(20); setMaxRate(50); }} className="hover:text-emerald-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200"
            >
              Skill: {skill}
              <button onClick={() => toggleSkill(skill)} className="hover:text-purple-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {minRating > 4.0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
              ★ {minRating}+ Rating
              <button onClick={() => setMinRating(4.0)} className="hover:text-amber-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-slate-500 hover:text-red-600 underline ml-2 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* AI Recommended Matches Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <h2 className="text-base font-bold text-slate-900">AI Recommended Matches</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Based on high completion rate & positive client ratings
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiMatches.map((talent) => (
            <div
              key={talent.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-blue-400 transition-all"
            >
              {/* Curved Match Fit Badge (Top Right) */}
              <div className="absolute top-0 right-0 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-bl-2xl font-bold text-xs flex items-center gap-1.5 border-b border-l border-blue-100/60">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 stroke-1" />
                <span>{talent.rating}</span>
                <span className="text-emerald-600 font-semibold">{talent.matchScore}% Match</span>
              </div>

              {/* Worker Info */}
              <div className="flex items-center gap-3.5 pr-28">
                <img
                  src={talent.avatar}
                  alt={talent.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{talent.name}</h3>
                    {talent.verified && (
                      <ShieldCheck className="w-4 h-4 text-blue-600 inline-block shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{talent.role} · {talent.location}</p>
                </div>
              </div>

              {/* Tags & Certifications */}
              <div className="flex flex-wrap gap-2 my-4">
                {talent.skills.slice(0, 2).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {talent.certifications.slice(0, 1).map((cert, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1"
                  >
                    <Award className="w-3 h-3" />
                    {cert}
                  </span>
                ))}
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  RM {talent.hourlyRate}/hr
                </span>
              </div>

              {/* Action Button */}
              <button
                id={`btn-book-ai-${talent.id}`}
                onClick={() => setSelectedBookingWorker(talent)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-[0.99] flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Talent</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* All Available Talent Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">All Available Talent</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtered results showing {filteredWorkers.length} talent profiles
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Showing 1-{filteredWorkers.length} of {workers.length}</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {filteredWorkers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No matching talent found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your rate limits, loosening role filters, or clearing specific skill requirements.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Worker</th>
                  <th className="py-3.5 px-6">Role & Location</th>
                  <th className="py-3.5 px-6">Skills & Badges</th>
                  <th className="py-3.5 px-6">Rate</th>
                  <th className="py-3.5 px-6">Rating</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredWorkers.map((worker) => {
                  const isAvailable = worker.status === 'Available Now';
                  const isBusy = worker.status === 'Busy till 4PM';

                  return (
                    <tr key={worker.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={worker.avatar}
                            alt={worker.name}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900">{worker.name}</p>
                              {worker.verified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-slate-400">{worker.completedShifts} shifts completed</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-slate-800">{worker.role}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {worker.location}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {worker.skills.slice(0, 2).map((s, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                            >
                              {s}
                            </span>
                          ))}
                          {worker.certifications.length > 0 && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100 flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {worker.certifications[0]}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        RM {worker.hourlyRate}<span className="text-xs font-normal text-slate-400">/hr</span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400 stroke-1" />
                          <span>{worker.rating}</span>
                          <span className="text-xs text-slate-400 font-normal">({worker.reviewCount})</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            isAvailable
                              ? 'bg-emerald-500 text-white shadow-2xs'
                              : isBusy
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {isBusy && <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>}
                          {worker.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          id={`btn-book-talent-row-${worker.id}`}
                          onClick={() => setSelectedBookingWorker(worker)}
                          className="px-4 py-1.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all active:scale-[0.98]"
                        >
                          Book Talent
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          INTEGRATED ADVANCED FILTER POPUP MODAL
          Covers: Role, Location, Availability, Skills, Rates, Ratings, & Verification
      ========================================================================= */}
      {isFilterModalOpen && (
        <div 
          id="modal-integrated-filters"
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setIsFilterModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-slate-900">Filter Verified Talent</h2>
                    {activeFiltersCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                        {activeFiltersCount} Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Refine candidates by role category, venue location, schedule, skills, and rates.
                  </p>
                </div>
              </div>

              <button
                id="btn-close-filter-modal"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-xl hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Quick Filter Sub-Tabs */}
            <div className="px-6 pt-3 pb-1 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs font-bold text-slate-500">
              <button
                onClick={() => setActiveModalTab('all')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  activeModalTab === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Sections
              </button>
              <button
                onClick={() => setActiveModalTab('role')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeModalTab === 'role'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                Role {selectedRole !== 'All' && '•'}
              </button>
              <button
                onClick={() => setActiveModalTab('location')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeModalTab === 'location'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <MapPin className="w-3 h-3" />
                Location {selectedLocation !== 'All' && '•'}
              </button>
              <button
                onClick={() => setActiveModalTab('availability')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeModalTab === 'availability'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Clock className="w-3 h-3" />
                Availability {selectedAvailability !== 'All' && '•'}
              </button>
              <button
                onClick={() => setActiveModalTab('skills')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeModalTab === 'skills'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Award className="w-3 h-3" />
                Skills {selectedSkills.length > 0 && `(${selectedSkills.length})`}
              </button>
              <button
                onClick={() => setActiveModalTab('rates')}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1 ${
                  activeModalTab === 'rates'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <DollarSign className="w-3 h-3" />
                Rates
              </button>
            </div>

            {/* Modal Body: Scrollable Form Elements */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">

              {/* 1. ROLE SELECTION */}
              {(activeModalTab === 'all' || activeModalTab === 'role') && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      Role & Specialization
                    </label>
                    <span className="text-[11px] text-slate-400">Select target event role</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {roleOptions.map((role) => {
                      const isSelected = selectedRole === role;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setSelectedRole(role)}
                          className={`p-2.5 rounded-xl text-left font-semibold text-xs transition-all border ${
                            isSelected
                              ? 'bg-blue-50 text-blue-700 border-blue-600 shadow-2xs font-bold'
                              : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100/80'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{role === 'All' ? 'All Roles (Any)' : role}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. LOCATION SELECTION */}
              {(activeModalTab === 'all' || activeModalTab === 'location') && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Location & Region
                    </label>
                    <span className="text-[11px] text-slate-400">Venue accessibility</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {locationOptions.map((loc) => {
                      const isSelected = selectedLocation === loc;
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setSelectedLocation(loc)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{loc === 'All' ? 'All Locations' : loc}</span>
                          {isSelected && <Check className="w-3 h-3 inline-block ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. AVAILABILITY SELECTION */}
              {(activeModalTab === 'all' || activeModalTab === 'availability') && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Availability Window
                    </label>
                    <span className="text-[11px] text-slate-400">Shift readiness</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availabilityOptions.map((avail) => {
                      const isSelected = selectedAvailability === avail.value;
                      return (
                        <button
                          key={avail.value}
                          type="button"
                          onClick={() => setSelectedAvailability(avail.value)}
                          className={`p-2.5 rounded-xl text-left font-semibold text-xs transition-all border ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-600 shadow-2xs font-bold'
                              : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100/80'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{avail.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. SKILLS & CREDENTIALS MULTI-SELECT */}
              {(activeModalTab === 'all' || activeModalTab === 'skills') && (
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-purple-600" />
                      Skills & Certifications ({selectedSkills.length} Selected)
                    </label>
                    {selectedSkills.length > 0 && (
                      <button
                        onClick={() => setSelectedSkills([])}
                        className="text-[11px] font-bold text-slate-400 hover:text-red-600"
                      >
                        Clear Skills
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {allSkillsList.map((skill) => {
                      const isChecked = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                            isChecked
                              ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{skill}</span>
                          {isChecked ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <span className="text-slate-400 text-[10px]">+</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. HOURLY RATES & BUDGET SLIDER */}
              {(activeModalTab === 'all' || activeModalTab === 'rates') && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Hourly Rate Range (RM / hour)
                    </label>
                    <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                      RM {minRate}.00 - RM {maxRate}.00 / hr
                    </span>
                  </div>

                  {/* Range Sliders */}
                  <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">Min Rate: RM {minRate}/hr</span>
                        <input
                          type="range"
                          min="20"
                          max="40"
                          step="1"
                          value={minRate}
                          onChange={(e) => setMinRate(Math.min(parseInt(e.target.value), maxRate - 2))}
                          className="w-full accent-blue-600 cursor-pointer"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">Max Rate: RM {maxRate}/hr</span>
                        <input
                          type="range"
                          min="30"
                          max="60"
                          step="1"
                          value={maxRate}
                          onChange={(e) => setMaxRate(Math.max(parseInt(e.target.value), minRate + 2))}
                          className="w-full accent-blue-600 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                      <span className="text-[11px] text-slate-400 font-bold mr-1">Presets:</span>
                      <button
                        type="button"
                        onClick={() => setRatePreset(20, 50)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-100"
                      >
                        All Rates
                      </button>
                      <button
                        type="button"
                        onClick={() => setRatePreset(20, 30)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-100"
                      >
                        &lt; RM 30/hr (Entry)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRatePreset(30, 40)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-100"
                      >
                        RM 30 - 40/hr (Standard)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRatePreset(40, 60)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-100"
                      >
                        RM 40+/hr (Lead Tech)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. QUALITY & VERIFICATIONS */}
              {activeModalTab === 'all' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Quality & Verification Standards
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Verified Only Toggle */}
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-bold text-slate-800 block">Wira Verified Only</span>
                          <span className="text-[10px] text-slate-400">KYC & background screened</span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded-md"
                      />
                    </label>

                    {/* Minimum Rating */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-800">Minimum Rating</span>
                        <span className="font-extrabold text-amber-600 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 stroke-1" />
                          {minRating}★
                        </span>
                      </div>
                      <input
                        type="range"
                        min="4.0"
                        max="4.9"
                        step="0.1"
                        value={minRating}
                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
                <span className="text-xs text-slate-500 hidden sm:inline-block font-semibold">
                  <strong className="text-slate-900">{filteredWorkers.length}</strong> verified talent profiles match
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-[0.98]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply Filters ({filteredWorkers.length} Matches)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Direct Booking Modal */}
      {selectedBookingWorker && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Direct Talent Booking</h3>
              <button
                onClick={() => setSelectedBookingWorker(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <img
                src={selectedBookingWorker.avatar}
                alt={selectedBookingWorker.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-slate-900">{selectedBookingWorker.name}</p>
                <p className="text-xs text-slate-500">{selectedBookingWorker.role}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-700">
                  <span className="font-semibold">Rate: RM {selectedBookingWorker.hourlyRate}/hr</span>
                  <span>·</span>
                  <span className="text-emerald-600 font-bold">{selectedBookingWorker.matchScore}% Match</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Select Target Event</label>
              <select
                value={targetEventName}
                onChange={(e) => setTargetEventName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.name}>
                    {evt.name} ({evt.date})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-800">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Shift details and venue pass instructions will be dispatched to {selectedBookingWorker.name}'s Wira mobile app immediately upon confirmation.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedBookingWorker(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
