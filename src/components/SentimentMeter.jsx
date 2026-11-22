import React from 'react';
import { AlertCircle, CheckCircle, ShieldAlert, Clock, ArrowUpRight } from 'lucide-react';

export default function SentimentMeter({ sentiment }) {
  const {
    score = 0,
    label = 'Neutral',
    emotion = 'Neutral',
    frustrationLevel = 0,
    escalationRecommended = false,
    escalationReason = null
  } = sentiment || {};

  // Clean, professional color schemes
  const getBadgeStyle = () => {
    if (frustrationLevel >= 70 || score <= -0.55) {
      return {
        bg: 'bg-red-50 text-red-700 border-red-200',
        bar: 'bg-red-500',
        dot: 'bg-red-500',
        text: 'text-red-700',
        status: 'High Urgency / Escalated'
      };
    }
    if (frustrationLevel >= 40 || score < -0.1) {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        bar: 'bg-amber-500',
        dot: 'bg-amber-500',
        text: 'text-amber-800',
        status: 'Moderate Concern'
      };
    }
    if (score > 0.4) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        bar: 'bg-emerald-500',
        dot: 'bg-emerald-500',
        text: 'text-emerald-700',
        status: 'Positive Interaction'
      };
    }
    return {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      bar: 'bg-slate-400',
      dot: 'bg-slate-400',
      text: 'text-slate-700',
      status: 'Standard Inquiry'
    };
  };

  const badge = getBadgeStyle();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Customer Sentiment Analysis
          </h4>
          <p className="text-[11px] text-slate-500">Real-time intent and urgency assessment</p>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${badge.bg}`}>
          {emotion}
        </span>
      </div>

      {/* Urgency Meter */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-600 font-medium">Customer Urgency Index</span>
          <span className={`font-mono font-semibold ${badge.text}`}>
            {frustrationLevel}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full ${badge.bar} transition-all duration-300 rounded-full`}
            style={{ width: `${Math.max(frustrationLevel, 4)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>0% Calm</span>
          <span>50%</span>
          <span>100% Critical</span>
        </div>
      </div>

      {/* Sentiment Score & Routing */}
      <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <span className="text-slate-500 block text-[10px] uppercase font-medium">
            Polarity Score
          </span>
          <span className="font-mono font-semibold text-slate-900 text-sm">
            {score > 0 ? `+${score}` : score}
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <span className="text-slate-500 block text-[10px] uppercase font-medium">
            Routing Status
          </span>
          <span className="font-medium text-slate-900 text-xs">
            {badge.status}
          </span>
        </div>
      </div>

      {/* Escalation notice if triggered */}
      {escalationRecommended && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>Escalation Rule Triggered</span>
          </div>
          <p className="text-[11px] text-red-700">
            {escalationReason || 'Customer frustration exceeds automated threshold.'}
          </p>
        </div>
      )}

      {!escalationRecommended && (
        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="text-[11px]">Handling autonomously via Tier-1 Support resolution engine.</span>
        </div>
      )}
    </div>
  );
}
