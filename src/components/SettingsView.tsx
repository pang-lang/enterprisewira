import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  Key, 
  Save, 
  CheckCircle2,
  MessageCircle,
  Phone,
  Zap
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [companyName, setCompanyName] = useState('Klook Events Malaysia Sdn Bhd');
  const [bankAccount, setBankAccount] = useState('HSBC Enterprise (**** 8822)');
  const [contactEmail, setContactEmail] = useState('events.my@klook.com');
  const [autoApproveMatches, setAutoApproveMatches] = useState(true);
  const [saved, setSaved] = useState(false);
  const [waPhoneId, setWaPhoneId] = useState('');
  const [waToken, setWaToken] = useState('');
  const [waEnabled, setWaEnabled] = useState(false);
  const [waTestSent, setWaTestSent] = useState(false);

  const handleTestWhatsApp = () => {
    setWaTestSent(true);
    setTimeout(() => setWaTestSent(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="view-settings" className="p-8 sm:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Enterprise Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            Manage your organization profile, automated payout accounts, and AI matching rules.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Company Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Organization Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Company Legal Entity</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Primary Staffing Contact</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Payout & Banking Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Settlement & Batch Payout Account</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Default Disbursement Account</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Settlement Rail</label>
              <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm font-medium text-slate-600">
                PayNet / DuitNow Bulk API (Instant)
              </div>
            </div>
          </div>
        </div>

        {/* AI & Automation Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">Smart Staffing Automation</h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Auto-Dispatch 95%+ Fit Candidates</p>
                <p className="text-slate-500">Automatically send shift reserve holds to top-matched specialists.</p>
              </div>
              <input
                type="checkbox"
                checked={autoApproveMatches}
                onChange={(e) => setAutoApproveMatches(e.target.checked)}
                className="w-5 h-5 rounded-md text-blue-600"
              />
            </label>
          </div>
        </div>

        {/* WhatsApp Business Integration */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <h2 className="text-base font-bold text-slate-900">WhatsApp Business Dispatch</h2>
            <span className="ml-auto px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
              Notification Channel
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-900">Enable WhatsApp Shift Dispatch</p>
              <p className="text-xs text-slate-500">Send booking confirmations and shift reminders via WhatsApp</p>
            </div>
            <button
              type="button"
              onClick={() => setWaEnabled(!waEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                waEnabled ? 'bg-[#25D366]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  waEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {waEnabled && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Phone Number ID
                  </label>
                  <input
                    type="text"
                    value={waPhoneId}
                    onChange={(e) => setWaPhoneId(e.target.value)}
                    placeholder="e.g. 123456789012345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-green-400/30"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" /> Access Token
                  </label>
                  <input
                    type="password"
                    value={waToken}
                    onChange={(e) => setWaToken(e.target.value)}
                    placeholder="WhatsApp Business API token"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-green-400/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestWhatsApp}
                  className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5c] text-white text-xs font-bold rounded-xl transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  {waTestSent ? 'Test message sent! ✓' : 'Send Test Message'}
                </button>
                <p className="text-[11px] text-slate-400">
                  Sends a test to +60 12-345 6789 (mock number)
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800">
                <strong>Note:</strong> For prototype mode, messages are simulated. Connect a real WhatsApp Business account via Meta for actual delivery.
              </div>
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved successfully!
            </span>
          )}
          {!saved && <span></span>}

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
