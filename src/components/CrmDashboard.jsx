import React, { useState } from 'react';
import { 
  CheckCircle, AlertCircle, Clock, ShieldAlert, ArrowUpRight, 
  Search, Filter, ExternalLink, RefreshCw, Sparkles, Building, UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CrmDashboard({ tickets, onResolveTicket, onAddSampleTicket }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Filtered tickets
  const filtered = tickets.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.intent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.reason && t.reason.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const handleResolve = (ticketId) => {
    onResolveTicket(ticketId);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Banner */}
      <div className="mb-6 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              CRM Sync Active
            </span>
            <span className="text-xs text-slate-400">
              Salesforce &amp; Zendesk API Webhooks
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Dynamic Escalation &amp; CRM Ticket Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            When customer frustration crosses the threshold or legal/fraud keywords are detected, tickets are autonomously created with sentiment tags, transcripts, and priority levels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddSampleTicket}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Simulate Incoming Escalation
          </button>
        </div>
      </div>

      {/* Control bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ticket ID, customer, intent or cause..."
            className="w-full bg-slate-900 text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Priority:</span>
          {['ALL', 'Urgent', 'High', 'Medium'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterPriority === p
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Detected Sentiment</th>
                <th className="py-3.5 px-4">Intent</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Escalation Cause</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedTicket(t)}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                    {t.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-white">
                    {t.customer}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        t.sentiment === 'Very Negative' || t.sentiment === 'Angry'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : t.sentiment === 'Negative' || t.sentiment === 'Frustrated'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {t.sentiment} ({t.frustrationScore}%)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {t.intent}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.priority === 'Urgent'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : t.priority === 'High'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-400">
                    {t.reason || 'Customer requested live supervisor'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                        t.status === 'Resolved'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      {t.status === 'Resolved' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    {t.status !== 'Resolved' ? (
                      <button
                        onClick={() => handleResolve(t.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-medium transition-all"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">
            No tickets match your search or filter.
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-indigo-400 font-mono font-bold">
                  {selectedTicket.id}
                </span>
                <h3 className="text-base font-bold text-white">
                  Ticket Details • {selectedTicket.customer}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-800"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-800/60 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Detected Intent</span>
                  <span className="font-semibold text-slate-200">{selectedTicket.intent}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Sentiment</span>
                  <span className="font-semibold text-rose-400">{selectedTicket.sentiment} ({selectedTicket.frustrationScore}%)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Priority</span>
                  <span className="font-semibold text-amber-400">{selectedTicket.priority}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">CRM Target</span>
                  <span className="font-semibold text-slate-200">Zendesk &amp; Salesforce Service Cloud</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase mb-1">Escalation Trigger</span>
                <p className="p-3 bg-slate-800/40 rounded-xl text-slate-300 text-xs">
                  {selectedTicket.reason}
                </p>
              </div>

              {selectedTicket.transcriptSnippet && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase mb-1">Message Transcript Snippet</span>
                  <blockquote className="p-3 bg-indigo-950/30 border-l-2 border-indigo-500 rounded-r-xl text-slate-300 italic text-xs">
                    "{selectedTicket.transcriptSnippet}"
                  </blockquote>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Dismiss
              </button>
              {selectedTicket.status !== 'Resolved' && (
                <button
                  onClick={() => {
                    handleResolve(selectedTicket.id);
                    setSelectedTicket(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
