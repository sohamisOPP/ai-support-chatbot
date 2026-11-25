import React, { useState } from 'react';
import Header from './components/Header';
import ChatDemo from './components/ChatDemo';
import CrmDashboard from './components/CrmDashboard';
import ArchitectureView from './components/ArchitectureView';
import MetricsDashboard from './components/MetricsDashboard';
import AboutModal from './components/AboutModal';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('demo');
  const [language, setLanguage] = useState('en');
  const [notification, setNotification] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Initial simulated tickets in the CRM from Zendesk / Salesforce
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-841920',
      customer: 'Sarah Jenkins',
      intent: 'Billing and charges',
      sentiment: 'Negative',
      frustrationScore: 89,
      priority: 'Urgent',
      source: 'Support escalation',
      reason: 'Double charge dispute on Order #ORD-4491 ($120.00)',
      timestamp: '10:14 AM',
      status: 'Open',
      crmSystem: 'Salesforce Service Cloud',
      transcriptSnippet: "I was double charged $120.00 on Order #ORD-4491. Please refund this immediately."
    },
    {
      id: 'TKT-773194',
      customer: 'Carlos Rivera',
      intent: 'Order tracking and status',
      sentiment: 'Negative',
      frustrationScore: 68,
      priority: 'High',
      source: 'Support escalation',
      reason: 'Delivery delayed more than 5 days without carrier update',
      timestamp: '09:42 AM',
      status: 'In Progress',
      crmSystem: 'Zendesk Support',
      transcriptSnippet: "Where is my package TRK-88129? It was scheduled for delivery last Friday."
    },
    {
      id: 'TKT-651203',
      customer: 'Elena Rostova',
      intent: 'Account access and authentication',
      sentiment: 'Neutral',
      frustrationScore: 35,
      priority: 'Medium',
      source: 'Tier-1 escalation',
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
      title: 'Ticket escalated to support',
      message: `Ticket ${newTicket.id} assigned to tier-2 queue (${newTicket.priority} priority)`
    });

    setTimeout(() => {
      setNotification(null);
    }, 4500);
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
      customer: 'David Chen',
      intent: 'Technical outage',
      sentiment: 'Negative',
      frustrationScore: 92,
      priority: 'Urgent',
      source: 'Urgency threshold trigger',
      reason: 'Production API 500 error during high traffic period',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Open',
      crmSystem: 'Zendesk Support',
      transcriptSnippet: "Our checkout API returned 500 internal server errors. We need senior engineering assistance."
    };
    handleTicketCreated(sample);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Toast Notification - Quiet, crisp enterprise notification */}
      {notification && (
        <div className="fixed top-[112px] sm:top-20 left-3 right-3 sm:left-auto sm:right-6 z-50 animate-enter sm:max-w-sm p-3.5 rounded-lg bg-white border border-slate-200 shadow-md text-slate-900">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-xs text-slate-900">
                {notification.title}
              </div>
              <div className="text-xs text-slate-600 mt-0.5 break-words">
                {notification.message}
              </div>
            </div>
            <button
              onClick={() => setActiveTab('crm')}
              className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-800 transition-colors flex-shrink-0"
            >
              View
            </button>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openTicketCount={tickets.filter(t => t.status !== 'Resolved').length}
        onOpenAbout={() => setIsAboutOpen(true)}
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

      {/* 30-Page Documentation Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
