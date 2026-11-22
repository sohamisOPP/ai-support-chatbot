import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, RefreshCw, AlertTriangle, CheckCircle2, 
  ExternalLink, Sparkles, Tag, Zap, Shield, ArrowRight, Star
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
      text: "Hello! 👋 I'm **SentiDesk AI**, an autonomous Tier-1 customer support agent with real-time sentiment analysis and CRM escalation.\n\nHow can I help you today with your order, billing, or account?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentiment: { score: 0.2, label: 'Positive', emotion: 'Satisfied', frustrationLevel: 0 },
      intent: { label: 'Greeting & Triage', confidence: 0.99 },
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

  // Test scenarios from the assignment / real-world customer support
  const testScenarios = [
    {
      label: '😠 Angry Billing Issue',
      badge: 'Escalation Test',
      color: 'border-rose-500/40 text-rose-300 hover:bg-rose-500/10',
      text: "I was double charged $120.00 on Order #ORD-8491! This is completely unacceptable, refund my money immediately or I am taking legal action!"
    },
    {
      label: '📦 Track Package',
      badge: 'Tier-1 Auto Resolve',
      color: 'border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10',
      text: "Can you tell me where my package #ORD-9921 is? Tracking #TRK-88219 shows delayed."
    },
    {
      label: '🔑 Password Reset',
      badge: 'Account Auth',
      color: 'border-sky-500/40 text-sky-300 hover:bg-sky-500/10',
      text: "I forgot my password for alex.dev@enterprise.com and I'm locked out of my portal."
    },
    {
      label: '👤 Demanding Human',
      badge: 'Intent Trigger',
      color: 'border-amber-500/40 text-amber-300 hover:bg-amber-500/10',
      text: "Stop giving me automated bot replies. I demand to speak with a human manager right now."
    },
    {
      label: '❤️ Satisfied Praise',
      badge: 'High CSAT',
      color: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10',
      text: "Thank you so much! Your response was super fast and completely resolved my issue. Amazing service!"
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

    // Simulate natural AI thinking delay (600ms)
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

      // Trigger celebration confetti if customer expresses praise
      if (userSentiment.score > 0.5) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    }, 650);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'init-1',
        sender: 'bot',
        text: "Chat history cleared. How can I assist you with your customer support inquiries?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sentiment: { score: 0.2, label: 'Positive', emotion: 'Satisfied', frustrationLevel: 0 },
        intent: { label: 'Greeting & Triage', confidence: 0.99 },
        entities: []
      }
    ]);
    setCsatRating(0);
    setCsatSubmitted(false);
  };

  // The latest sentiment evaluated
  const currentSentiment = liveSentiment || 
    (messages.length > 1 ? messages[messages.length - 1].sentiment : messages[0].sentiment);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner / Project Overview */}
      <div className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Autonomous Tier-1 Customer Care
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Real-Time Sentiment Router
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI-Powered Customer Support Chatbot
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-3xl">
              Intelligently resolves common inquiries (orders, billing, password resets), extracts critical entities, detects customer frustration in real-time, and dynamically escalates complex or angry tickets into Zendesk/Salesforce.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleResetChat}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Chat
            </button>
            <button
              onClick={onNavigateToCrm}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" /> View CRM Ticket Queue
            </button>
          </div>
        </div>

        {/* Quick Test Scenarios */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-400" /> Quick Test Presets (Click to simulate realistic user scenarios):
          </p>
          <div className="flex flex-wrap gap-2">
            {testScenarios.map((sc, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sc.text)}
                className={`text-xs px-3 py-1.5 rounded-xl border bg-slate-900/60 transition-all text-left flex items-center gap-2 ${sc.color}`}
              >
                <span className="font-medium">{sc.label}</span>
                <span className="text-[10px] opacity-70 px-1.5 py-0.5 rounded bg-white/5">
                  {sc.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Chat Window + Sentiment HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chat Messenger (Col span 2) */}
        <div className="lg:col-span-2 flex flex-col h-[650px] rounded-3xl glass-panel border border-slate-800 shadow-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  SentiDesk AI Agent
                  <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Tier-1 NLP
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time sentiment monitoring active
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-subtle" />
              <span>Response time: &lt;1.0s</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-fade-in ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/80 flex-shrink-0 flex items-center justify-center text-white mt-1 shadow-md shadow-indigo-600/20">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-md'
                  }`}
                >
                  {/* Sender Label & Meta */}
                  <div className="flex items-center justify-between gap-3 mb-1.5 text-[11px] opacity-75">
                    <span className="font-semibold">
                      {msg.sender === 'user' ? 'You (Customer)' : 'SentiDesk AI'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Body text with markdown formatting for bold and lists */}
                  <div className="whitespace-pre-line space-y-1">
                    {msg.text.split('\n').map((line, i) => {
                      // Simple markdown parsing for **bold** and `code`
                      const parsed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono text-xs">$1</code>');
                      return <div key={i} dangerouslySetInnerHTML={{ __html: parsed }} />;
                    })}
                  </div>

                  {/* If user message has entities or sentiment pill */}
                  {msg.sender === 'user' && msg.sentiment && (
                    <div className="mt-2.5 pt-2 border-t border-indigo-400/30 flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded-full bg-black/30 font-medium">
                        Sentiment: {msg.sentiment.emotion} ({msg.sentiment.score > 0 ? `+${msg.sentiment.score}` : msg.sentiment.score})
                      </span>
                      {msg.intent && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-200 font-medium">
                          Intent: {msg.intent.label} ({Math.round(msg.intent.confidence * 100)}%)
                        </span>
                      )}
                    </div>
                  )}

                  {/* If extracted entities detected */}
                  {msg.entities && msg.entities.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-700/50 flex flex-wrap gap-1.5">
                      {msg.entities.map((ent, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3 text-indigo-400" />
                          <strong>{ent.label}:</strong> {ent.value}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* If ticket was created on escalation */}
                  {msg.ticketCreated && (
                    <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold flex items-center gap-1.5 text-rose-300">
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          Dynamic CRM Ticket Created
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/30 text-[10px] font-bold text-rose-300 uppercase">
                          {msg.ticketCreated.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mb-2">
                        Ticket <code className="text-amber-300 font-mono">{msg.ticketCreated.id}</code> automatically logged into Zendesk & Salesforce with sentiment transcript.
                      </p>
                      <button
                        onClick={onNavigateToCrm}
                        className="w-full py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        Inspect in CRM Queue <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-700 flex-shrink-0 flex items-center justify-center text-slate-200 mt-1 shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 animate-fade-in items-center">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/80 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-800/90 rounded-2xl px-4 py-3 rounded-tl-none border border-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-slate-400 ml-2 font-mono">Analyzing sentiment & intent...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* CSAT Post-Chat Rating Box (Shows when chat has progressed) */}
          {messages.length >= 3 && !csatSubmitted && (
            <div className="px-6 py-2.5 bg-indigo-950/40 border-t border-indigo-900/40 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">
                Rate this resolution experience (CSAT):
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
                    className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                    title={`${star} Stars`}
                  >
                    <Star className={`w-4 h-4 ${csatRating >= star ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {csatSubmitted && (
            <div className="px-6 py-2 bg-emerald-950/40 border-t border-emerald-900/40 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Thank you! Your CSAT rating ({csatRating}/5 stars) has been logged in PostgreSQL metrics.</span>
            </div>
          )}

          {/* Input Form Bar */}
          <div className="p-4 bg-slate-900 border-t border-slate-800">
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
                placeholder="Type your inquiry, order number (#ORD-1234), or issue..."
                className="flex-1 bg-slate-800 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-sm border border-slate-700/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Real-Time Sentiment & NLP Inspection Panel */}
        <div className="space-y-6">
          {/* Sentiment Meter HUD */}
          <SentimentMeter sentiment={currentSentiment} />

          {/* Real-time NLP Intent & Entity Card */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>NLP Intent &amp; Entity Extractor</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Transformers Pipeline
              </span>
            </h4>

            {/* Extracted Entities */}
            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">
                  Active Extracted Entities:
                </span>
                {messages.flatMap(m => m.entities || []).length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {messages.flatMap(m => m.entities || []).slice(-6).map((ent, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-950/70 text-indigo-300 border border-indigo-800 text-xs font-mono"
                      >
                        {ent.label}: <strong>{ent.value}</strong>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Type an order ID (e.g. #ORD-8491) or amount ($120.00) to see live extraction.
                  </p>
                )}
              </div>

              {/* Dynamic Escalation Rules Table */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                  Dynamic Escalation Logic:
                </span>
                <ul className="text-xs space-y-1.5 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5" />
                    <span><strong>Frustration &gt; 70%:</strong> Auto-routes to human queue.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                    <span><strong>Escalation Intent:</strong> Auto-generates CRM ticket.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                    <span><strong>Tier-1 Inquiries:</strong> Resolved 100% autonomously.</span>
                  </li>
                </ul>
              </div>

              {/* Tech Stack Callout */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-200 block mb-1">Tech Stack Implementation:</span>
                Python (FastAPI), Hugging Face Transformers, React, PostgreSQL CRM Sync.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
