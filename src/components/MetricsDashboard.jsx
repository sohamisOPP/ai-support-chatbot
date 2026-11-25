import React, { useState } from 'react';
import { 
  Clock, DollarSign, Award, CheckCircle2, 
  ArrowDownRight, ArrowUpRight, ShieldCheck
} from 'lucide-react';

export default function MetricsDashboard() {
  const [ticketVolume, setTicketVolume] = useState(15000);

  const humanCostPerTicket = 8.50;
  const aiCostPerTicket = 0.14;
  const deflectionRate = 0.72;

  const humanTotal = ticketVolume * humanCostPerTicket;
  const aiTotal = (ticketVolume * (1 - deflectionRate) * humanCostPerTicket) + (ticketVolume * aiCostPerTicket);
  const monthlySavings = Math.round(humanTotal - aiTotal);
  const hoursSaved = Math.round((ticketVolume * deflectionRate * 18) / 60);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 shadow-sm">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Operational Metrics
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] sm:text-xs text-slate-500">
              Project B Performance Benchmarks
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
            Support Economics &amp; Resolution Quality
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Empirical metrics evaluating first-contact resolution, operational expense reduction, and customer satisfaction.
          </p>
        </div>

        <div className="text-xs text-slate-600 font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 self-start md:self-auto">
          50,000+ benchmarked interactions
        </div>
      </div>

      {/* 4 Metric Cards (2x2 on phones >= 360px, 4 cols on desktop) */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Response Time */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">First response</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 flex-shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">0.8s</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs text-emerald-700 font-medium">
              <ArrowDownRight className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Down from 4.2h (-99%)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 sm:mt-4 pt-2 border-t border-slate-100">
            Immediate Tier-1 answers.
          </p>
        </div>

        {/* Card 2: CSAT */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">CSAT score</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 flex-shrink-0">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              4.88<span className="text-xs sm:text-sm font-normal text-slate-500"> / 5.0</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs text-emerald-700 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
              <span>+32% vs median</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 sm:mt-4 pt-2 border-t border-slate-100">
            Early frustration mitigation.
          </p>
        </div>

        {/* Card 3: Cost */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Unit cost</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 flex-shrink-0">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">$0.14</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs text-emerald-700 font-medium">
              <ArrowDownRight className="w-3.5 h-3.5 flex-shrink-0" />
              <span>vs $8.50 agent baseline</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 sm:mt-4 pt-2 border-t border-slate-100">
            98% cost reduction.
          </p>
        </div>

        {/* Card 4: Deflection */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Deflection</span>
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 flex-shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">72.4%</div>
            <div className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Autonomous triage</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 sm:mt-4 pt-2 border-t border-slate-100">
            Urgent tickets escalated.
          </p>
        </div>
      </div>

      {/* ROI Calculator Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 sm:space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Cost Reduction Calculator
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Estimate monthly operational savings based on your monthly ticket volume
            </p>
          </div>

          <div className="text-left md:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-0 border-slate-200">
            <span className="text-xs text-slate-500 block">Monthly inquiries</span>
            <span className="text-base font-semibold font-mono text-slate-900 tabular-nums">
              {ticketVolume.toLocaleString()} tickets / month
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-1.5">
          <div className="py-2">
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={ticketVolume}
              onChange={(e) => setTicketVolume(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>1k</span>
            <span className="hidden sm:inline">25,000</span>
            <span>50k</span>
            <span className="hidden sm:inline">75,000</span>
            <span>100k tickets</span>
          </div>
        </div>

        {/* Financial Projection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-3 border-t border-slate-100">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block font-medium">Traditional human support</span>
            <span className="text-xl font-bold text-slate-900 font-mono mt-1 block tabular-nums">
              ${humanTotal.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">Based on $8.50 per agent ticket</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block font-medium">With Soham Chatbot</span>
            <span className="text-xl font-bold text-slate-900 font-mono mt-1 block tabular-nums">
              ${Math.round(aiTotal).toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">72% resolved at $0.14 automated rate</p>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold block">Net monthly savings</span>
            <span className="text-xl font-bold text-emerald-900 font-mono mt-1 block tabular-nums">
              ${monthlySavings.toLocaleString()}
            </span>
            <p className="text-[11px] text-emerald-700 mt-1">
              +{hoursSaved.toLocaleString()} agent hours redirected to strategic accounts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
