import React from 'react';
import { Bot, Sparkles, Activity, ShieldCheck, Globe, GitFork, ExternalLink } from 'lucide-react';

export default function Header({ language, setLanguage, activeTab, setActiveTab }) {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  SentiDesk AI
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Project B
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Tier-1 Support Bot with Real-Time Sentiment & Dynamic Escalation
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'demo'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Live Chat Demo
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'crm'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              CRM Tickets
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-subtle" />
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'metrics'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              CSAT Metrics
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'architecture'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Tech Stack & Architecture
            </button>
          </nav>

          {/* Right actions: Language + Status */}
          <div className="flex items-center gap-3">
            {/* Language dropdown */}
            <div className="relative flex items-center bg-slate-800/80 rounded-lg px-2 py-1 border border-slate-700/60 text-xs">
              <Globe className="w-3.5 h-3.5 text-indigo-400 mr-1.5" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1"
                title="Select Language"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100">
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Operational Status */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>NLP Gateway Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
