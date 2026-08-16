import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  MapPin, 
  Users, 
  SlidersHorizontal, 
  Star, 
  Briefcase, 
  Filter, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  X, 
  Clock, 
  Building2, 
  FileText, 
  AlertCircle, 
  Check, 
  Lock, 
  Sparkles, 
  Plus, 
  Search, 
  ChevronRight, 
  Award,
  DollarSign
} from 'lucide-react';
import { UrgentEvent } from '../types';

interface BookingItem {
  id: string;
  name: string;
  category: string;
  client: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  address: string;
  geofenceRadius: string;
  leadName: string;
  leadPhone: string;
  notes: string;
  totalWorkers: number;
  confirmedWorkers: number;
  fillRate: number;
  totalSpend: number;
  status: 'In Planning' | 'Matching Talent' | 'Live Shift' | 'Finished & Payout Pending' | 'Settled';
  initialStep: number;
  eventLifecycle: 'pending_start' | 'in_progress' | 'completed';
}

interface BookingsViewProps {
  selectedEvent: UrgentEvent | null;
  onOpenPayoutModal: () => void;
  onSelectEvent?: (event: UrgentEvent) => void;
}

interface CandidateMatch {
  id: string;
  name: string;
  avatar: string;
  available: boolean;
  rating: number;
  reviews: number;
  shifts: number;
  badges: string[];
  matchScore: number;
  hourlyRate: number;
  selected: boolean;
  assignedRole?: string;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  selectedEvent,
  onOpenPayoutModal,
  onSelectEvent,
}) => {
  // Master list of all bookings under Klook Events Malaysia
  const [allBookings, setAllBookings] = useState<BookingItem[]>([
    {
      id: 'klook-b1',
      name: 'Samsung Galaxy Unpacked Experience',
      category: 'Product Launch & Demo',
      client: 'Samsung Malaysia Electronics',
      date: '2024-08-24',
      startTime: '14:00',
      endTime: '22:00',
      venue: 'KLCC Convention Centre, Hall 1 & 2',
      address: 'Kuala Lumpur City Centre, 50088 Kuala Lumpur',
      geofenceRadius: '150m',
      leadName: 'Azlan Shah (Event Director)',
      leadPhone: '+60 12-389 9012',
      notes: 'All specialists must attend 30-min pre-shift briefing at 1:30 PM. Smart all-black attire required.',
      totalWorkers: 12,
      confirmedWorkers: 12,
      fillRate: 100,
      totalSpend: 3081,
      status: 'Matching Talent',
      initialStep: 3,
      eventLifecycle: 'pending_start',
    },
    {
      id: 'klook-b2',
      name: 'BMW Electrified Experience Tour 2024',
      category: 'VIP Gala & Hospitality',
      client: 'BMW Group Malaysia',
      date: '2024-08-28',
      startTime: '09:00',
      endTime: '18:00',
      venue: 'The MET Corporate Towers, Mont Kiara',
      address: 'No 20, Jalan Dutamas 2, 50480 Kuala Lumpur',
      geofenceRadius: '100m',
      leadName: 'Karen Chew (Senior Ops)',
      leadPhone: '+60 19-224 8819',
      notes: 'VIP greeting protocol and luxury vehicle feature briefing provided onsite.',
      totalWorkers: 15,
      confirmedWorkers: 11,
      fillRate: 73,
      totalSpend: 4250,
      status: 'Matching Talent',
      initialStep: 3,
      eventLifecycle: 'pending_start',
    },
    {
      id: 'klook-b3',
      name: 'TechFest Asia Innovation Summit',
      category: 'Corporate Exhibition & Summit',
      client: 'TechFest Asia Pte Ltd',
      date: '2024-08-20',
      startTime: '08:00',
      endTime: '17:00',
      venue: 'MITEC, Kuala Lumpur',
      address: '8, Jalan Dutamas 2, Kompleks Kerajaan, 50480 Kuala Lumpur',
      geofenceRadius: '300m',
      leadName: 'Marcus Tan',
      leadPhone: '+60 17-889 1234',
      notes: 'Keynote hall management and registration badges scanning.',
      totalWorkers: 20,
      confirmedWorkers: 20,
      fillRate: 100,
      totalSpend: 5400,
      status: 'Finished & Payout Pending',
      initialStep: 4,
      eventLifecycle: 'completed',
    },
    {
      id: 'klook-b4',
      name: 'Heineken Live Sounds Music Festival',
      category: 'Concert & Live Festival',
      client: 'Heineken Malaysia',
      date: '2024-09-02',
      startTime: '16:00',
      endTime: '23:30',
      venue: 'Sepang International Circuit',
      address: '27, 64000 Sepang, Selangor',
      geofenceRadius: '300m',
      leadName: 'Rayyan Hakim',
      leadPhone: '+60 11-554 9901',
      notes: 'Crowd management and beverage station support specialists.',
      totalWorkers: 25,
      confirmedWorkers: 8,
      fillRate: 32,
      totalSpend: 6800,
      status: 'In Planning',
      initialStep: 1,
      eventLifecycle: 'pending_start',
    },
  ]);

  // View state: 'list' (All Bookings Hub) vs 'pipeline' (4-Step Wizard)
  const [viewMode, setViewMode] = useState<'list' | 'pipeline'>('list');
  const [selectedBookingId, setSelectedBookingId] = useState<string>('klook-b1');

  // Search and filter for All Bookings master list
  const [listSearch, setListSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Active step in the booking wizard: 1: Event Details, 2: Requirements, 3: Recommended Talent, 4: Confirm Roster
  const [activeStep, setActiveStep] = useState<number>(3);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  // Retrieve current active booking
  const activeBooking = allBookings.find((b) => b.id === selectedBookingId) || allBookings[0];

  // Step 1: Event Details Form State
  const [eventDetails, setEventDetails] = useState({
    name: activeBooking.name,
    category: activeBooking.category,
    client: activeBooking.client,
    date: activeBooking.date,
    startTime: activeBooking.startTime,
    endTime: activeBooking.endTime,
    venue: activeBooking.venue,
    address: activeBooking.address,
    geofenceRadius: activeBooking.geofenceRadius,
    leadName: activeBooking.leadName,
    leadPhone: activeBooking.leadPhone,
    notes: activeBooking.notes,
  });

  // Step 2: Requirements Form State
  const [requirements, setRequirements] = useState({
    totalWorkers: activeBooking.totalWorkers,
    supervisorsNeeded: 2,
    productSpecialistsNeeded: 6,
    registrationCrewNeeded: 4,
    dressCode: 'Smart Casual All-Black (Collared Shirt, Trousers & Dark Shoes)',
    languages: ['English', 'Bahasa Malaysia', 'Mandarin'],
    certifications: ['Samsung Certified Product Masterclass', 'VIP Protocol & Hospitality', 'POS & Cash Handling'],
    hourlyBudgetMax: 40,
    hourlyBudgetMin: 30,
    experienceLevel: '2+ Years in Tech / Consumer Electronics',
  });

  // Available cert options for toggling
  const availableCerts = [
    'Samsung Certified Product Masterclass',
    'VIP Protocol & Hospitality',
    'POS & Cash Handling',
    'Food Hygiene & Typhoid Certified',
    'First Aid & Safety Responder',
    'Crowd Management Level 1',
  ];

  const availableLanguages = [
    'English',
    'Bahasa Malaysia',
    'Mandarin',
    'Cantonese',
    'Tamil',
  ];

  // AI Weighting parameters
  const [aiParams, setAiParams] = useState({
    skillMatch: 90,
    experienceWeight: 80,
    distanceProximity: 70,
    pastRatingWeight: 85,
  });

  // Recommended candidates list
  const [candidates, setCandidates] = useState<CandidateMatch[]>([
    {
      id: 'c-1',
      name: 'Siti Nurhaliza',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      available: true,
      rating: 4.9,
      reviews: 84,
      shifts: 120,
      badges: ['Samsung Certified', 'Product Demo', 'VIP Protocol'],
      matchScore: 98,
      hourlyRate: 35,
      selected: true,
      assignedRole: 'Lead Product Specialist',
    },
    {
      id: 'c-2',
      name: 'Ahmad Hafiz',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      available: true,
      rating: 4.8,
      reviews: 52,
      shifts: 95,
      badges: ['Tech Events', 'Bilingual (EN/BM)', 'POS & Cash'],
      matchScore: 95,
      hourlyRate: 32,
      selected: true,
      assignedRole: 'Floor Supervisor',
    },
    {
      id: 'c-3',
      name: 'Michelle Lee',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      available: true,
      rating: 4.7,
      reviews: 110,
      shifts: 150,
      badges: ['Hospitality', 'VIP Handling', 'Mandarin Fluent'],
      matchScore: 88,
      hourlyRate: 38,
      selected: false,
      assignedRole: 'VIP Registration Host',
    },
    {
      id: 'c-4',
      name: 'Darren Wong',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      available: true,
      rating: 4.9,
      reviews: 64,
      shifts: 70,
      badges: ['Registration Lead', 'Troubleshooting', 'Tech Demo'],
      matchScore: 92,
      hourlyRate: 30,
      selected: false,
      assignedRole: 'Experience Zone Specialist',
    },
  ]);

  // Step 4: Event Lifecycle State ('pending_start' | 'in_progress' | 'completed')
  const [eventStatus, setEventStatus] = useState<'pending_start' | 'in_progress' | 'completed'>(
    activeBooking.eventLifecycle
  );

  // Switch active booking in pipeline
  const handleOpenBookingPipeline = (booking: BookingItem, step?: number) => {
    setSelectedBookingId(booking.id);
    setEventDetails({
      name: booking.name,
      category: booking.category,
      client: booking.client,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      venue: booking.venue,
      address: booking.address,
      geofenceRadius: booking.geofenceRadius,
      leadName: booking.leadName,
      leadPhone: booking.leadPhone,
      notes: booking.notes,
    });
    setRequirements((prev) => ({
      ...prev,
      totalWorkers: booking.totalWorkers,
    }));
    setEventStatus(booking.eventLifecycle);
    setActiveStep(step || booking.initialStep);
    setViewMode('pipeline');
  };

  // Quick create new booking
  const handleCreateNewBooking = () => {
    const newId = `klook-b${Date.now()}`;
    const newBooking: BookingItem = {
      id: newId,
      name: 'New Corporate Brand Activation',
      category: 'Product Launch & Demo',
      client: 'Klook Events Malaysia Client',
      date: '2024-09-10',
      startTime: '10:00',
      endTime: '18:00',
      venue: 'Pavilion Kuala Lumpur, Main Atrium',
      address: '168, Jalan Bukit Bintang, 55100 Kuala Lumpur',
      geofenceRadius: '150m',
      leadName: 'Ops Coordinator',
      leadPhone: '+60 12-000 0000',
      notes: 'Standard event staff onboarding and briefing.',
      totalWorkers: 10,
      confirmedWorkers: 0,
      fillRate: 0,
      totalSpend: 2800,
      status: 'In Planning',
      initialStep: 1,
      eventLifecycle: 'pending_start',
    };

    setAllBookings([newBooking, ...allBookings]);
    handleOpenBookingPipeline(newBooking, 1);
  };

  const toggleSelectCandidate = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const selectAll = () => {
    const allSelected = candidates.every((c) => c.selected);
    setCandidates((prev) => prev.map((c) => ({ ...c, selected: !allSelected })));
  };

  const toggleCert = (cert: string) => {
    setRequirements((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const toggleLanguage = (lang: string) => {
    setRequirements((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const selectedCount = candidates.filter((c) => c.selected).length;
  const baseConfirmed = 10;
  const currentTotal = baseConfirmed + selectedCount;
  const totalStaffRequired = requirements.totalWorkers;
  const fulfillmentPercentage = Math.min(100, Math.round((currentTotal / totalStaffRequired) * 100));

  // Step progression status flags
  const isStep1Complete = Boolean(eventDetails.name && eventDetails.venue && eventDetails.date);
  const isStep2Complete = Boolean(requirements.totalWorkers > 0 && requirements.certifications.length > 0);
  const isStep3Complete = currentTotal >= totalStaffRequired;

  // Filtered list for "All Bookings" table
  const filteredBookingsList = allBookings.filter((b) => {
    const matchQuery =
      b.name.toLowerCase().includes(listSearch.toLowerCase()) ||
      b.venue.toLowerCase().includes(listSearch.toLowerCase()) ||
      b.client.toLowerCase().includes(listSearch.toLowerCase());

    const matchStatus =
      statusFilter === 'All' ||
      (statusFilter === 'In Planning' && b.status === 'In Planning') ||
      (statusFilter === 'Matching Talent' && b.status === 'Matching Talent') ||
      (statusFilter === 'Live Shift' && b.status === 'Live Shift') ||
      (statusFilter === 'Finished' && (b.status === 'Finished & Payout Pending' || b.status === 'Settled'));

    return matchQuery && matchStatus;
  });

  return (
    <div id="view-bookings" className="p-8 sm:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* =========================================================================
          VIEW MODE 1: ALL KLOOK ENTERPRISE BOOKINGS (MASTER LIST)
      ========================================================================= */}
      {viewMode === 'list' && (
        <div className="space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                All Enterprise Event Bookings
              </h1>
              <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
                Manage upcoming staffing rosters, track live check-ins, and authorize batch settlements.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
              <span className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                {allBookings.length} Active Bookings
              </span>
              <button
                id="btn-create-new-booking"
                onClick={handleCreateNewBooking}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Booking</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards for Klook Bookings */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-slate-400 block">Total Staffing Headcount</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {allBookings.reduce((sum, b) => sum + b.totalWorkers, 0)} <span className="text-xs font-medium text-slate-400">Specialists</span>
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-slate-400 block">Avg Fill Rate</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {Math.round(
                  allBookings.reduce((sum, b) => sum + b.fillRate, 0) / allBookings.length
                )}%
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-slate-400 block">Total Committed Budget</span>
              <p className="text-2xl font-black text-slate-900 mt-1">
                RM {allBookings.reduce((sum, b) => sum + b.totalSpend, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-slate-400 block">Payouts Pending</span>
              <p className="text-2xl font-black text-amber-600 mt-1">
                {allBookings.filter((b) => b.status === 'Finished & Payout Pending').length} <span className="text-xs font-medium text-slate-400">Ready</span>
              </p>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search event name, venue, client..."
                value={listSearch}
                onChange={(e) => setListSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs font-bold">
              {['All', 'In Planning', 'Matching Talent', 'Finished'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* All Bookings Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3.5 px-6">Event & Client</th>
                    <th className="py-3.5 px-6">Date & Venue</th>
                    <th className="py-3.5 px-6">Roster Fulfillment</th>
                    <th className="py-3.5 px-6">Total Budget</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredBookingsList.map((booking) => {
                    const isFinished = booking.status === 'Finished & Payout Pending';
                    const isMatching = booking.status === 'Matching Talent';

                    return (
                      <tr key={booking.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Event Name & Category */}
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-bold text-slate-900 text-sm leading-snug">{booking.name}</p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                              <span className="font-medium text-slate-600">{booking.client}</span>
                              <span>·</span>
                              <span className="text-[11px] text-blue-600 font-semibold">{booking.category}</span>
                            </div>
                          </div>
                        </td>

                        {/* Date & Venue */}
                        <td className="py-4 px-6">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-blue-600" />
                              {booking.date} ({booking.startTime} - {booking.endTime})
                            </p>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {booking.venue}
                            </p>
                          </div>
                        </td>

                        {/* Roster Fulfillment */}
                        <td className="py-4 px-6">
                          <div className="space-y-1.5 w-36">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-slate-800">
                                {booking.confirmedWorkers}/{booking.totalWorkers} Staff
                              </span>
                              <span className="text-emerald-600">{booking.fillRate}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                style={{ width: `${booking.fillRate}%` }}
                                className={`h-full rounded-full ${
                                  booking.fillRate >= 90
                                    ? 'bg-emerald-600'
                                    : booking.fillRate >= 60
                                    ? 'bg-blue-600'
                                    : 'bg-amber-500'
                                }`}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* Budget */}
                        <td className="py-4 px-6 font-bold text-slate-900">
                          RM {booking.totalSpend.toLocaleString()}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                              isFinished
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : isMatching
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <button
                            id={`btn-open-booking-${booking.id}`}
                            onClick={() => handleOpenBookingPipeline(booking)}
                            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5 active:scale-[0.98]"
                          >
                            <span>Manage Pipeline</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: BOOKING PROGRESS PIPELINE (4-STEP WIZARD)
      ========================================================================= */}
      {viewMode === 'pipeline' && (
        <div className="space-y-8">
          {/* Back to All Bookings Breadcrumb & Top Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <button
                id="btn-back-to-all-bookings"
                onClick={() => setViewMode('list')}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5 shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Bookings</span>
              </button>

              <div className="h-5 w-px bg-slate-300"></div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Booking Pipeline
                </span>
                <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                  {eventDetails.name}
                </h2>
              </div>
            </div>

            {/* Quick Switcher / Status Banner */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                {activeStep === 1 && 'Step 1: Event Details'}
                {activeStep === 2 && 'Step 2: Requirements'}
                {activeStep === 3 && 'Step 3: Recommended Talent'}
                {activeStep === 4 && 'Step 4: Confirm Roster & Payout'}
              </span>

              {activeStep === 3 && (
                <button
                  id="btn-adjust-ai-parameters"
                  onClick={() => setShowAiModal(true)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-blue-200/80 shadow-2xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>AI Parameters</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Grid: Left Stepper & Summary vs Right Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Booking Progress & Event Summary */}
            <div className="lg:col-span-4 space-y-6">
              {/* Booking Progress Stepper */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900">Booking Progress</h2>
                  <span className="text-xs font-bold text-slate-400">Step {activeStep} of 4</span>
                </div>
                
                <div className="space-y-4">
                  {/* Step 1: Event Details */}
                  <div
                    id="stepper-step-1"
                    onClick={() => setActiveStep(1)}
                    className={`flex items-start gap-3 cursor-pointer p-2.5 rounded-xl transition-all ${
                      activeStep === 1
                        ? 'bg-blue-50/70 border border-blue-200/60'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isStep1Complete && activeStep > 1 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : activeStep === 1 ? (
                        <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold ${activeStep === 1 ? 'text-blue-700 font-bold' : 'text-slate-900'}`}>
                          1. Event Details
                        </p>
                        <span className={`text-[11px] font-bold ${
                          isStep1Complete && activeStep > 1 ? 'text-emerald-600' : activeStep === 1 ? 'text-blue-600' : 'text-slate-400'
                        }`}>
                          {isStep1Complete && activeStep > 1 ? 'Completed' : activeStep === 1 ? 'Editing' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Venue, date & shift times</p>
                    </div>
                  </div>

                  {/* Step 2: Requirements */}
                  <div
                    id="stepper-step-2"
                    onClick={() => setActiveStep(2)}
                    className={`flex items-start gap-3 cursor-pointer p-2.5 rounded-xl transition-all ${
                      activeStep === 2
                        ? 'bg-blue-50/70 border border-blue-200/60'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isStep2Complete && activeStep > 2 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : activeStep === 2 ? (
                        <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold ${activeStep === 2 ? 'text-blue-700 font-bold' : 'text-slate-900'}`}>
                          2. Requirements
                        </p>
                        <span className={`text-[11px] font-bold ${
                          isStep2Complete && activeStep > 2 ? 'text-emerald-600' : activeStep === 2 ? 'text-blue-600' : 'text-slate-400'
                        }`}>
                          {isStep2Complete && activeStep > 2 ? 'Completed' : activeStep === 2 ? 'Editing' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Roles, badges & criteria</p>
                    </div>
                  </div>

                  {/* Step 3: Recommended Talent */}
                  <div
                    id="stepper-step-3"
                    onClick={() => setActiveStep(3)}
                    className={`flex items-start gap-3 cursor-pointer p-2.5 rounded-xl transition-all ${
                      activeStep === 3
                        ? 'bg-blue-50/70 border border-blue-200/60'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isStep3Complete && activeStep > 3 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : activeStep === 3 ? (
                        <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold ${activeStep === 3 ? 'text-blue-700 font-bold' : 'text-slate-900'}`}>
                          3. Recommended Talent
                        </p>
                        <span className={`text-[11px] font-bold ${
                          isStep3Complete && activeStep > 3 ? 'text-emerald-600' : activeStep === 3 ? 'text-blue-600' : 'text-slate-400'
                        }`}>
                          {isStep3Complete && activeStep > 3 ? 'Completed' : activeStep === 3 ? 'In Progress' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">AI match score & selection</p>
                    </div>
                  </div>

                  {/* Step 4: Confirm Roster & Shift Authorization */}
                  <div
                    id="stepper-step-4"
                    onClick={() => setActiveStep(4)}
                    className={`flex items-start gap-3 cursor-pointer p-2.5 rounded-xl transition-all ${
                      activeStep === 4
                        ? 'bg-blue-50/70 border border-blue-200/60'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="mt-0.5">
                      {eventStatus === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : activeStep === 4 ? (
                        <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold ${activeStep === 4 ? 'text-blue-700 font-bold' : 'text-slate-900'}`}>
                          4. Confirm Roster
                        </p>
                        <span className={`text-[11px] font-bold ${
                          eventStatus === 'completed' ? 'text-emerald-600' : activeStep === 4 ? 'text-blue-600' : 'text-slate-400'
                        }`}>
                          {eventStatus === 'completed' ? 'Paid & Done' : eventStatus === 'in_progress' ? 'Live Shift' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Lock shift & payout authorization</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Summary Quick View */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-slate-900">Event Snapshot</h2>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200/60">
                    {eventDetails.category}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Event Name</span>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{eventDetails.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Date</span>
                      <p className="font-semibold text-slate-800">{eventDetails.date}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Shift Timing</span>
                      <p className="font-semibold text-slate-800">{eventDetails.startTime} - {eventDetails.endTime}</p>
                    </div>
                  </div>

                  <div className="text-slate-700">
                    <span className="text-slate-400 block text-[11px]">Venue & Geofence</span>
                    <p className="font-medium text-slate-800 leading-snug">{eventDetails.venue}</p>
                    <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Radius: {eventDetails.geofenceRadius} GPS radius</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Fulfillment Status</span>
                    <span className="text-sm font-extrabold text-emerald-600">
                      {currentTotal} / {totalStaffRequired} Specialists
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Step View Content */}
            <div className="lg:col-span-8 space-y-6">

              {/* =========================================================================
                  STEP 1: EVENT DETAILS & VENUE LOGISTICS
              ========================================================================= */}
              {activeStep === 1 && (
                <div id="step-1-container" className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Step 1: Event Details & Schedule</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Specify event timing, client profile, and geo-fenced check-in boundaries.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200/80">
                      Event Config
                    </span>
                  </div>

                  {/* Form Controls */}
                  <div className="space-y-4 text-xs">
                    {/* Event Name & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Event Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="input-event-name"
                          type="text"
                          value={eventDetails.name}
                          onChange={(e) => setEventDetails({ ...eventDetails, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                          placeholder="e.g. Samsung Galaxy Launch"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Event Category
                        </label>
                        <select
                          id="select-event-category"
                          value={eventDetails.category}
                          onChange={(e) => setEventDetails({ ...eventDetails, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                        >
                          <option value="Product Launch & Demo">Product Launch & Demo</option>
                          <option value="Corporate Exhibition & Summit">Corporate Exhibition & Summit</option>
                          <option value="Concert & Live Festival">Concert & Live Festival</option>
                          <option value="VIP Gala & Hospitality">VIP Gala & Hospitality</option>
                          <option value="Trade Fair & Registration">Trade Fair & Registration</option>
                        </select>
                      </div>
                    </div>

                    {/* Date & Shift Times */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Event Date</label>
                        <div className="relative">
                          <input
                            id="input-event-date"
                            type="date"
                            value={eventDetails.date}
                            onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Shift Start Time</label>
                        <input
                          id="input-start-time"
                          type="time"
                          value={eventDetails.startTime}
                          onChange={(e) => setEventDetails({ ...eventDetails, startTime: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Shift End Time</label>
                        <input
                          id="input-end-time"
                          type="time"
                          value={eventDetails.endTime}
                          onChange={(e) => setEventDetails({ ...eventDetails, endTime: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Venue & Geofence Radius */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="font-bold text-slate-700 block mb-1">
                          Venue / Hall Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="input-venue"
                          type="text"
                          value={eventDetails.venue}
                          onChange={(e) => setEventDetails({ ...eventDetails, venue: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                          placeholder="e.g. KLCC Convention Centre, Hall 1"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">QR Geofence Radius</label>
                        <select
                          id="select-geofence"
                          value={eventDetails.geofenceRadius}
                          onChange={(e) => setEventDetails({ ...eventDetails, geofenceRadius: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                        >
                          <option value="100m">100m (Strict Hall Check-in)</option>
                          <option value="150m">150m (Standard Perimeter)</option>
                          <option value="300m">300m (Complex / Campus)</option>
                        </select>
                      </div>
                    </div>

                    {/* Special Instructions & Briefing notes */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Briefing Notes & Arrival Guidelines</label>
                      <textarea
                        id="textarea-briefing-notes"
                        rows={3}
                        value={eventDetails.notes}
                        onChange={(e) => setEventDetails({ ...eventDetails, notes: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                        placeholder="Enter briefing notes, gate access codes, and dress instructions for dispatched workers."
                      />
                    </div>
                  </div>

                  {/* Action Buttons for Step 1 */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setEventDetails({
                          name: 'Samsung Galaxy Unpacked Experience',
                          category: 'Product Launch & Demo',
                          client: 'Samsung Malaysia Electronics',
                          date: '2024-08-24',
                          startTime: '14:00',
                          endTime: '22:00',
                          venue: 'KLCC Convention Centre, Hall 1 & 2',
                          address: 'Kuala Lumpur City Centre, 50088 Kuala Lumpur',
                          geofenceRadius: '150m',
                          leadName: 'Azlan Shah (Event Director)',
                          leadPhone: '+60 12-389 9012',
                          notes: 'All specialists must attend 30-min pre-shift briefing at 1:30 PM. Smart all-black attire required.',
                        });
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all"
                    >
                      Reset Defaults
                    </button>

                    <button
                      id="btn-proceed-to-requirements"
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-[0.98]"
                    >
                      <span>Save & Proceed to Requirements</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  STEP 2: STAFFING REQUIREMENTS & QUALIFICATIONS
              ========================================================================= */}
              {activeStep === 2 && (
                <div id="step-2-container" className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Step 2: Staffing Requirements & Roles</h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Define headcount targets, required certifications, language criteria, and budget caps.
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-xl border border-purple-200/80">
                      Talent Criteria
                    </span>
                  </div>

                  {/* Headcount Breakdown Grid */}
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-800 block mb-2">Headcount Allocation by Role</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-bold text-slate-800">Lead Supervisors</span>
                            <span className="font-bold text-blue-600">RM 35-40/hr</span>
                          </div>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={requirements.supervisorsNeeded}
                            onChange={(e) => setRequirements({ ...requirements, supervisorsNeeded: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-900"
                          />
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-bold text-slate-800">Product Specialists</span>
                            <span className="font-bold text-blue-600">RM 32-35/hr</span>
                          </div>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={requirements.productSpecialistsNeeded}
                            onChange={(e) => setRequirements({ ...requirements, productSpecialistsNeeded: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-900"
                          />
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-bold text-slate-800">Registration / Ushers</span>
                            <span className="font-bold text-blue-600">RM 28-32/hr</span>
                          </div>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={requirements.registrationCrewNeeded}
                            onChange={(e) => setRequirements({ ...requirements, registrationCrewNeeded: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-900"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        Total Headcount Target: <strong className="text-slate-900">{requirements.supervisorsNeeded + requirements.productSpecialistsNeeded + requirements.registrationCrewNeeded} Specialists</strong>
                      </p>
                    </div>

                    {/* Required Certifications Chips */}
                    <div>
                      <label className="font-bold text-slate-800 block mb-1.5">
                        Mandatory Credentials & Badges (AI will filter verified holders)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableCerts.map((cert) => {
                          const isSelected = requirements.certifications.includes(cert);
                          return (
                            <button
                              key={cert}
                              type="button"
                              onClick={() => toggleCert(cert)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>{cert}</span>
                              {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Language Proficiencies */}
                    <div>
                      <label className="font-bold text-slate-800 block mb-1.5">
                        Required Languages & Dialects
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {availableLanguages.map((lang) => {
                          const isSelected = requirements.languages.includes(lang);
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => toggleLanguage(lang)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                                isSelected
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{lang}</span>
                              {isSelected && <Check className="w-3 h-3 inline-block ml-1" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Attire & Dress Code */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Event Uniform & Attire Requirements
                      </label>
                      <input
                        type="text"
                        value={requirements.dressCode}
                        onChange={(e) => setRequirements({ ...requirements, dressCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Action Buttons for Step 2 */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Event Details</span>
                    </button>

                    <button
                      id="btn-run-ai-matching"
                      type="button"
                      onClick={() => setActiveStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-[0.98]"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Run AI Talent Matching & Proceed</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  STEP 3: RECOMMENDED TALENT (AI Matching & Selection)
              ========================================================================= */}
              {activeStep === 3 && (
                <div id="step-3-container" className="space-y-5">
                  {/* Roster Progress Status Bar */}
                  <div className="bg-emerald-50/60 border border-emerald-200/90 rounded-2xl p-5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {currentTotal} / {totalStaffRequired} Confirmed
                        </h3>
                        <p className="text-xs text-slate-600">
                          {totalStaffRequired - currentTotal <= 0
                            ? 'Roster fully staffed! Proceed to lock the roster and review budget.'
                            : `Select ${totalStaffRequired - currentTotal} more candidates to complete roster.`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-lg font-extrabold text-slate-900 block leading-none">
                            {fulfillmentPercentage}%
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            FULFILLMENT
                          </span>
                        </div>
                        <button 
                          onClick={() => setShowAiModal(true)}
                          className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
                        >
                          <Filter className="w-3.5 h-3.5" />
                          <span>Match Weights</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        style={{ width: `${fulfillmentPercentage}%` }}
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      ></div>
                    </div>
                  </div>

                  {/* Candidates Header & Select All */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">AI Recommended Matches</h2>
                      <p className="text-xs text-slate-500">Filtered by {requirements.certifications.length} required certifications and 4.7★+ rating.</p>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={candidates.every((c) => c.selected)}
                        onChange={selectAll}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span>Select All Displayed</span>
                    </label>
                  </div>

                  {/* Candidate Cards List */}
                  <div className="space-y-3">
                    {candidates.map((cand) => {
                      const isChecked = cand.selected;

                      return (
                        <div
                          key={cand.id}
                          onClick={() => toggleSelectCandidate(cand.id)}
                          className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all ${
                            isChecked
                              ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/10'
                              : 'border-slate-200/90 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {/* Checkbox */}
                            <div className="shrink-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}} // handled by parent container click
                                className="w-5 h-5 rounded-md text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                              />
                            </div>

                            {/* Avatar */}
                            <img
                              src={cand.avatar}
                              alt={cand.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                            />

                            {/* Info */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-slate-900 text-base">{cand.name}</h3>
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                  Available
                                </span>
                                {cand.assignedRole && (
                                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                                    {cand.assignedRole}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 stroke-1" />
                                  {cand.rating} ({cand.reviews} reviews)
                                </span>
                                <span>·</span>
                                <span className="flex items-center gap-1 text-slate-600">
                                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                                  {cand.shifts} Shifts
                                </span>
                                <span>·</span>
                                <span className="font-bold text-slate-900">
                                  RM {cand.hourlyRate}/hr
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Badges and Match Score */}
                          <div className="flex items-center justify-between sm:justify-end gap-4 pl-8 sm:pl-0">
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5">
                              {cand.badges.map((b, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>

                            {/* Match Fit */}
                            <div className="text-right shrink-0">
                              <span className="text-xl font-black text-emerald-600 leading-tight block">
                                {cand.matchScore}%
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                                AI Match Fit
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Navigation Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Requirements</span>
                    </button>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-semibold text-slate-500">
                        {selectedCount} candidates selected ({currentTotal}/{totalStaffRequired})
                      </span>

                      <button
                        id="btn-proceed-to-confirm-roster"
                        type="button"
                        onClick={() => setActiveStep(4)}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-[0.98]"
                      >
                        <span>Proceed to Confirm Roster</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  STEP 4: CONFIRM ROSTER & SHIFT FINISH AUTHORIZATION FOR PAYOUT
              ========================================================================= */}
              {activeStep === 4 && (
                <div id="step-4-container" className="space-y-6">
                  {/* Event Status Control Banner */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    eventStatus === 'completed'
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : eventStatus === 'in_progress'
                      ? 'bg-blue-50/70 border-blue-200'
                      : 'bg-amber-50/70 border-amber-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            eventStatus === 'completed'
                              ? 'bg-emerald-600'
                              : eventStatus === 'in_progress'
                              ? 'bg-blue-600 animate-pulse'
                              : 'bg-amber-500'
                          }`}></span>
                          <h3 className="text-base font-extrabold text-slate-900">
                            {eventStatus === 'completed' && 'Event Concluded — Timesheets Verified'}
                            {eventStatus === 'in_progress' && 'Live Shift in Progress (KLCC Hall 1 & 2)'}
                            {eventStatus === 'pending_start' && 'Roster Confirmed — Awaiting Event Shift Start'}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-600">
                          {eventStatus === 'completed' && 'All 12 specialists have completed shifts. Batch payout is now unlocked for disbursement.'}
                          {eventStatus === 'in_progress' && '12/12 specialists checked in via GPS geofence. Mark finished when shift ends.'}
                          {eventStatus === 'pending_start' && 'Shifts commence on event date. Payout unlocks once the event is marked as finished.'}
                        </p>
                      </div>

                      {/* Event Lifecycle Buttons */}
                      <div className="flex items-center gap-2">
                        {eventStatus === 'pending_start' && (
                          <button
                            id="btn-start-event-shift"
                            onClick={() => setEventStatus('in_progress')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Start Event Shifts</span>
                          </button>
                        )}

                        {eventStatus === 'in_progress' && (
                          <button
                            id="btn-finish-event-shift"
                            onClick={() => setEventStatus('completed')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Event as Finished</span>
                          </button>
                        )}

                        {eventStatus === 'completed' && (
                          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>Shift Completed</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Confirmed Roster Table */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">Confirmed Shift Roster (12 Specialists)</h3>
                        <p className="text-xs text-slate-500">Samsung Product Launch · KLCC Hall 1 & 2 · 8 Hours Shift</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200">
                        100% Filled
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      {[
                        { name: 'Siti Nurhaliza', role: 'Lead Product Specialist', rate: 'RM 35/hr', hours: '8 hrs', total: 'RM 280.00', status: 'Checked In 13:45' },
                        { name: 'Ahmad Hafiz', role: 'Floor Supervisor', rate: 'RM 32/hr', hours: '8 hrs', total: 'RM 256.00', status: 'Checked In 13:30' },
                        { name: 'Michelle Lee', role: 'VIP Registration Host', rate: 'RM 38/hr', hours: '8 hrs', total: 'RM 304.00', status: 'Checked In 13:40' },
                        { name: 'Darren Wong', role: 'Experience Zone Specialist', rate: 'RM 30/hr', hours: '8 hrs', total: 'RM 240.00', status: 'Checked In 13:50' },
                      ].map((member, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                              {member.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{member.name}</p>
                              <p className="text-slate-500 text-[11px]">{member.role}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <span className="font-bold text-slate-800 block">{member.rate}</span>
                              <span className="text-slate-400 text-[11px]">{member.hours}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-slate-900 block">{member.total}</span>
                              <span className="text-emerald-600 font-semibold text-[10px]">{member.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Settlement & Authorization Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-slate-900 text-base">Settlement Summary & Disbursement</h3>
                      </div>
                      <span className="text-xs font-bold text-slate-400">PayNet Rail: DuitNow Instant</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-slate-400 block font-medium">Total Specialists</span>
                        <p className="text-lg font-black text-slate-900 mt-0.5">12 Specialists</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-slate-400 block font-medium">Total Shift Hours</span>
                        <p className="text-lg font-black text-slate-900 mt-0.5">96.0 Total Hours</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
                        <span className="text-emerald-700 block font-medium">Calculated Compensation</span>
                        <p className="text-lg font-black text-emerald-800 mt-0.5">RM 3,081.00</p>
                      </div>
                    </div>

                    {/* Authorization Action Section */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-xs text-slate-500">
                        {eventStatus === 'completed' ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Event finished & timesheets certified. Authorize instant batch payout.
                          </span>
                        ) : (
                          <span className="text-amber-600 font-semibold flex items-center gap-1">
                            <Lock className="w-4 h-4" />
                            Payout authorization locked until event completes its shift.
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveStep(3)}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
                        >
                          Back to Talent
                        </button>

                        <button
                          id="btn-authorize-batch-payout"
                          disabled={eventStatus !== 'completed'}
                          onClick={onOpenPayoutModal}
                          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                            eventStatus === 'completed'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-[0.98]'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                          }`}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Authorize Batch Payout (RM 3,081.00)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          AI PARAMETERS TUNING MODAL
      ========================================================================= */}
      {showAiModal && (
        <div 
          id="modal-ai-parameters"
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
          onClick={() => setShowAiModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Adjust AI Matching Weights</h3>
              </div>
              <button 
                onClick={() => setShowAiModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">Skill & Badge Match Weight</span>
                  <span className="text-blue-600">{aiParams.skillMatch}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={aiParams.skillMatch}
                  onChange={(e) => setAiParams({...aiParams, skillMatch: parseInt(e.target.value)})}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">Experience & Shift Count</span>
                  <span className="text-blue-600">{aiParams.experienceWeight}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={aiParams.experienceWeight}
                  onChange={(e) => setAiParams({...aiParams, experienceWeight: parseInt(e.target.value)})}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">Proximity to KLCC Venue</span>
                  <span className="text-blue-600">{aiParams.distanceProximity}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={aiParams.distanceProximity}
                  onChange={(e) => setAiParams({...aiParams, distanceProximity: parseInt(e.target.value)})}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-700">Client Rating Priority (4.8★+)</span>
                  <span className="text-blue-600">{aiParams.pastRatingWeight}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="100" 
                  value={aiParams.pastRatingWeight}
                  onChange={(e) => setAiParams({...aiParams, pastRatingWeight: parseInt(e.target.value)})}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-2xs"
              >
                Apply AI Parameters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
