import React from 'react';
import { Headphones, Globe, BookOpen } from 'lucide-react';

export default function Header({ language, setLanguage, activeTab, setActiveTab, onOpenAbout }) {
  const languages = [
    { code: 'en', name: 'English', flag: 'EN' },
    { code: 'es', name: 'Español', flag: 'ES' },
    { code: 'fr', name: 'Français', flag: 'FR' },
    { code: 'de', name: 'Deutsch', flag: 'DE' },
    { code: 'hi', name: 'हिन्दी', flag: 'HI' },
    { code: 'ja', name: '日本語', flag: 'JA' },
  ];

  return (
    <header className="sticky top-0 z-40 glass-header">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1 sm:gap-4">
          {/* Logo & Product Brand: Soham Chatbot */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600/90 backdrop-blur-md flex items-center justify-center text-white shadow-md shadow-blue-600/20 ring-1 ring-white/40 flex-shrink-0">
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 truncate">
                  Soham Chatbot
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full glass-pill text-slate-700">
                  Customer Support
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Intelligent Inquiries, Sentiment Detection &amp; CRM Escalation
              </p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
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

          {/* Right actions: About (30 Pages), Language & SLA Status - Guaranteed to fit on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* About 30-Page Guide Button on Top Right */}
            <button
              onClick={onOpenAbout}
              className="glass-pill px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-semibold text-blue-700 hover:text-blue-900 hover:bg-white flex items-center gap-1 transition-all shadow-xs ring-1 ring-blue-500/25 flex-shrink-0 active:scale-95"
              title="Open 30-Page Documentation Guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span>About</span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
                30 Pages
              </span>
            </button>

            {/* Language dropdown: Compact & guaranteed inside viewport */}
            <div className="flex items-center glass-pill rounded-xl px-1.5 sm:px-2.5 py-1 text-xs flex-shrink-0">
              <Globe className="w-3.5 h-3.5 text-slate-500 mr-1 flex-shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-slate-700 font-semibold text-xs focus:outline-none cursor-pointer pr-0.5 appearance-none text-center"
                title="Select Language"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-white text-slate-800">
                    {l.flag}
                  </option>
                ))}
              </select>
            </div>

            {/* Status indicator (Desktop only) */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 font-medium glass-pill px-3 py-1 rounded-full flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Online</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs Bar */}
        <div className="flex md:hidden items-center justify-around gap-1 pb-2 pt-1 border-t border-white/40">
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'demo'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              activeTab === 'crm'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CRM
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'metrics'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CSAT
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'architecture'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tech Stack
          </button>
        </div>
      </div>
    </header>
  );
}
