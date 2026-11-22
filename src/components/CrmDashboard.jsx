import React, { useState } from 'react';
import { 
  CheckCircle, Clock, Search, Building, ArrowUpRight, X, AlertCircle
} from 'lucide-react';

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
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              CRM Integration
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">
              Synchronized with Salesforce Service Cloud &amp; Zendesk
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Escalated Ticket Queue
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Inquiries routed automatically to senior support specialists when customer frustration exceeds threshold or requires credential resets.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onAddSampleTicket}
            className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
          >
            Create test ticket
          </button>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets by ID, customer name, or issue"
            className="w-full bg-white text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2 rounded-lg text-xs border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium mr-1">Priority:</span>
          {['ALL', 'Urgent', 'High', 'Medium'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filterPriority === p
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Urgency index</th>
                <th className="py-3 px-4">Inquiry category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Escalation trigger</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => setSelectedTicket(t)}
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 tabular-nums">
                    {t.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {t.customer}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                        t.sentiment === 'Very Negative' || t.sentiment === 'Angry' || t.frustrationScore >= 70
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : t.sentiment === 'Negative' || t.sentiment === 'Frustrated' || t.frustrationScore >= 40
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {t.frustrationScore}% urgency
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {t.intent}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                        t.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : t.priority === 'High'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">
                    {t.reason || 'Escalated by customer inquiry'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${
                        t.status === 'Resolved'
                          ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                          : 'text-amber-800 bg-amber-50 border border-amber-200'
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
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-medium transition-colors shadow-2xs"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No matching tickets found in queue.
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  {selectedTicket.id}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedTicket.customer}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Category</span>
                  <span className="font-semibold text-slate-900">{selectedTicket.intent}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Urgency score</span>
                  <span className="font-semibold text-slate-900">{selectedTicket.frustrationScore}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Priority</span>
                  <span className="font-semibold text-slate-900">{selectedTicket.priority}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">CRM target</span>
                  <span className="font-semibold text-slate-900">{selectedTicket.crmSystem || 'Salesforce Service Cloud'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">Trigger reason</span>
                <p className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700 text-xs">
                  {selectedTicket.reason}
                </p>
              </div>

              {selectedTicket.transcriptSnippet && (
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">Customer statement</span>
                  <blockquote className="p-3 bg-slate-50 border-l-2 border-slate-900 rounded-r-lg text-slate-700 text-xs">
                    "{selectedTicket.transcriptSnippet}"
                  </blockquote>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                Close
              </button>
              {selectedTicket.status !== 'Resolved' && (
                <button
                  onClick={() => {
                    handleResolve(selectedTicket.id);
                    setSelectedTicket(null);
                  }}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
                >
                  Mark resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
