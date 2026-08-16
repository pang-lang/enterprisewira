import React from 'react';
import { 
  LayoutGrid, 
  Search, 
  CalendarCheck, 
  TrendingUp, 
  Users2, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Briefcase,
  Plus
} from 'lucide-react';
import { NavTab } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onPostJob?: () => void;
  urgentEventCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onPostJob,
  urgentEventCount = 3,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutGrid },
    { id: 'talent-search' as NavTab, label: 'Talent Search', icon: Search },
    { id: 'bookings' as NavTab, label: 'Bookings', icon: CalendarCheck, badge: 'Active' },
    { id: 'analytics' as NavTab, label: 'Analytics', icon: TrendingUp },
    { id: 'pipeline' as NavTab, label: 'Talent Pipeline', icon: Users2 },
    { id: 'training' as NavTab, label: 'Training', icon: GraduationCap },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside id="app-sidebar" className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between h-screen shrink-0 sticky top-0 select-none z-30">
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="h-20 px-6 sm:px-8 flex items-center space-x-4 border-b border-slate-200">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 font-bold shrink-0">
            <Briefcase className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight flex items-center gap-1.5">
              Wira Marketplace
            </h1>
            <p className="text-xs text-slate-400 font-medium">Enterprise Portal</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-5 space-y-2" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'bookings' && urgentEventCount > 0 && !isActive && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-5 border-t border-slate-100 space-y-3">
        {/* User Card when on analytics or general */}
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="User profile"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Admin User</p>
            <p className="text-[11px] text-slate-500 truncate">HR Director · Klook</p>
          </div>
        </div>

        <button
          id="btn-logout"
          onClick={() => {
            if (confirm('Are you sure you want to log out of Klook Enterprise Portal?')) {
              setActiveTab('dashboard');
            }
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50/50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
