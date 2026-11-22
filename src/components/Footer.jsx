import React from 'react';
import { Headphones, Globe, Shield, Cpu, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900">SentiDesk Customer Support</span>
              <p className="text-xs text-slate-500">
                Tier-1 Inquiries, Sentiment Detection &amp; Dynamic CRM Escalation
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
            <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200">
              FastAPI
            </span>
            <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200">
              Transformers
            </span>
            <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200">
              React 18
            </span>
            <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200">
              PostgreSQL
            </span>
            <span className="px-2 py-1 rounded-md bg-slate-100 border border-slate-200">
              Salesforce &amp; Zendesk Sync
            </span>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right">
            <div>Hosted on <span className="text-slate-800 font-semibold">GitHub Pages</span></div>
            <div className="text-[11px] text-slate-400 mt-0.5">SSL Secured • Enterprise Reference Design</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
