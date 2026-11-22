import React, { useState } from 'react';
import { 
  CheckCircle, AlertCircle, Clock, Search, Filter, 
  ExternalLink, Building, ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CrmDashboard({ tickets, onResolveTicket, onAddSampleTicket }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);

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
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Top Banner with Glassmorphism */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full glass-pill text-blue-700 text-xs font-semibold">
              CRM Integration Active
            </span>
            <span className="text-xs text-slate-500">
              Synced with Salesforce &amp; Zendesk
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Escalated Ticket Queue
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Tickets created when customer frustration exceeds threshold or complex resolution is required.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddSampleTicket}
            className="px-4 py-2 rounded-xl text-xs font-medium glass-pill hover:bg-white text-slate-800 shadow-xs transition-all"
          >
            + Create Test Ticket
          </button>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets by ID, customer name, or issue..."
            className="w-full glass-input text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-medium">Priority:</span>
          {['ALL', 'Urgent', 'High', 'Medium'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filterPriority === p
                  ? 'bg-slate-900 text-white font-semibold shadow-sm'
                  : 'glass-pill text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table - Glassmorphism Card */}
      <div className="glass-panel rounded-2xl shadow-lg overflow-hidden border border-white/70">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="glass-header text-[11px] uppercase tracking-wider text-slate-600 font-semibold border-b border-white/60">
              <tr>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Sentiment &amp; Urgency</th>
                <th className="py-3.5 px-4">Inquiry Category</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Escalation Trigger</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-white/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTicket(t)}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {t.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {t.customer}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border shadow-2xs ${
                        t.sentiment === 'Very Negative' || t.sentiment === 'Angry'
                          ? 'bg-red-500/10 text-red-700 border-red-300/60'
                          : t.sentiment === 'Negative' || t.sentiment === 'Frustrated'
                          ? 'bg-amber-500/10 text-amber-800 border-amber-300/60'
                          : 'bg-emerald-500/10 text-emerald-700 border-emerald-300/60'
                      }`}
                    >
                      {t.sentiment} ({t.frustrationScore}%)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {t.intent}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.priority === 'Urgent'
                          ? 'bg-red-600 text-white shadow-xs'
                          : t.priority === 'High'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'glass-pill text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">
                    {t.reason || 'Escalated by customer request'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        t.status === 'Resolved'
                          ? 'text-emerald-700 bg-emerald-500/10 border border-emerald-200'
                          : 'text-amber-700 bg-amber-500/10 border border-amber-200'
                      }`}
                    >
                      {t.status === 'Resolved' ? (
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-600" />
                      )}
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    {t.status !== 'Resolved' ? (
                      <button
                        onClick={() => handleResolve(t.id)}
                        className="px-3 py-1 rounded-xl glass-pill hover:bg-white text-slate-800 text-[11px] font-semibold shadow-xs transition-all"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No matching tickets found.
          </div>
        )}
      </div>

      {/* Ticket Details Modal with Glassmorphism */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-white/80">
            <div className="flex items-center justify-between border-b border-white/60 pb-3">
              <div>
                <span className="text-xs text-blue-600 font-mono font-bold">
                  {selectedTicket.id}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedTicket.customer}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-500 hover:text-slate-800 text-xs px-2.5 py-1 rounded-lg glass-pill"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 glass-card rounded-2xl">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-medium">Category</span>
                  <span className="font-semibold text-slate-900">{selectedTicket.intent}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-medium">Sentiment</span>
                  <span className="font-semibold text-slate-900">{selectedTicket.sentiment} ({selectedTicket.frustrationScore}%)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-medium">Priority</span>
                  <span className="font-semibold text-slate-900">{selectedTicket.priority}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-medium">Destination</span>
                  <span className="font-semibold text-slate-900">{selectedTicket.crmSystem || 'Salesforce Service Cloud'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-medium mb-1">Trigger Reason</span>
                <p className="p-3.5 glass-card rounded-xl text-slate-700 text-xs">
                  {selectedTicket.reason}
                </p>
              </div>

              {selectedTicket.transcriptSnippet && (
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-medium mb-1">Original Customer Transcript</span>
                  <blockquote className="p-3.5 glass-card border-l-2 border-blue-600 rounded-r-xl text-slate-700 text-xs italic">
                    "{selectedTicket.transcriptSnippet}"
                  </blockquote>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/60 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
              {selectedTicket.status !== 'Resolved' && (
                <button
                  onClick={() => {
                    handleResolve(selectedTicket.id);
                    setSelectedTicket(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all ring-1 ring-white/30"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
