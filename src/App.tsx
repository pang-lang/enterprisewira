import React, { useState } from 'react';
import { NavTab, Worker, UrgentEvent } from './types';
import { initialWorkers, initialEvents, pipelineTalents, samplePayoutTransaction } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TalentSearchView } from './components/TalentSearchView';
import { AnalyticsView } from './components/AnalyticsView';
import { BookingsView } from './components/BookingsView';
import { TalentPipelineView } from './components/TalentPipelineView';
import { BatchPayoutModal } from './components/BatchPayoutModal';
import { TrainingView } from './components/TrainingView';
import { SettingsView } from './components/SettingsView';
import { CheckCircle2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [events, setEvents] = useState<UrgentEvent[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<UrgentEvent | null>(initialEvents[3]); // Samsung Launch
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBookWorker = (worker: Worker, eventName: string) => {
    // Increment confirmed count for event
    setEvents((prev) =>
      prev.map((e) => {
        if (e.name === eventName) {
          const newConfirmed = Math.min(e.workersNeeded, e.confirmed + 1);
          const newFillRate = Math.round((newConfirmed / e.workersNeeded) * 100);
          return {
            ...e,
            confirmed: newConfirmed,
            fillRate: newFillRate,
            status: newFillRate >= 90 ? 'On Track' : newFillRate >= 70 ? 'At Risk' : 'Critical',
          };
        }
        return e;
      })
    );

    showToast(`Successfully booked ${worker.name} for ${eventName}! Dispatch notifications sent.`);
  };

  const handleSelectEvent = (event: UrgentEvent) => {
    setSelectedEvent(event);
  };

  const handleSearchGlobal = (query: string) => {
    setGlobalSearchQuery(query);
    if (query.trim() && activeTab !== 'talent-search') {
      setActiveTab('talent-search');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPostJob={() => setActiveTab('pipeline')}
        urgentEventCount={events.filter((e) => e.status !== 'On Track').length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onSearchGlobal={handleSearchGlobal}
          onOpenPayoutModal={() => setIsPayoutModalOpen(true)}
        />

        {/* View Switcher */}
        <main className="flex-1 pb-16">
          {activeTab === 'dashboard' && (
            <DashboardView
              events={events}
              onSelectEvent={handleSelectEvent}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'talent-search' && (
            <TalentSearchView
              workers={workers}
              events={events}
              onBookWorker={handleBookWorker}
              searchQuery={globalSearchQuery}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'bookings' && (
            <BookingsView
              selectedEvent={selectedEvent}
              onOpenPayoutModal={() => setIsPayoutModalOpen(true)}
              onSelectEvent={handleSelectEvent}
            />
          )}

          {activeTab === 'pipeline' && (
            <TalentPipelineView
              pipelineTalents={pipelineTalents}
              allWorkers={workers}
            />
          )}

          {activeTab === 'training' && <TrainingView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Batch Payout Authorized Modal (Image 13) */}
      <BatchPayoutModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        transaction={samplePayoutTransaction}
        onViewDashboard={() => {
          setIsPayoutModalOpen(false);
          setActiveTab('dashboard');
        }}
      />

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-5 fade-in duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
