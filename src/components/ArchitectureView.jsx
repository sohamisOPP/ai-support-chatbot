import React, { useState } from 'react';
import { 
  Cpu, Database, Layers, GitPullRequest, Server, Globe, 
  Terminal, ShieldCheck, ArrowRight, Code2, Copy, Check
} from 'lucide-react';

export default function ArchitectureView() {
  const [activeCodeTab, setActiveCodeTab] = useState('fastapi');
  const [copied, setCopied] = useState(false);

  const codeSnippets = {
    fastapi: `from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from sentiment_service import analyze_text_sentiment
from crm_connector import dispatch_to_salesforce

app = FastAPI(title="SentiDesk AI - Tier-1 Support API", version="2.0.0")

class CustomerMessage(BaseModel):
    session_id: str
    message: str
    language: Optional[str] = "en"

class AnalysisResponse(BaseModel):
    reply: str
    sentiment_score: float
    sentiment_label: str
    frustration_index: int
    escalation_triggered: bool
    ticket_id: Optional[str] = None

@app.post("/api/v1/chat", response_model=AnalysisResponse)
async def process_message(payload: CustomerMessage):
    # 1. Real-time NLP & Sentiment inference
    analysis = analyze_text_sentiment(payload.message)
    
    # 2. Dynamic Escalation Trigger Check
    ticket_id = None
    if analysis["frustration_index"] >= 70 or analysis["escalation_demanded"]:
        ticket_id = await dispatch_to_salesforce(
            session_id=payload.session_id,
            transcript=payload.message,
            sentiment=analysis["label"],
            priority="URGENT" if analysis["frustration_index"] > 80 else "HIGH"
        )
        reply = (
            f"I have detected your frustration and immediately routed this "
            f"inquiry to a Senior Human Specialist. CRM Ticket ID: {ticket_id}."
        )
    else:
        # Tier-1 Autonomous Resolution Engine
        reply = resolve_tier1_inquiry(payload.message, analysis["intent"])

    return AnalysisResponse(
        reply=reply,
        sentiment_score=analysis["score"],
        sentiment_label=analysis["label"],
        frustration_index=analysis["frustration_index"],
        escalation_triggered=bool(ticket_id),
        ticket_id=ticket_id
    )`,
    transformers: `import torch
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification

# Load lightweight high-throughput sentiment classification model
MODEL_NAME = "distilbert/distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

classifier = pipeline(
    "sentiment-analysis", 
    model=model, 
    tokenizer=tokenizer,
    device=0 if torch.cuda.is_available() else -1
)

def analyze_text_sentiment(text: str) -> dict:
    """Evaluates sentiment polarity and emotional frustration level."""
    result = classifier(text[:512])[0]
    raw_label = result["label"]
    confidence = float(result["score"])

    # Map to continuous polarity score (-1.0 to +1.0)
    polarity = confidence if raw_label == "POSITIVE" else -confidence
    frustration = int((1.0 - polarity) * 50) if polarity < 0 else 0

    return {
        "score": round(polarity, 2),
        "label": "Negative" if polarity < -0.1 else ("Positive" if polarity > 0.1 else "Neutral"),
        "frustration_index": frustration,
        "escalation_demanded": any(k in text.lower() for k in ["supervisor", "manager", "lawsuit", "refund now"])
    }`,
    database: `from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

Base = declarative_base()

class TicketRecord(Base):
    __tablename__ = "crm_escalated_tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_uuid = Column(String(32), unique=True, index=True)
    customer_id = Column(String(64), index=True)
    detected_intent = Column(String(128))
    sentiment_label = Column(String(32))
    frustration_score = Column(Integer)
    priority = Column(String(16), default="HIGH")
    crm_external_id = Column(String(64), nullable=True) # Zendesk / Salesforce reference
    transcript = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(32), default="OPEN")

# PostgreSQL engine configuration
DATABASE_URL = "postgresql+psycopg2://postgres:password@localhost:5432/sentidesk_db"
engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      {/* Overview Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            System Architecture
          </span>
          <span className="text-xs text-slate-400">
            End-to-End Enterprise Flow
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Tech Stack &amp; Architectural Pipeline
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Designed according to <strong>Project B Specifications</strong>: Python (FastAPI), OpenAI API &amp; Hugging Face Transformers for sentiment classification, React frontend with real-time HUD, and PostgreSQL with bidirectional Salesforce / Zendesk CRM webhooks.
        </p>
      </div>

      {/* Visual Pipeline Flow Chart */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Interactive System Pipeline Flow
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Node 1: Client */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-lg relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-indigo-400">Layer 1</span>
                <Globe className="w-4 h-4 text-indigo-400" />
              </div>
              <h4 className="text-sm font-bold text-white">React 18 Frontend</h4>
              <p className="text-xs text-slate-400 mt-1">
                Real-time sentiment speedometer HUD, interactive message stream, instant CSAT rating collector.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] text-indigo-300 font-mono">
              Vite • Tailwind CSS
            </div>
          </div>

          {/* Node 2: Gateway */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30 shadow-lg relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-purple-400">Layer 2</span>
                <Server className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="text-sm font-bold text-white">FastAPI Gateway</h4>
              <p className="text-xs text-slate-400 mt-1">
                Async high-throughput REST &amp; WebSocket endpoint routing, session caching, rate-limiting.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] text-purple-300 font-mono">
              Python 3.11 • Uvicorn
            </div>
          </div>

          {/* Node 3: NLP Inference */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-lg relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-emerald-400">Layer 3</span>
                <Cpu className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white">NLP &amp; Sentiment Model</h4>
              <p className="text-xs text-slate-400 mt-1">
                Hugging Face DistilBERT fine-tuned sequence classification + OpenAI / Gemini intent extractor.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] text-emerald-300 font-mono">
              PyTorch • Transformers
            </div>
          </div>

          {/* Node 4: CRM & DB */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 shadow-lg relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase text-amber-400">Layer 4</span>
                <Database className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-white">PostgreSQL &amp; CRM Sync</h4>
              <p className="text-xs text-slate-400 mt-1">
                Stores conversation transcripts, generates tickets in Salesforce / Zendesk upon high frustration.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] text-amber-300 font-mono">
              PostgreSQL • REST Webhooks
            </div>
          </div>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Production Code Implementation
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              <button
                onClick={() => setActiveCodeTab('fastapi')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeCodeTab === 'fastapi'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                FastAPI Gateway
              </button>
              <button
                onClick={() => setActiveCodeTab('transformers')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeCodeTab === 'transformers'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hugging Face Pipeline
              </button>
              <button
                onClick={() => setActiveCodeTab('database')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeCodeTab === 'database'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                PostgreSQL Schema
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1 transition-all"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Code Block */}
        <div className="p-4 bg-[#070b14] overflow-x-auto text-xs font-mono leading-relaxed text-slate-300 max-h-96">
          <pre>{codeSnippets[activeCodeTab]}</pre>
        </div>
      </div>
    </div>
  );
}
