import React from 'react';
import { MonitoredNode } from '../types';
import {
  X,
  Thermometer,
  Battery,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Clock,
  DoorClosed,
  KeyRound,
  Zap,
} from 'lucide-react';

interface NodeDetailModalProps {
  node: MonitoredNode | null;
  onClose: () => void;
  onSimulateTamper: (nodeId: string) => void;
  onResetNode: (nodeId: string) => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  onClose,
  onSimulateTamper,
  onResetNode,
}) => {
  if (!node) return null;

  const isAnomaly = node.status === 'anomaly';
  const isAttention = node.status === 'attention';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#09101d] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#070b14]">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                isAnomaly
                  ? 'bg-rose-950/60 border-rose-600/60 text-rose-400'
                  : isAttention
                  ? 'bg-amber-950/60 border-amber-600/60 text-amber-400'
                  : 'bg-emerald-950/60 border-emerald-600/60 text-emerald-400'
              }`}
            >
              {node.type === 'locker' ? (
                <KeyRound className="w-5 h-5" />
              ) : (
                <DoorClosed className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-slate-400">{node.id}</span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    isAnomaly
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : isAttention
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {node.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {node.brand} {node.type === 'locker' ? 'Smart Locker' : 'Access Reader'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">{node.label}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* Location & Bank */}
          <div className="bg-[#060a12] p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <div className="text-slate-400 text-[11px] font-mono uppercase">Installation Location</div>
              <div className="text-sm font-bold text-white mt-0.5">{node.bank_or_building}</div>
              <div className="text-slate-400 text-xs mt-0.5">{node.floor} &bull; Coordinates ({node.coordinates.x}%, {node.coordinates.y}%)</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-[11px] font-mono uppercase">Calculated Risk</div>
              <div
                className={`text-xl font-mono font-black mt-0.5 ${
                  node.risk_score >= 70
                    ? 'text-rose-400'
                    : node.risk_score > 0
                    ? 'text-amber-300'
                    : 'text-emerald-400'
                }`}
              >
                {node.risk_score}/100
              </div>
            </div>
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {node.temperature !== undefined && (
              <div className="bg-[#0b1322] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Internal Temp</span>
                </div>
                <div className="text-lg font-mono font-bold text-white mt-1">
                  {node.temperature.toFixed(1)}&deg;C
                </div>
              </div>
            )}

            <div className="bg-[#0b1322] p-3 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
                <span>Battery / Line</span>
              </div>
              <div className="text-lg font-mono font-bold text-white mt-1">
                {node.battery}%
              </div>
            </div>

            <div className="bg-[#0b1322] p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px]">Failed PINs Today</div>
              <div
                className={`text-lg font-mono font-bold mt-1 ${
                  node.failed_attempts_today > 2 ? 'text-rose-400 font-black' : 'text-white'
                }`}
              >
                {node.failed_attempts_today}
              </div>
            </div>

            <div className="bg-[#0b1322] p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[11px]">Total Events Today</div>
              <div className="text-lg font-mono font-bold text-white mt-1">
                {node.total_events_today}
              </div>
            </div>
          </div>

          {/* Recent Event Context */}
          <div className="bg-[#0b1322] p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold mb-2">
              Recent Activity & Last Authenticated Subject
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Last User/Identity:</span>
              <span className="font-semibold text-white">{node.last_user || 'None recorded'}</span>
            </div>
            <div className="flex justify-between items-center text-xs mt-1.5">
              <span className="text-slate-400">Timestamp:</span>
              <span className="font-mono text-cyan-300">{node.last_event_time}</span>
            </div>
            <div className="flex justify-between items-center text-xs mt-1.5">
              <span className="text-slate-400">Current Physical State:</span>
              <span className="capitalize font-mono font-bold text-amber-300">{node.state}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#070b14] flex justify-between items-center">
          <button
            onClick={() => {
              onResetNode(node.id);
              onClose();
            }}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Reset Node to Normal
          </button>

          <button
            onClick={() => {
              onSimulateTamper(node.id);
              onClose();
            }}
            className="px-3 py-1.5 text-xs font-bold text-rose-300 hover:text-white bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 rounded-lg transition-colors"
          >
            Simulate Tamper / Anomaly
          </button>
        </div>
      </div>
    </div>
  );
};
