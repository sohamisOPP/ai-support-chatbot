import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, User, RefreshCw, AlertCircle, CheckCircle2, 
  ExternalLink, Tag, ArrowRight, Star, Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SentimentMeter from './SentimentMeter';
import { processCustomerMessage } from '../services/aiChatbot';
import { analyzeSentiment, extractEntities, predictIntent } from '../services/sentimentEngine';

export default function ChatDemo({ language, onTicketCreated, onNavigateToCrm }) {
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'bot',
      text: "Hello! Welcome to SentiDesk Customer Support.\n\nI can assist with order tracking, billing questions, refunds, or account access. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentiment: { score: 0.1, label: 'Neutral', emotion: 'Neutral', frustrationLevel: 0 },
      intent: { label: 'General Assistance', confidence: 0.98 },
      entities: []
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [liveSentiment, setLiveSentiment] = useState(null);
  const [csatRating, setCsatRating] = useState(0);
  const [csatSubmitted, setCsatSubmitted] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update live sentiment preview as user types in input box
  useEffect(() => {
    if (inputText.trim().length > 3) {
      const live = analyzeSentiment(inputText);
      setLiveSentiment(live);
    } else {
      setLiveSentiment(null);
    }
  }, [inputText]);

  // Clean realistic test scenarios
  const testScenarios = [
    {
      label: 'Angry Billing Dispute',
      badge: 'Triggers Escalation',
      color: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200',
      text: "I was double charged $120.00 on Order #ORD-8491! This is unacceptable, refund my money immediately or I will take legal action!"
    },
    {
      label: 'Package Tracking',
      badge: 'Tier-1 Auto-Resolve',
      color: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200',
      text: "Can you check the delivery status of order #ORD-9921? The tracking number is #TRK-88219."
    },
    {
      label: 'Password Reset',
      badge: 'Account Access',
      color: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200',
      text: "I forgot my password for alex.smith@enterprise.com and I'm locked out of my account."
    },
    {
      label: 'Supervisor Request',
      badge: 'Human Handoff',
      color: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200',
      text: "I need to speak directly with a human support manager right now regarding my account."
    },
    {
      label: 'Positive Feedback',
      badge: 'High CSAT',
      color: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200',
      text: "Thank you so much! That resolved my issue in under a minute, great support."
    }
  ];

  const handleSendMessage = async (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text || isTyping) return;

    // 1. Analyze user message
    const userSentiment = analyzeSentiment(text);
    const userEntities = extractEntities(text);
    const userIntent = predictIntent(text);

    const userMessageObj = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentiment: userSentiment,
      intent: userIntent,
      entities: userEntities
    };

    setMessages(prev => [...prev, userMessageObj]);
    setInputText('');
    setLiveSentiment(null);
    setIsTyping(true);

    // Realistic support agent response delay (500ms)
    setTimeout(async () => {
      const botResponse = await processCustomerMessage({
        message: text,
        conversationHistory: messages,
        language,
        onTicketCreated
      });

      const botMessageObj = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sentiment: botResponse.sentiment,
        intent: botResponse.intent,
        entities: botResponse.entities,
        ticketCreated: botResponse.ticketCreated,
        escalated: botResponse.escalated
      };

      setMessages(prev => [...prev, botMessageObj]);
      setIsTyping(false);

      if (userSentiment.score > 0.5) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    }, 550);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-1',
        sender: 'bot',
        text: "Conversation cleared. How can I assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sentiment: { score: 0.1, label: 'Neutral', emotion: 'Neutral', frustrationLevel: 0 },
        intent: { label: 'General Assistance', confidence: 0.98 },
        entities: []
      }
    ]);
    setCsatRating(0);
    setCsatSubmitted(false);
  };

  const currentSentiment = liveSentiment || 
    (messages.length > 1 ? messages[messages.length - 1].sentiment : messages[0].sentiment);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Clean Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Customer Support Center
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Demonstration of Tier-1 inquiry handling, real-time sentiment monitoring, and dynamic CRM escalation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Clear Chat
          </button>
          <button
            onClick={onNavigateToCrm}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-sm"
          >
            View CRM Tickets <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Test Customer Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {testScenarios.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sc.text)}
              className={`text-xs px-3 py-2 rounded-lg border shadow-sm transition-all flex items-center gap-2 ${sc.color}`}
            >
              <span className="font-medium text-slate-800">{sc.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                {sc.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Support Messenger (2 Cols) + Sidebar (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Chat Box */}
        <div className="lg:col-span-2 flex flex-col h-[640px] rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          {/* Chat Window Header */}
          <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  CS
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Support Representative
                </h3>
                <p className="text-xs text-slate-500">
                  Automated Assistant • Active Now
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Response time: &lt;1s</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-fade-in ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600 text-xs font-bold mt-1">
                    CS
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-xl p-4 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {/* Sender & Timestamp */}
                  <div className={`flex items-center justify-between gap-3 mb-1 text-[11px] ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}>
                    <span className="font-medium">
                      {msg.sender === 'user' ? 'You' : 'Support Team'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Body */}
                  <div className="whitespace-pre-line space-y-1">
                    {msg.text.split('\n').map((line, i) => {
                      const parsed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs border border-slate-200">$1</code>');
                      return <div key={i} dangerouslySetInnerHTML={{ __html: parsed }} />;
                    })}
                  </div>

                  {/* Extracted Metadata for User Messages */}
                  {msg.sender === 'user' && msg.sentiment && (
                    <div className="mt-2.5 pt-2 border-t border-blue-500/40 flex flex-wrap items-center gap-1.5 text-[10px] text-blue-100">
                      <span className="px-1.5 py-0.5 rounded bg-blue-700 font-medium">
                        Sentiment: {msg.sentiment.emotion}
                      </span>
                      {msg.intent && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-800 font-medium">
                          Intent: {msg.intent.label}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Extracted Entity Tags */}
                  {msg.entities && msg.entities.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.entities.map((ent, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-mono flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3 text-slate-500" />
                          <span><strong>{ent.label}:</strong> {ent.value}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Escalated Ticket Notice */}
                  {msg.ticketCreated && (
                    <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-red-800 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          Ticket Escalated to Human Support
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-red-200 text-red-800 text-[10px] font-bold uppercase">
                          {msg.ticketCreated.priority} Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mb-2">
                        Ticket <code className="font-mono font-bold text-slate-900">{msg.ticketCreated.id}</code> has been dispatched to Zendesk &amp; Salesforce queues.
                      </p>
                      <button
                        onClick={onNavigateToCrm}
                        className="w-full py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors shadow-sm"
                      >
                        Open Ticket in CRM View <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 animate-fade-in items-center">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
                  CS
                </div>
                <div className="bg-white rounded-xl px-4 py-2.5 border border-slate-200 shadow-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-slate-500 font-medium ml-1">Analyzing inquiry...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Post-Chat CSAT Rating */}
          {messages.length >= 3 && !csatSubmitted && (
            <div className="px-5 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-700 font-medium">
                How would you rate this support interaction?
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      setCsatRating(star);
                      setCsatSubmitted(true);
                      confetti({ particleCount: 30, spread: 50, origin: { y: 0.9 } });
                    }}
                    className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                    title={`${star} Stars`}
                  >
                    <Star className={`w-4 h-4 ${csatRating >= star ? 'text-amber-500 fill-amber-500' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {csatSubmitted && (
            <div className="px-5 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your feedback ({csatRating}/5 stars) has been recorded in quality metrics.</span>
            </div>
          )}

          {/* Input Form Bar */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask a question, enter order number (#ORD-8491), or describe your issue..."
                className="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-lg px-4 py-2.5 text-sm border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Sentiment & Intent Insights */}
        <div className="space-y-4">
          <SentimentMeter sentiment={currentSentiment} />

          {/* Extracted Details & CRM Metadata */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Active Conversation Signals
            </h4>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">
                  Extracted Entities:
                </span>
                {messages.flatMap(m => m.entities || []).length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {messages.flatMap(m => m.entities || []).slice(-5).map((ent, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono"
                      >
                        {ent.label}: <strong>{ent.value}</strong>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No order or tracking IDs detected in current message.
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 block mb-1.5">
                  Escalation Thresholds:
                </span>
                <ul className="text-xs space-y-1.5 text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span><strong>Urgency &gt; 70%:</strong> Auto-creates priority ticket</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span><strong>Legal / Fraud words:</strong> Immediate human route</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span><strong>Standard Inquiries:</strong> Instant resolution</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <strong>Integrated Systems:</strong> Salesforce Service Cloud, Zendesk Support, PostgreSQL.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
