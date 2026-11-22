import React, { useState } from 'react';
import Header from './components/Header';
import ChatDemo from './components/ChatDemo';
import CrmDashboard from './components/CrmDashboard';
import ArchitectureView from './components/ArchitectureView';
import MetricsDashboard from './components/MetricsDashboard';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('demo');
  const [language, setLanguage] = useState('en');
  const [notification, setNotification] = useState(null);

  // Initial simulated tickets in the CRM from Zendesk / Salesforce
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-841920',
      customer: 'Sarah Jenkins (Enterprise Pro)',
      intent: 'Billing & Charges',
      sentiment: 'Very Negative',
      frustrationScore: 89,
      priority: 'Urgent',
      source: 'Support Chat Escalation',
      reason: 'Double charge dispute on Order #ORD-4491 ($120.00)',
      timestamp: '10:14 AM',
      status: 'Open',
      crmSystem: 'Salesforce Service Cloud',
      transcriptSnippet: "I was double charged $120.00 on Order #ORD-4491! This is unacceptable, refund my money immediately!"
    },
    {
      id: 'TKT-773194',
      customer: 'Carlos Rivera',
      intent: 'Order Tracking & Status',
      sentiment: 'Negative',
      frustrationScore: 68,
      priority: 'High',
      source: 'Support Chat Escalation',
      reason: 'Delivery delayed > 5 days without carrier update',
      timestamp: '09:42 AM',
      status: 'In Progress',
      crmSystem: 'Zendesk Support',
      transcriptSnippet: "Where is my package TRK-88129? It was supposed to be delivered last Friday."
    },
    {
      id: 'TKT-651203',
      customer: 'Elena Rostova',
      intent: 'Account Access & Auth',
      sentiment: 'Neutral',
      frustrationScore: 35,
      priority: 'Medium',
      source: 'Tier-1 Escalation',
      reason: '2FA authentication reset request for corporate SSO',
      timestamp: 'Yesterday',
      status: 'Resolved',
      crmSystem: 'Salesforce Service Cloud',
      transcriptSnippet: "My authenticator phone broke, need help resetting my 2FA backup codes."
    }
  ]);

  const handleTicketCreated = (newTicket) => {
    setTickets(prev => [newTicket, ...prev]);
    setNotification({
      title: 'Ticket Escalated to Human Support',
      message: `Ticket ${newTicket.id} assigned to Tier-2 queue (${newTicket.priority} Priority).`
    });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleResolveTicket = (ticketId) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status: 'Resolved' } : t))
    );
  };

  const handleAddSampleTicket = () => {
    const randomId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const sample = {
      id: randomId,
      customer: 'David Chen (Corporate Client)',
      intent: 'Technical Outage',
      sentiment: 'Very Negative',
      frustrationScore: 92,
      priority: 'Urgent',
      source: 'Urgency Threshold Trigger',
      reason: 'Production API 500 error during high traffic period',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Open',
      crmSystem: 'Zendesk Support',
      transcriptSnippet: "Our checkout API returned 500 internal server errors. We need senior engineering assistance."
    };
    handleTicketCreated(sample);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Subtle, clean notification toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in max-w-sm p-4 rounded-xl bg-white border border-red-200 shadow-lg text-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-xs text-red-700">
                {notification.title}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {notification.message}
              </div>
            </div>
            <button
              onClick={() => setActiveTab('crm')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold text-slate-800 whitespace-nowrap transition-colors"
            >
              View →
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'demo' && (
          <ChatDemo
            language={language}
            onTicketCreated={handleTicketCreated}
            onNavigateToCrm={() => setActiveTab('crm')}
          />
        )}

        {activeTab === 'crm' && (
          <CrmDashboard
            tickets={tickets}
            onResolveTicket={handleResolveTicket}
            onAddSampleTicket={handleAddSampleTicket}
          />
        )}

        {activeTab === 'metrics' && (
          <MetricsDashboard />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
