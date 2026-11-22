import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function SentimentMeter({ sentiment }) {
  const {
    score = 0,
    label = 'Neutral',
    emotion = 'Neutral',
    frustrationLevel = 0,
    escalationRecommended = false,
    escalationReason = null
  } = sentiment || {};

  // Semantic styles following single neutral ramp with restrained semantic accents
  const getBadgeStyle = () => {
    if (frustrationLevel >= 70 || score <= -0.55) {
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        bar: 'bg-rose-600',
        text: 'text-rose-700',
        status: 'Escalated to Tier-2'
      };
    }
    if (frustrationLevel >= 40 || score < -0.1) {
      return {
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        bar: 'bg-amber-500',
        text: 'text-amber-800',
        status: 'Moderate attention'
      };
    }
    if (score > 0.4) {
      return {
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        bar: 'bg-emerald-600',
        text: 'text-emerald-800',
        status: 'Positive sentiment'
      };
    }
    return {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      bar: 'bg-slate-500',
      text: 'text-slate-700',
      status: 'Standard inquiry'
    };
  };

  const style = getBadgeStyle();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Sentiment telemetry
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">Real-time intent and urgency assessment</p>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${style.badge}`}>
          {emotion}
        </span>
      </div>

      {/* Urgency Meter */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-600 font-medium">Urgency index</span>
          <span className={`font-mono font-semibold tabular-nums ${style.text}`}>
            {frustrationLevel}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded overflow-hidden border border-slate-200/60">
          <div
            className={`h-full ${style.bar} transition-all duration-200`}
            style={{ width: `${Math.max(frustrationLevel, 4)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>0% Calm</span>
          <span>50% Threshold</span>
          <span>100% Critical</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-slate-500 block text-[10px] uppercase font-semibold tracking-wider">
            Polarity score
          </span>
          <span className="font-mono font-semibold text-slate-900 text-sm mt-0.5 block tabular-nums">
            {score > 0 ? `+${score}` : score}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-slate-500 block text-[10px] uppercase font-semibold tracking-wider">
            Routing status
          </span>
          <span className="font-medium text-slate-800 text-xs mt-0.5 block truncate">
            {style.status}
          </span>
        </div>
      </div>

      {/* Escalation notice if triggered */}
      {escalationRecommended && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-700 flex-shrink-0" />
            <span>Escalation rule triggered</span>
          </div>
          <p className="text-[11px] text-rose-800 leading-normal">
            {escalationReason || 'Customer urgency index exceeds automated resolution threshold.'}
          </p>
        </div>
      )}

      {!escalationRecommended && (
        <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-lg text-xs text-slate-600 flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="text-[11px]">Handled autonomously via Tier-1 support engine.</span>
        </div>
      )}
    </div>
  );
}
