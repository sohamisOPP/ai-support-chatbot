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
      source: 'AI Live Chat Escalation',
      reason: 'Double charge dispute on Order #ORD-4491 ($120.00)',
      timestamp: '10:14 AM',
      status: 'Open',
      crmSystem: 'Salesforce Service Cloud',
      transcriptSnippet: "I was double charged $120.00 on Order #ORD-4491! This is ridiculous, refund my money right now!"
    },
    {
      id: 'TKT-773194',
      customer: 'Carlos Rivera',
      intent: 'Order Tracking & Status',
      sentiment: 'Negative',
      frustrationScore: 68,
      priority: 'High',
      source: 'AI Live Chat Escalation',
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
      title: '🚨 Dynamic Escalation Triggered!',
      message: `Ticket ${newTicket.id} logged in CRM (${newTicket.priority} Priority). Frustration score: ${newTicket.frustrationScore}%`
    });

    setTimeout(() => {
      setNotification(null);
    }, 6000);
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
      customer: 'David Chen (VIP Client)',
      intent: 'Technical Bug & Outage',
      sentiment: 'Very Negative',
      frustrationScore: 92,
      priority: 'Urgent',
      source: 'AI Real-Time Sentiment Trigger',
      reason: 'Production API 500 error during high traffic launch',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Open',
      crmSystem: 'Zendesk Support',
      transcriptSnippet: "Our checkout API returned 500 internal server errors. We are losing transactions every minute!"
    };
    handleTicketCreated(sample);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d18] text-slate-100">
      {/* Dynamic Escalation Floating Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-slide-up max-w-md p-4 rounded-2xl bg-rose-950/90 border border-rose-500/50 shadow-2xl backdrop-blur-xl text-rose-200">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-rose-400">
                {notification.title}
              </div>
              <div className="text-xs text-rose-100 mt-1">
                {notification.message}
              </div>
            </div>
            <button
              onClick={() => setActiveTab('crm')}
              className="px-2.5 py-1 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-[11px] font-semibold text-white whitespace-nowrap transition-all"
            >
              View Ticket →
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

      {/* Tab Views */}
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
