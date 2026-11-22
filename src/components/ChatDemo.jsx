import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, User, RefreshCw, AlertCircle, CheckCircle2, 
  Tag, ArrowRight, Star, Headphones
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
      text: "Hello, welcome to Soham Chatbot support.\n\nI can assist with order tracking, billing inquiries, refunds, and account credentials. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentiment: { score: 0.1, label: 'Neutral', emotion: 'Neutral', frustrationLevel: 0 },
      intent: { label: 'General assistance', confidence: 0.98 },
      entities: []
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [liveSentiment, setLiveSentiment] = useState(null);
  const [csatRating, setCsatRating] = useState(0);
  const [csatSubmitted, setCsatSubmitted] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (inputText.trim().length > 3) {
      const live = analyzeSentiment(inputText);
      setLiveSentiment(live);
    } else {
      setLiveSentiment(null);
    }
  }, [inputText]);

  // Clean, factual test cases without emojis or exclamation marks
  const testScenarios = [
    {
      label: 'Billing dispute',
      detail: 'Order #ORD-8491 duplicate charge',
      text: "I was double charged $120.00 on Order #ORD-8491. Please refund this amount immediately or I will take legal action."
    },
    {
      label: 'Package tracking',
      detail: 'Tracking number #TRK-88219',
      text: "Can you check the delivery status of order #ORD-9921? The tracking reference is #TRK-88219."
    },
    {
      label: 'Password reset',
      detail: 'Account lockout recovery',
      text: "I forgot my password for alex.smith@enterprise.com and I cannot access my account."
    },
    {
      label: 'Supervisor escalation',
      detail: 'Direct handoff request',
      text: "I need to speak directly with a human support manager regarding this dispute."
    },
    {
      label: 'Resolution feedback',
      detail: 'Positive confirmation',
      text: "Thank you, that completely resolved my inquiry in under a minute."
    }
  ];

  const handleSendMessage = async (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text || isTyping) return;

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
          particleCount: 35,
          spread: 50,
          origin: { y: 0.85 }
        });
      }
    }, 450);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-1',
        sender: 'bot',
        text: "Conversation reset. How can I assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sentiment: { score: 0.1, label: 'Neutral', emotion: 'Neutral', frustrationLevel: 0 },
        intent: { label: 'General assistance', confidence: 0.98 },
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
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Support console
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Tier-1 automated triage</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Customer Support Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Simulate real customer inquiries to evaluate intent extraction, sentiment scoring, and automatic ticket escalation to Zendesk and Salesforce.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleResetChat}
            className="px-3 py-2 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Reset chat
          </button>
          <button
            onClick={onNavigateToCrm}
            className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors shadow-xs"
          >
            Ticket queue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Test Queries */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-slate-500">
          Sample customer scenarios
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {testScenarios.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sc.text)}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-left transition-colors flex flex-col justify-between"
            >
              <span className="text-xs font-medium text-slate-900">{sc.label}</span>
              <span className="text-[11px] text-slate-500 mt-1 truncate">{sc.detail}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workbench: Messenger + Sentiment Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messenger Container */}
        <div className="lg:col-span-2 flex flex-col h-[620px] rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-medium text-xs">
                SC
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                  Soham Chatbot
                </h3>
                <p className="text-xs text-slate-500">
                  Tier-1 automated support
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Latency: 0.8s</span>
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-enter ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-md bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-700 text-xs font-medium mt-1">
                    SC
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-none shadow-xs'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className={`flex items-center justify-between gap-3 mb-1 text-[11px] ${
                    msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400'
                  }`}>
                    <span className="font-medium">
                      {msg.sender === 'user' ? 'Customer' : 'Soham Chatbot'}
                    </span>
                    <span className="tabular-nums">{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-line space-y-1">
                    {msg.text.split('\n').map((line, i) => {
                      const cleanLine = line.replaceAll('*', '');
                      return <div key={i}>{cleanLine}</div>;
                    })}
                  </div>

                  {/* Metadata Chips on User Messages */}
                  {msg.sender === 'user' && msg.sentiment && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-300">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800">
                        Sentiment: {msg.sentiment.emotion}
                      </span>
                      {msg.intent && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-800">
                          Intent: {msg.intent.label}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Harvested Entities */}
                  {msg.entities && msg.entities.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.entities.map((ent, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-mono flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3 text-slate-400" />
                          <span>{ent.label}: {ent.value}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Ticket Escalation Notice */}
                  {msg.ticketCreated && (
                    <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-slate-900 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                          Escalated to human tier-2 support
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-semibold uppercase">
                          {msg.ticketCreated.priority} priority
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 mb-2">
                        Ticket ID <span className="font-mono font-semibold text-slate-900">{msg.ticketCreated.id}</span> dispatched to Zendesk and Salesforce queue.
                      </p>
                      <button
                        onClick={onNavigateToCrm}
                        className="w-full py-1.5 rounded bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                      >
                        Inspect in CRM queue <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-md bg-slate-800 text-white flex-shrink-0 flex items-center justify-center text-xs font-medium mt-1">
                    <User className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 animate-enter items-center">
                <div className="w-7 h-7 rounded-md bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium">
                  SC
                </div>
                <div className="bg-white rounded-lg px-3.5 py-2 border border-slate-200 text-xs text-slate-500">
                  Processing inquiry...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* CSAT Survey */}
          {messages.length >= 3 && !csatSubmitted && (
            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                Rate this resolution experience
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      setCsatRating(star);
                      setCsatSubmitted(true);
                      confetti({ particleCount: 25, spread: 45, origin: { y: 0.9 } });
                    }}
                    className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                    title={`${star} stars`}
                  >
                    <Star className={`w-3.5 h-3.5 ${csatRating >= star ? 'text-amber-500 fill-amber-500' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {csatSubmitted && (
            <div className="px-5 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Feedback recorded ({csatRating}/5 stars) in PostgreSQL metrics.</span>
            </div>
          )}

          {/* Input Form */}
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
                placeholder="Type an inquiry, order number (#ORD-8491), or describe the issue"
                className="flex-1 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Inspector Sidebar */}
        <div className="space-y-4">
          <SentimentMeter sentiment={currentSentiment} />

          {/* Extracted Details & Policy */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Conversation telemetry
            </h4>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">
                  Active entities
                </span>
                {messages.flatMap(m => m.entities || []).length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {messages.flatMap(m => m.entities || []).slice(-5).map((ent, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono"
                      >
                        {ent.label}: {ent.value}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No order or tracking identifiers in active turn.
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 block mb-1">
                  Escalation triggers
                </span>
                <ul className="text-xs space-y-1 text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>Frustration index ≥ 70%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Legal or fraud terminology</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Standard Tier-1 resolution</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                Integrated with Salesforce Service Cloud and Zendesk Support API.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
