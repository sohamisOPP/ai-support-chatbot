import React, { useState } from 'react';
import { 
  Cpu, Database, Layers, Server, Globe, 
  Code2, Copy, Check
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

app = FastAPI(title="SentiDesk API", version="1.0.0")

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
            f"I have detected your frustration and routed this "
            f"inquiry to a Senior Support Specialist. Ticket ID: {ticket_id}."
        )
    else:
        # Tier-1 Autonomous Resolution
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

# Load lightweight sequence classification model
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Overview Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          System Architecture &amp; Stack
        </h2>
        <p className="text-sm text-slate-600 mt-0.5 max-w-3xl">
          Complete implementation matching <strong>Project B Specifications</strong>: Python (FastAPI), Hugging Face Transformers &amp; OpenAI API, React frontend, and PostgreSQL with CRM webhooks.
        </p>
      </div>

      {/* 4 Pipeline Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Layer 1</span>
              <Globe className="w-4 h-4 text-slate-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">React Frontend</h4>
            <p className="text-xs text-slate-500 mt-1">
              Customer support messenger, real-time sentiment gauge, and CSAT collector.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
            React 18 • Tailwind CSS
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Layer 2</span>
              <Server className="w-4 h-4 text-slate-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">FastAPI Gateway</h4>
            <p className="text-xs text-slate-500 mt-1">
              High-throughput async REST and WebSocket endpoints with session tracking.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
            Python 3.11 • Uvicorn
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Layer 3</span>
              <Cpu className="w-4 h-4 text-slate-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Sentiment &amp; NLP Model</h4>
            <p className="text-xs text-slate-500 mt-1">
              DistilBERT sequence classification and intent/entity extraction.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
            PyTorch • Transformers
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Layer 4</span>
              <Database className="w-4 h-4 text-slate-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">PostgreSQL &amp; CRM Sync</h4>
            <p className="text-xs text-slate-500 mt-1">
              Stores transcripts, dispatches tickets to Zendesk &amp; Salesforce.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
            PostgreSQL • REST Webhooks
          </div>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-200">
              Backend Source Code
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-xs font-mono">
              <button
                onClick={() => setActiveCodeTab('fastapi')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeCodeTab === 'fastapi'
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                fastapi_server.py
              </button>
              <button
                onClick={() => setActiveCodeTab('transformers')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeCodeTab === 'transformers'
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                sentiment_model.py
              </button>
              <button
                onClick={() => setActiveCodeTab('database')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeCodeTab === 'database'
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                database_models.py
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs flex items-center gap-1 transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-slate-950 overflow-x-auto text-xs font-mono leading-relaxed text-slate-300 max-h-96">
          <pre>{codeSnippets[activeCodeTab]}</pre>
        </div>
      </div>
    </div>
  );
}
