import React from 'react';
import { Flame, AlertTriangle, Smile, Meh, Frown, ShieldAlert, HeartHandshake } from 'lucide-react';

export default function SentimentMeter({ sentiment }) {
  const {
    score = 0,
    label = 'Neutral',
    emotion = 'Neutral',
    frustrationLevel = 0,
    escalationRecommended = false,
    escalationReason = null
  } = sentiment || {};

  // Color mapping based on frustration and score
  const getColorScheme = () => {
    if (frustrationLevel >= 70 || score <= -0.55) {
      return {
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
        bar: 'bg-gradient-to-r from-orange-500 to-rose-500',
        badge: 'bg-rose-500 text-white',
        icon: Flame
      };
    }
    if (frustrationLevel >= 40 || score < -0.1) {
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        bar: 'bg-gradient-to-r from-yellow-500 to-amber-500',
        badge: 'bg-amber-500 text-slate-900',
        icon: Frown
      };
    }
    if (score > 0.4) {
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        bar: 'bg-gradient-to-r from-teal-500 to-emerald-500',
        badge: 'bg-emerald-500 text-white',
        icon: Smile
      };
    }
    return {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      text: 'text-indigo-400',
      bar: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      badge: 'bg-indigo-500 text-white',
      icon: Meh
    };
  };

  const colors = getColorScheme();
  const IconComponent = colors.icon;

  // Normalized needle position from -1.0 (0%) to +1.0 (100%)
  const needlePercent = Math.min(100, Math.max(0, ((score + 1) / 2) * 100));

  return (
    <div className={`p-4 rounded-2xl glass-panel ${colors.border} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${colors.bg}`}>
            <IconComponent className={`w-4 h-4 ${colors.text}`} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Real-Time Sentiment Engine
            </h4>
            <p className="text-[11px] text-slate-400">Continuous VADER/NLP Evaluation</p>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colors.badge}`}>
          {emotion}
        </span>
      </div>

      {/* Speedometer Track */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-rose-400 flex items-center gap-1 font-medium">
            <Flame className="w-3 h-3" /> Furious (-1.0)
          </span>
          <span className="text-slate-400 font-mono font-medium">
            Polarity: <span className={colors.text}>{score > 0 ? `+${score}` : score}</span>
          </span>
          <span className="text-emerald-400 flex items-center gap-1 font-medium">
            Delighted (+1.0) <Smile className="w-3 h-3" />
          </span>
        </div>

        {/* Polarity Slider Bar */}
        <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-amber-400 via-indigo-400 to-emerald-400 opacity-30" />
          {/* Active pointer marker */}
          <div
            className="absolute top-0 bottom-0 w-2.5 bg-white rounded-full shadow-lg shadow-white/50 transform -translate-x-1/2 transition-all duration-300 border border-slate-900"
            style={{ left: `${needlePercent}%` }}
          />
        </div>
      </div>

      {/* Frustration & Escalation Metric */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Frustration Score
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${colors.bar} transition-all duration-300`}
                style={{ width: `${frustrationLevel}%` }}
              />
            </div>
            <span className={`font-mono font-semibold ${colors.text}`}>
              {frustrationLevel}%
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Escalation Rule
          </span>
          {escalationRecommended ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 animate-pulse">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              Triggered (&gt;70% or Demand)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
              <HeartHandshake className="w-3 h-3" />
              Tier-1 Autonomous Handle
            </span>
          )}
        </div>
      </div>

      {escalationRecommended && escalationReason && (
        <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
          <span><strong>Escalation Cause:</strong> {escalationReason}</span>
        </div>
      )}
    </div>
  );
}
