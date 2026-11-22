import React from 'react';
import { Headphones, Globe } from 'lucide-react';

export default function Header({ language, setLanguage, activeTab, setActiveTab }) {
  const languages = [
    { code: 'en', name: 'English', flag: 'EN' },
    { code: 'es', name: 'Español', flag: 'ES' },
    { code: 'fr', name: 'Français', flag: 'FR' },
    { code: 'de', name: 'Deutsch', flag: 'DE' },
    { code: 'hi', name: 'हिन्दी', flag: 'HI' },
    { code: 'ja', name: '日本語', flag: 'JA' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/90 backdrop-blur-md flex items-center justify-center text-white shadow-md shadow-blue-600/20 ring-1 ring-white/40">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  SentiDesk
                </span>
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full glass-pill text-slate-700">
                  Customer Support
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Intelligent Inquiries, Sentiment Detection &amp; CRM Escalation
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 glass-pill p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'demo'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Support Messenger
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'crm'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CRM Ticket Queue
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'metrics'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CSAT &amp; Performance
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'architecture'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              System Architecture
            </button>
          </nav>

          {/* Right actions: Language & SLA Status */}
          <div className="flex items-center gap-3">
            {/* Language dropdown */}
            <div className="flex items-center glass-pill rounded-lg px-2.5 py-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
                title="Select Language"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-white text-slate-800">
                    {l.flag} - {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status indicator */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 font-medium glass-pill px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Desk Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
