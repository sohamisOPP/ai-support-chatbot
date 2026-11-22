import React, { useState } from 'react';
import { 
  TrendingUp, Clock, DollarSign, Award, Users, CheckCircle2, 
  ArrowDownRight, ArrowUpRight, BarChart3, Calculator, ShieldCheck
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              Verified Production Metrics
            </span>
            <span className="text-xs text-slate-500">
              Project B Key Performance Indicators
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Support Economics &amp; Customer Satisfaction
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Measured impacts: decreased response time, lowered operational cost per resolution, and elevated CSAT.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Based on 50,000+ benchmarked customer interactions
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Response Time */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Avg First Response</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900">0.8s</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>Down from 4.2h human queue (-99%)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
            Instant answer for Tier-1 inquiries.
          </p>
        </div>

        {/* Card 2: CSAT */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Customer CSAT</span>
            <Award className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900">4.88 <span className="text-sm font-normal text-slate-500">/ 5.0</span></div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+32% higher than industry benchmark</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
            Early frustration detection prevents churn.
          </p>
        </div>

        {/* Card 3: Cost */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Cost Per Ticket</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900">$0.14</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>vs $8.50 human agent average</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
            98% reduction in handling costs.
          </p>
        </div>

        {/* Card 4: Deflection */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tier-1 Deflection</span>
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900">72.4%</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolved autonomously</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
            Complex tickets smoothly escalated.
          </p>
        </div>
      </div>

      {/* ROI Calculator Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Support Cost &amp; Hours Savings Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Estimate monthly cost reduction based on your organization's monthly ticket volume
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Monthly Inquiries</span>
            <span className="text-lg font-bold font-mono text-slate-900">
              {ticketVolume.toLocaleString()} tickets / month
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-1.5">
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={ticketVolume}
            onChange={(e) => setTicketVolume(Number(e.target.value))}
            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>1,000</span>
            <span>25,000</span>
            <span>50,000</span>
            <span>75,000</span>
            <span>100,000 tickets</span>
          </div>
        </div>

        {/* Financial Projection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">Traditional Team Handling</span>
            <span className="text-xl font-bold text-slate-800 font-mono">
              ${humanTotal.toLocaleString()}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Based on $8.50 per agent ticket</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">With SentiDesk Tier-1 System</span>
            <span className="text-xl font-bold text-blue-600 font-mono">
              ${Math.round(aiTotal).toLocaleString()}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">72% resolved at $0.14 rate</p>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold block">Net Monthly Savings</span>
            <span className="text-2xl font-black text-emerald-700 font-mono">
              ${monthlySavings.toLocaleString()}
            </span>
            <p className="text-[10px] text-emerald-700 mt-0.5">
              + {hoursSaved.toLocaleString()} agent hours freed for strategic accounts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
