import React from 'react';
import { Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-10 sm:mt-16 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white flex-shrink-0">
              <Headphones className="w-4 h-4 text-slate-200" />
            </div>
            <div>
              <span className="font-semibold text-sm text-slate-900">Soham Chatbot</span>
              <p className="text-xs text-slate-500 mt-0.5">
                Tier-1 automated support triage, sentiment scoring, and CRM escalation
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-600">
            <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
              FastAPI
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
              Transformers
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
              React 18
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
              PostgreSQL
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200">
              Salesforce &amp; Zendesk sync
            </span>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right">
            <div>Hosted on <span className="text-slate-900 font-medium">Cloudflare Pages</span> &amp; <span className="text-slate-900 font-medium">GitHub Pages</span></div>
            <div className="text-[11px] text-slate-400 mt-0.5">SSL secured • Project B Reference implementation</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
