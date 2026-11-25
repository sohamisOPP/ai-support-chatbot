import React from 'react';
import { Headphones, Globe, BookOpen } from 'lucide-react';

export default function Header({ language, setLanguage, activeTab, setActiveTab, openTicketCount = 0, onOpenAbout }) {
  const languages = [
    { code: 'en', name: 'English', flag: 'EN' },
    { code: 'es', name: 'Español', flag: 'ES' },
    { code: 'fr', name: 'Français', flag: 'FR' },
    { code: 'de', name: 'Deutsch', flag: 'DE' },
    { code: 'hi', name: 'हिन्दी', flag: 'HI' },
    { code: 'ja', name: '日本語', flag: 'JA' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
          {/* Logo & Product Brand */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white flex-shrink-0">
              <Headphones className="w-4 h-4 text-slate-200" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-base tracking-tight text-slate-900 truncate">
                  Soham Chatbot
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[11px] font-normal rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Customer support
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'demo'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Support messenger
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'crm'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>CRM queue</span>
              {openTicketCount > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 text-[10px] font-mono font-semibold tabular-nums">
                  {openTicketCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'metrics'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'architecture'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Architecture
            </button>
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Documentation Button */}
            <button
              onClick={onOpenAbout}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 bg-white flex items-center gap-1.5 transition-colors shadow-sm"
              title="Open 30-page documentation guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>About</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                30 pages
              </span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center rounded-lg px-2 py-1.5 text-xs border border-slate-200 bg-white shadow-sm">
              <Globe className="w-3.5 h-3.5 text-slate-500 mr-1 flex-shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Select language"
                className="bg-transparent text-slate-700 font-medium text-xs focus:outline-none cursor-pointer pr-0.5"
                title="Select language"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-white text-slate-900">
                    {l.flag}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Operational State */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 px-2 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Desk active</span>
            </div>
          </div>
        </div>

        {/* Mobile Segmented Navigation Sub-bar */}
        <div className="flex md:hidden items-center gap-1 pb-2.5 pt-0.5">
          <div className="flex w-full items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium text-center transition-colors ${
                activeTab === 'demo'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium text-center transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'crm'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>CRM</span>
              {openTicketCount > 0 && (
                <span className={`px-1 rounded text-[10px] font-mono font-semibold tabular-nums ${
                  activeTab === 'crm' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {openTicketCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium text-center transition-colors ${
                activeTab === 'metrics'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Metrics
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium text-center transition-colors ${
                activeTab === 'architecture'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stack
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
