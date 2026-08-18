import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertCircle, Wand2 } from 'lucide-react';
import { NavTab } from '../types';

interface HeaderProps {
  activeTab: NavTab;
  onSearchGlobal?: (query: string) => void;
  onOpenPayoutModal?: () => void;
  onOpenAIBrief?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAIBrief }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Samsung Product Launch needs 2 more crew members', time: '10m ago', urgent: true },
    { id: 2, text: 'Batch payout RM12,342.00 authorized to HSBC', time: '1h ago', urgent: false },
    { id: 3, text: 'Siti Nurhaliza accepted your invitation for KL Music Fest', time: '3h ago', urgent: false },
  ]);

  return (
    <header id="app-top-header" className="h-20 bg-white/95 backdrop-blur-xs border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-8 sm:px-10 h-full flex items-center justify-between">
        {/* Left Side: Empty */}
        <div></div>

        {/* Right Controls: AI Quick Post + Notification Icon + Profile Icon */}
        <div className="flex items-center gap-3">
          {/* AI Quick Post Button */}
          <button
            id="btn-ai-quick-post"
            onClick={onOpenAIBrief}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-purple-500/20 transition-all"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Quick Post</span>
          </button>
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              id="btn-notifications-toggle"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <Bell className="w-5 h-5 stroke-[1.8]" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</span>
                  <button
                    onClick={() => setNotifications([])}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    Clear all
                  </button>
                </div>
                <div className="py-2 space-y-1.5 max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No new alerts</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-xl hover:bg-slate-50 flex items-start gap-2.5 transition-colors">
                        {n.urgent ? (
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-700 leading-snug">{n.text}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Icon */}
          <div className="flex items-center pl-2 border-l border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt="Klook Events Lead"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/20"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
