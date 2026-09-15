import React from 'react';
import { Activity, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';

interface HeroBannerProps {
  criticalCount: number;
  totalAlertsCount: number;
  onNavigateToAlerts?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  criticalCount,
  totalAlertsCount,
  onNavigateToAlerts,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d162a] via-[#0e1b36] to-[#091122] border border-cyan-900/30 p-6 sm:p-8 mb-6 shadow-2xl shadow-cyan-950/20">
      {/* Background radial glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          {/* Eyebrow badge matching the reference image */}
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Real-Time Security Monitoring</span>
          </div>

          {/* Headline matching reference image */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            See suspicious behavior before it becomes an incident.
          </h1>

          {/* Subtitle matching reference image */}
          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
            Simulated Salto door access and Gantner locker telemetry is correlated into risk signals,
            impossible travel vectors, and edge-case fraud prevention.
          </p>
        </div>

        {/* Dynamic Activity Pulse Box (matching right icon in screenshot) */}
        <div className="flex items-center space-x-4 bg-slate-900/80 backdrop-blur border border-slate-800/80 p-4 rounded-xl self-start lg:self-center shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
                Threat Status
              </span>
              {criticalCount > 0 ? (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                  CRITICAL ELEVATION
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  NOMINAL
                </span>
              )}
            </div>
            <div className="text-base font-bold text-slate-200 mt-0.5">
              {criticalCount} Critical &bull; {totalAlertsCount} Total Alerts
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Dual baseline engine active &bull; 0 delay
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
