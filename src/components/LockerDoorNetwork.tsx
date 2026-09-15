import React, { useState } from 'react';
import { MonitoredNode } from '../types';
import {
  KeyRound,
  DoorClosed,
  Thermometer,
  Battery,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

interface LockerDoorNetworkProps {
  nodes: MonitoredNode[];
  onSelectNode: (node: MonitoredNode) => void;
}

export const LockerDoorNetwork: React.FC<LockerDoorNetworkProps> = ({
  nodes,
  onSelectNode,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'locker' | 'door'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'anomaly' | 'attention' | 'normal'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodes = nodes.filter((node) => {
    if (filterType !== 'all' && node.type !== filterType) return false;
    if (filterStatus !== 'all' && node.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchId = node.id.toLowerCase().includes(q);
      const matchLabel = node.label.toLowerCase().includes(q);
      const matchBuilding = node.bank_or_building.toLowerCase().includes(q);
      if (!matchId && !matchLabel && !matchBuilding) return false;
    }
    return true;
  });

  return (
    <div className="bg-[#09101d] rounded-2xl border border-slate-800 p-5 sm:p-6 mb-6 shadow-xl">
      {/* Section Header matching the reference screenshot */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Locker network & Door readers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Click a locker or door to inspect its latest security evidence and telemetry history.
          </p>
        </div>

        {/* Legend matching reference screenshot */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
            <span className="text-slate-300 font-medium">Normal</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></span>
            <span className="text-slate-300 font-medium">Offline / attention</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50 animate-pulse"></span>
            <span className="text-rose-400 font-medium">Anomaly</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 text-xs">
        <div className="flex items-center space-x-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterType === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Endpoints ({nodes.length})
          </button>
          <button
            onClick={() => setFilterType('locker')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1 ${
              filterType === 'locker'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3 h-3 text-purple-400" />
            <span>Gantner Lockers</span>
          </button>
          <button
            onClick={() => setFilterType('door')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1 ${
              filterType === 'door'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DoorClosed className="w-3 h-3 text-blue-400" />
            <span>Salto Doors</span>
          </button>
        </div>

        {/* Status filter buttons */}
        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-[#060a12] text-slate-300 text-xs rounded-xl px-3 py-1.5 border border-slate-800 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All States</option>
            <option value="anomaly">Anomalies Only</option>
            <option value="attention">Attention / Offline</option>
            <option value="normal">Normal Fleet</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter node..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#060a12] text-xs text-slate-200 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 w-36 sm:w-44"
            />
          </div>
        </div>
      </div>

      {/* Grid of Nodes — Styled exactly like the reference screenshot! */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredNodes.map((node) => {
          const isAnomaly = node.status === 'anomaly';
          const isAttention = node.status === 'attention';

          return (
            <div
              key={node.id}
              id={`node-card-${node.id}`}
              onClick={() => onSelectNode(node)}
              className={`group relative rounded-xl border transition-all duration-200 p-4 flex flex-col justify-between cursor-pointer ${
                isAnomaly
                  ? 'bg-rose-950/30 border-rose-600/70 hover:border-rose-500 shadow-lg shadow-rose-950/40 hover:bg-rose-950/50'
                  : isAttention
                  ? 'bg-[#0f172a] border-amber-500/40 hover:border-amber-400 hover:bg-[#131d36]'
                  : 'bg-[#0b1322] border-slate-800/90 hover:border-slate-700 hover:bg-[#0e172a]'
              }`}
            >
              {/* Top Row: Node ID + Status Dot */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold font-mono text-slate-200 tracking-wider">
                  {node.id}
                </span>

                {/* Status Dot */}
                <span className="relative flex h-2.5 w-2.5">
                  {isAnomaly && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isAnomaly
                        ? 'bg-rose-500'
                        : isAttention
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  ></span>
                </span>
              </div>

              {/* Center Prominent Telemetry (Temperature or Reader Type) */}
              <div className="my-1.5">
                {node.type === 'locker' ? (
                  <div className="flex items-baseline space-x-1">
                    <span
                      className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
                        isAnomaly ? 'text-rose-400' : 'text-white'
                      }`}
                    >
                      {node.temperature?.toFixed(1)}&deg;C
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span
                      className={`text-sm sm:text-base font-bold font-mono tracking-tight ${
                        isAnomaly ? 'text-rose-400' : 'text-cyan-300'
                      }`}
                    >
                      Salto RFID
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono truncate">
                      {node.bank_or_building.split(' ')[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Details Row: Door State + Risk Score (matches image) */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60 font-medium">
                <span className="capitalize text-slate-300">
                  {node.state}
                </span>

                <span
                  className={`font-mono text-[11px] ${
                    node.risk_score >= 70
                      ? 'text-rose-400 font-bold'
                      : node.risk_score > 0
                      ? 'text-amber-300'
                      : 'text-slate-400'
                  }`}
                >
                  Risk {node.risk_score}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <div>Demo mode &bull; Real-time telemetry emulation engine</div>
        <div>
          Click any card to inspect cardholder identity, PIN attempt logs & temperature sensor
        </div>
      </div>
    </div>
  );
};
