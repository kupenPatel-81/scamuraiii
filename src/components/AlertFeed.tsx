import React, { useState } from 'react';
import { AnomalyAlert, DashboardFilters } from '../types';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ArrowUpRight,
  Filter,
  Search,
  KeyRound,
  DoorClosed,
  Clock,
  ExternalLink,
  ThumbsDown,
  Sparkles,
  MapPin,
  ChevronRight,
} from 'lucide-react';

interface AlertFeedProps {
  alerts: AnomalyAlert[];
  filters: DashboardFilters;
  onUpdateFilters: (filters: Partial<DashboardFilters>) => void;
  onSelectAlert: (alert: AnomalyAlert) => void;
  onAcknowledge: (id: string) => void;
  onEscalate: (id: string) => void;
  onMarkFalsePositive: (id: string) => void;
  onViewTravelMap: (alert: AnomalyAlert) => void;
}

export const AlertFeed: React.FC<AlertFeedProps> = ({
  alerts,
  filters,
  onUpdateFilters,
  onSelectAlert,
  onAcknowledge,
  onEscalate,
  onMarkFalsePositive,
  onViewTravelMap,
}) => {
  const [activeSearch, setActiveSearch] = useState(filters.search);

  // Filter alerts according to state
  const filteredAlerts = alerts.filter((alert) => {
    if (filters.brand !== 'all') {
      if (filters.brand === 'Salto' && alert.source_brand !== 'Salto') return false;
      if (filters.brand === 'Gantner' && alert.source_brand !== 'Gantner') return false;
      if (filters.brand === 'Cross-Brand' && alert.source_brand !== 'Cross-Brand') return false;
    }
    if (filters.severity !== 'all' && alert.severity !== filters.severity) {
      return false;
    }
    if (filters.status !== 'all' && alert.status !== filters.status) {
      return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchName = alert.cardholder_name?.toLowerCase().includes(q);
      const matchId = alert.credential_id?.toLowerCase().includes(q) || alert.id.toLowerCase().includes(q);
      const matchReason = alert.plain_language_reason.toLowerCase().includes(q);
      const matchNode = alert.involved_nodes.some((n) => n.toLowerCase().includes(q));
      if (!matchName && !matchId && !matchReason && !matchNode) return false;
    }
    return true;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />
            <span>Critical</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>High Risk</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
            <span>Medium</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
            Low
          </span>
        );
    }
  };

  const getBrandBadge = (brand: string) => {
    if (brand === 'Salto') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-blue-950/60 text-blue-300 border border-blue-800/60">
          <DoorClosed className="w-3 h-3" />
          <span>Salto Door</span>
        </span>
      );
    }
    if (brand === 'Gantner') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-purple-950/60 text-purple-300 border border-purple-800/60">
          <KeyRound className="w-3 h-3" />
          <span>Gantner Locker</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>Cross-Brand Discrepancy</span>
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'acknowledged':
        return (
          <span className="text-[11px] font-medium text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-900/60">
            Acknowledged
          </span>
        );
      case 'escalated':
        return (
          <span className="text-[11px] font-bold text-rose-300 bg-rose-950/70 px-2 py-0.5 rounded border border-rose-800/80 animate-pulse">
            Escalated to Guard Patrol
          </span>
        );
      case 'false_positive':
        return (
          <span className="text-[11px] font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            Marked False Positive
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60">
            Active Threat
          </span>
        );
    }
  };

  return (
    <div className="bg-[#09101d] rounded-2xl border border-slate-800 p-5 sm:p-6 mb-6 shadow-xl">
      {/* Feed Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Live Threat Engine
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-slate-400 font-medium">Ranked by Severity Score</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            Security Anomaly & Fraud Feed
          </h2>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search credential, door, reason..."
            value={activeSearch}
            onChange={(e) => {
              setActiveSearch(e.target.value);
              onUpdateFilters({ search: e.target.value });
            }}
            className="w-full pl-9 pr-3 py-1.5 bg-[#060a12] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-4 mb-5 border-b border-slate-800/60 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </span>

        {/* Brand filter buttons */}
        <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
          {(['all', 'Salto', 'Gantner', 'Cross-Brand'] as const).map((b) => (
            <button
              key={b}
              onClick={() => onUpdateFilters({ brand: b })}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                filters.brand === b
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {b === 'all' ? 'All Brands' : b}
            </button>
          ))}
        </div>

        {/* Severity filter buttons */}
        <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 ml-auto sm:ml-0">
          {(['all', 'critical', 'high', 'medium'] as const).map((s) => (
            <button
              key={s}
              onClick={() => onUpdateFilters({ severity: s })}
              className={`px-2 py-1 rounded font-medium capitalize transition-all ${
                filters.severity === s
                  ? 'bg-rose-500/20 text-rose-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
          {(['all', 'active', 'acknowledged', 'escalated', 'false_positive'] as const).map((st) => (
            <button
              key={st}
              onClick={() => onUpdateFilters({ status: st })}
              className={`px-2 py-1 rounded font-medium text-[11px] capitalize transition-all ${
                filters.status === st
                  ? 'bg-blue-500/20 text-blue-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="ml-auto text-slate-400 font-mono text-[11px]">
          Showing {filteredAlerts.length} of {alerts.length} alerts
        </span>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="py-12 text-center bg-[#060a12] rounded-xl border border-dashed border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-slate-300">No anomalies match your active filters</p>
            <p className="text-xs text-slate-400 mt-1">Try broadening your brand or severity filter settings.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`group relative bg-[#0b1322] hover:bg-[#0e172a] rounded-xl border transition-all duration-200 p-4 sm:p-5 shadow-sm ${
                alert.severity === 'critical'
                  ? 'border-rose-900/60 hover:border-rose-500/60'
                  : alert.severity === 'high'
                  ? 'border-amber-900/50 hover:border-amber-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left Content */}
                <div className="flex-1">
                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {getSeverityBadge(alert.severity)}
                    {getBrandBadge(alert.source_brand)}
                    {getStatusBadge(alert.status)}
                    <span className="text-[11px] font-mono text-slate-400 ml-auto sm:ml-0">
                      {alert.timestamp}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/50">
                      Score: {alert.score}/100
                    </span>
                  </div>

                  {/* Title & Plain-Language Reason (UX Priority #1) */}
                  <h3
                    onClick={() => onSelectAlert(alert)}
                    className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>{alert.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                  </h3>

                  {/* Highlighted Plain-Language Explanation (as demanded in UX spec) */}
                  <p className="mt-2 text-sm text-slate-200 bg-[#060a12] p-3 rounded-lg border border-slate-800/80 leading-relaxed font-normal">
                    <span className="text-cyan-400 font-semibold mr-1.5">Anomaly Analysis:</span>
                    {alert.plain_language_reason}
                  </p>

                  {/* Quick telemetry badges */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400">Involved Nodes:</span>
                    {alert.involved_nodes.map((node) => (
                      <span
                        key={node}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px]"
                      >
                        {node}
                      </span>
                    ))}

                    {alert.cardholder_name && (
                      <span className="text-slate-400 ml-2">
                        Cardholder: <strong className="text-slate-200">{alert.cardholder_name}</strong>
                        {alert.credential_id && (
                          <span className="text-cyan-400 font-mono ml-1">({alert.credential_id})</span>
                        )}
                      </span>
                    )}

                    {alert.metrics?.speed_kmh && (
                      <span className="ml-auto text-rose-400 font-mono font-bold bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/50">
                        {alert.metrics.speed_kmh} km/h required
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action Column (Acknowledge / Escalate / False Positive workflow) */}
                <div className="flex lg:flex-col items-center sm:items-end justify-end gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-3 lg:pt-0 lg:pl-4">
                  {/* View on Map button for impossible travel */}
                  {alert.type === 'impossible_travel' && (
                    <button
                      onClick={() => onViewTravelMap(alert)}
                      className="w-full px-3 py-1.5 text-xs font-semibold bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View on Vector Map</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectAlert(alert)}
                    className="w-full px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>Inspect Evidence</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center space-x-1.5 w-full">
                    {alert.status !== 'acknowledged' && alert.status !== 'false_positive' && (
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        title="Acknowledge incident"
                        className="flex-1 px-2.5 py-1 text-xs font-medium bg-blue-950/60 hover:bg-blue-900 border border-blue-800/60 text-blue-300 rounded-lg transition-colors"
                      >
                        Ack
                      </button>
                    )}

                    {alert.status !== 'escalated' && alert.status !== 'false_positive' && (
                      <button
                        onClick={() => onEscalate(alert.id)}
                        title="Escalate incident to Security Patrol"
                        className="flex-1 px-2.5 py-1 text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 border border-rose-800/70 text-rose-300 rounded-lg transition-colors"
                      >
                        Escalate
                      </button>
                    )}

                    {alert.status !== 'false_positive' && (
                      <button
                        onClick={() => onMarkFalsePositive(alert.id)}
                        title="Mark as False Positive to tune baseline model"
                        className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
