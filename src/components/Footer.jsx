import React from 'react';
import { Bot, GitFork, Globe, Heart, Shield, Cpu, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-white">SentiDesk AI</span>
              <p className="text-xs text-slate-400">
                Project B: AI-Powered Customer Support Chatbot with Sentiment Analysis
              </p>
            </div>
          </div>

          {/* Center tech stack pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-400" /> Python FastAPI
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
              <Shield className="w-3 h-3 text-purple-400" /> Hugging Face Transformers
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
              <Globe className="w-3 h-3 text-sky-400" /> React 18 &amp; Tailwind
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-400" /> PostgreSQL &amp; CRM Sync
            </span>
          </div>

          {/* Right info */}
          <div className="text-xs text-slate-400 text-center md:text-right">
            <div>Hosted with Free Domain on <span className="text-indigo-400 font-semibold">GitHub Pages</span></div>
            <div className="text-[11px] text-slate-500 mt-0.5">SSL Secured • Zero Infrastructure Cost</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
