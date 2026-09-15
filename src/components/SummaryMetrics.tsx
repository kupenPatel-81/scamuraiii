import React from 'react';
import { MonitoredNode, AnomalyAlert } from '../types';
import { Shield, AlertOctagon, Flame, Activity, WifiOff } from 'lucide-react';

interface SummaryMetricsProps {
  nodes: MonitoredNode[];
  alerts: AnomalyAlert[];
  onSelectMetricFilter?: (filterType: string) => void;
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({
  nodes,
  alerts,
  onSelectMetricFilter,
}) => {
  const totalMonitored = nodes.length;
  const activeAnomalies = alerts.filter(
    (a) => a.status === 'active' || a.status === 'escalated'
  ).length;
  const criticalRiskCount = alerts.filter(
    (a) => a.severity === 'critical' && a.status !== 'false_positive'
  ).length;

  const totalRiskSum = nodes.reduce((acc, n) => acc + n.risk_score, 0);
  const averageRisk = Math.round(totalRiskSum / (nodes.length || 1));

  const offlineOrTampered = nodes.filter(
    (n) => n.state === 'offline' || n.state === 'tamper' || n.status === 'attention'
  ).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {/* 1. Monitored Fleet Card */}
      <div
        id="kpi-card-monitored"
        onClick={() => onSelectMetricFilter?.('all')}
        className="group relative bg-[#0b1322] hover:bg-[#0e172a] transition-all duration-200 border border-slate-800/90 hover:border-cyan-500/40 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Endpoints monitored</span>
          <Shield className="w-3.5 h-3.5 text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {totalMonitored}
          </span>
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          18 Lockers &bull; 14 Doors
        </div>
      </div>

      {/* 2. Active Anomalies Card */}
      <div
        id="kpi-card-anomalies"
        onClick={() => onSelectMetricFilter?.('active')}
        className="group relative bg-[#0b1322] hover:bg-[#0e172a] transition-all duration-200 border border-slate-800/90 hover:border-amber-500/40 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Active anomalies</span>
          <AlertOctagon className="w-3.5 h-3.5 text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="my-2 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
            {activeAnomalies}
          </span>
          <span className="text-xs text-amber-400/80 font-medium">unresolved</span>
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          Current threat states
        </div>
      </div>

      {/* 3. Critical Risk (>=80) Card */}
      <div
        id="kpi-card-critical"
        onClick={() => onSelectMetricFilter?.('critical')}
        className="group relative bg-[#0b1322] hover:bg-[#0e172a] transition-all duration-200 border border-slate-800/90 hover:border-rose-500/50 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Critical risk</span>
          <Flame className="w-3.5 h-3.5 text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />
        </div>
        <div className="my-2 flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tracking-tight">
            {criticalRiskCount}
          </span>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
        </div>
        <div className="text-[11px] text-rose-300/80 font-medium truncate">
          Risk score &ge; 80
        </div>
      </div>

      {/* 4. Average Risk Score */}
      <div
        id="kpi-card-avg-risk"
        className="group relative bg-[#0b1322] hover:bg-[#0e172a] transition-all duration-200 border border-slate-800/90 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm"
      >
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Average risk</span>
          <Activity className="w-3.5 h-3.5 text-cyan-400 opacity-60" />
        </div>
        <div className="my-2 flex items-baseline space-x-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            {averageRisk}
          </span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          Across visible fleet
        </div>
      </div>

      {/* 5. Offline / Tampered Lockers Card */}
      <div
        id="kpi-card-offline"
        onClick={() => onSelectMetricFilter?.('offline')}
        className="col-span-2 sm:col-span-1 group relative bg-[#0b1322] hover:bg-[#0e172a] transition-all duration-200 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm cursor-pointer"
      >
        <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Offline / Attention</span>
          <WifiOff className="w-3.5 h-3.5 text-slate-400 opacity-60" />
        </div>
        <div className="my-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-200 font-mono tracking-tight">
            {offlineOrTampered}
          </span>
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          Current simulated state
        </div>
      </div>
    </div>
  );
};
