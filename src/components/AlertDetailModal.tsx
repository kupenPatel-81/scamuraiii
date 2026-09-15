import React from 'react';
import { AnomalyAlert } from '../types';
import {
  X,
  ShieldAlert,
  Flame,
  AlertTriangle,
  MapPin,
  Clock,
  User,
  KeyRound,
  DoorClosed,
  CheckCircle2,
  ThumbsDown,
  Download,
  Send,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface AlertDetailModalProps {
  alert: AnomalyAlert | null;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
  onEscalate: (id: string) => void;
  onMarkFalsePositive: (id: string) => void;
  onOpenTravelMap?: (alert: AnomalyAlert) => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  onAcknowledge,
  onEscalate,
  onMarkFalsePositive,
  onOpenTravelMap,
}) => {
  if (!alert) return null;

  const exportIncidentJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(alert, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `incident-${alert.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#09101d] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#070b14]">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                alert.severity === 'critical'
                  ? 'bg-rose-950/60 border-rose-600/60 text-rose-400'
                  : 'bg-amber-950/60 border-amber-600/60 text-amber-400'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-slate-400">{alert.id}</span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    alert.severity === 'critical'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {alert.severity} Risk ({alert.score}/100)
                </span>
                <span className="text-xs text-slate-400 font-mono font-medium">
                  {alert.source_brand}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">{alert.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Plain Language Explanation (UX Priority #1) */}
          <div className="bg-[#060a12] p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Plain-Language Anomaly Breakdown</span>
            </div>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              {alert.plain_language_reason}
            </p>
          </div>

          {/* Metrics & Physics Validation */}
          {alert.metrics && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {alert.metrics.speed_kmh && (
                <div className="bg-[#0b1322] p-3 rounded-xl border border-rose-900/60">
                  <div className="text-slate-400 text-[11px] font-mono">CALCULATED SPEED</div>
                  <div className="text-xl font-black text-rose-400 font-mono mt-1">
                    {alert.metrics.speed_kmh} km/h
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {alert.metrics.distance_km} km in {alert.metrics.time_delta_sec}s
                  </div>
                </div>
              )}

              {alert.metrics.failed_attempts !== undefined && (
                <div className="bg-[#0b1322] p-3 rounded-xl border border-amber-900/60">
                  <div className="text-slate-400 text-[11px] font-mono">FAILED ATTEMPTS</div>
                  <div className="text-xl font-black text-amber-300 font-mono mt-1">
                    {alert.metrics.failed_attempts} in {alert.metrics.window_sec}s
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Baseline: &lt; 2 / day</div>
                </div>
              )}

              <div className="bg-[#0b1322] p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px] font-mono">BASELINE EXPECTATION</div>
                <div className="text-xs font-semibold text-slate-200 mt-1">
                  {alert.metrics.baseline_expectation || 'Standard verified schedule'}
                </div>
                {alert.metrics.observed_value && (
                  <div className="text-[10px] text-rose-300/80 mt-1 font-mono">
                    Observed: {alert.metrics.observed_value}
                  </div>
                )}
              </div>

              <div className="bg-[#0b1322] p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px] font-mono">INVOLVED ENDPOINTS</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {alert.involved_nodes.map((node) => (
                    <span
                      key={node}
                      className="px-2 py-0.5 bg-slate-900 text-cyan-300 font-mono rounded border border-slate-700 font-bold"
                    >
                      {node}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Credential & Identity Profile */}
          {alert.cardholder_name && (
            <div className="bg-[#0b1322] p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold mb-2">
                Cardholder Identity Record
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300 font-bold">
                    {alert.cardholder_name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{alert.cardholder_name}</div>
                    <div className="text-slate-400 text-xs">
                      {alert.cardholder_role || 'Employee'} &bull; Badge ID:{' '}
                      <span className="font-mono text-cyan-400">{alert.credential_id}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/60">
                  Active in Salto Space
                </span>
              </div>
            </div>
          )}

          {/* Chronological Event History */}
          <div className="bg-[#060a12] p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold mb-3 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Event Context Timeline</span>
            </div>
            <div className="space-y-2">
              {alert.history_context.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2 text-xs text-slate-300 border-l-2 border-slate-800 pl-3 py-0.5"
                >
                  <span className="text-slate-400 font-mono text-[11px]">{idx + 1}.</span>
                  <span className={step.includes('ANOMALY') ? 'text-rose-400 font-semibold' : ''}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Security Response */}
          <div className="bg-rose-950/20 border border-rose-900/50 p-4 rounded-xl">
            <div className="text-[11px] font-mono text-rose-400 uppercase tracking-wider font-bold mb-1">
              Recommended Security Protocol
            </div>
            <p className="text-xs text-rose-200/90 leading-relaxed font-normal">
              {alert.recommended_action}
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#070b14] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={exportIncidentJSON}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Incident</span>
            </button>

            {alert.type === 'impossible_travel' && onOpenTravelMap && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTravelMap(alert);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 rounded-lg transition-colors flex items-center space-x-1"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open in Travel Map</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onMarkFalsePositive(alert.id);
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors flex items-center space-x-1"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Mark False Positive</span>
            </button>

            <button
              onClick={() => {
                onAcknowledge(alert.id);
                onClose();
              }}
              className="px-4 py-1.5 text-xs font-medium text-blue-200 bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors"
            >
              Acknowledge
            </button>

            <button
              onClick={() => {
                onEscalate(alert.id);
                onClose();
              }}
              className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-lg shadow-rose-900/40 flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Escalate Incident</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
