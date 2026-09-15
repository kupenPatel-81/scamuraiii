import React, { useState, useEffect } from 'react';
import { AnomalyAlert } from '../types';
import {
  MapPin,
  Compass,
  Zap,
  Gauge,
  Clock,
  Navigation,
  Play,
  RotateCcw,
  ShieldAlert,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface ImpossibleTravelMapProps {
  alert?: AnomalyAlert;
  onSelectAlert?: (alert: AnomalyAlert) => void;
  onAcknowledge?: (id: string) => void;
  onEscalate?: (id: string) => void;
}

export const ImpossibleTravelMap: React.FC<ImpossibleTravelMapProps> = ({
  alert,
  onAcknowledge,
  onEscalate,
}) => {
  const [isPlayingReplay, setIsPlayingReplay] = useState(false);
  const [replayStep, setReplayStep] = useState<0 | 1 | 2>(2); // 0: initial, 1: first swipe, 2: impossible swipe triggered
  const [viewMode, setViewMode] = useState<'satellite' | 'schematic'>('satellite');

  // Trigger animation replay sequence
  const startReplay = () => {
    setIsPlayingReplay(true);
    setReplayStep(0);

    setTimeout(() => {
      setReplayStep(1);
    }, 400);

    setTimeout(() => {
      setReplayStep(2);
      setIsPlayingReplay(false);
    }, 2200);
  };

  const travelData = alert?.travel_path || {
    from: {
      name: 'London Alpha Tower — Turnstile #1',
      node_id: 'D-101',
      building: 'Alpha Tower',
      x: 25,
      y: 45,
      time: '08:42:10 AM',
    },
    to: {
      name: 'Docklands Logistics Vault — Gate D-401',
      node_id: 'D-401',
      building: 'Docklands Distribution Hub',
      x: 82,
      y: 70,
      time: '08:43:40 AM',
    },
  };

  const distanceKm = alert?.metrics?.distance_km || 5.4;
  const timeDeltaSec = alert?.metrics?.time_delta_sec || 90;
  const speedKmh = alert?.metrics?.speed_kmh || 216;
  const cardholder = alert?.cardholder_name || 'Marcus Vance';
  const credentialId = alert?.credential_id || 'CRD-8821';

  return (
    <div className="bg-[#09101d] rounded-2xl border border-slate-800 p-5 sm:p-6 mb-6 shadow-xl relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              HIGH-IMPACT LIVE DEMO
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Salto Door Geolocation Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <span>Impossible Travel Vector Detection</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-mono">
              216 km/h Velocity
            </span>
          </h2>
        </div>

        {/* View toggles & Replay button */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-lg flex items-center text-xs">
            <button
              onClick={() => setViewMode('satellite')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                viewMode === 'satellite'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              City Vector
            </button>
            <button
              onClick={() => setViewMode('schematic')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                viewMode === 'schematic'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Floorplan Nodes
            </button>
          </div>

          <button
            id="btn-replay-travel"
            onClick={startReplay}
            disabled={isPlayingReplay}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all shadow-md shadow-cyan-900/30 disabled:opacity-50"
          >
            {isPlayingReplay ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isPlayingReplay ? 'Replaying...' : 'Replay Incident'}</span>
          </button>
        </div>
      </div>

      {/* Main Vector Map Stage */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl bg-[#060a12] border border-slate-800/90 overflow-hidden shadow-inner">
        {/* Subtle grid pattern background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="travelGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#travelGrid)" />
        </svg>

        {/* Ambient Topography / Campus Zone Outlines */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Alpha Campus Area */}
          <div className="absolute left-[15%] top-[25%] w-60 h-52 rounded-3xl border border-cyan-500/10 bg-cyan-950/10 backdrop-blur-[1px] p-3">
            <span className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-widest">
              Alpha Campus &bull; London Central
            </span>
          </div>

          {/* Docklands Logistics Zone */}
          <div className="absolute right-[8%] bottom-[12%] w-64 h-48 rounded-3xl border border-rose-500/10 bg-rose-950/10 backdrop-blur-[1px] p-3">
            <span className="text-[10px] font-mono text-rose-500/50 uppercase tracking-widest">
              Docklands Distribution Hub
            </span>
          </div>
        </div>

        {/* Dynamic SVG Travel Vectors */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="travelLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f43f5e" stopOpacity="1" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="1" />
            </linearGradient>

            <filter id="vectorGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connecting Impossible Vector Line */}
          {replayStep >= 1 && (
            <>
              {/* Outer glowing trace line */}
              <line
                x1="250"
                y1="230"
                x2="820"
                y2="360"
                stroke="url(#travelLineGrad)"
                strokeWidth="4"
                strokeDasharray="8 8"
                filter="url(#vectorGlow)"
                className="animate-pulse"
              />

              {/* Animated travelling laser packet */}
              <circle r="6" fill="#f43f5e" filter="url(#vectorGlow)">
                <animateMotion
                  path="M 250 230 L 820 360"
                  dur="1.6s"
                  repeatCount="indefinite"
                  keyPoints="0;1"
                  keyTimes="0;1"
                />
              </circle>
            </>
          )}
        </svg>

        {/* Point A: Alpha Tower Door D-101 */}
        <div
          className={`absolute left-[25%] top-[45%] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-20 ${
            replayStep >= 1 ? 'scale-100 opacity-100' : 'scale-90 opacity-60'
          }`}
        >
          <div className="relative group">
            {/* Ping pulse */}
            <span className="animate-ping absolute -inset-1 rounded-full bg-cyan-400 opacity-60"></span>
            <div className="relative w-10 h-10 rounded-full bg-[#0b1322] border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/40">
              <MapPin className="w-5 h-5" />
            </div>

            {/* Label Card */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 border border-cyan-500/40 rounded-lg px-3 py-1.5 shadow-xl">
              <div className="text-[10px] text-cyan-400 font-mono font-bold">POINT 1 &bull; 08:42:10 AM</div>
              <div className="text-xs font-bold text-white">{travelData.from.name}</div>
              <div className="text-[10px] text-slate-400">Salto RFID Reader #RDR-101</div>
            </div>
          </div>
        </div>

        {/* Center Impossible Travel Stats Banner */}
        {replayStep >= 2 && (
          <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="bg-[#0b1322]/95 backdrop-blur-md border border-rose-500/60 rounded-xl px-4 py-2.5 shadow-2xl shadow-rose-950/60 flex items-center space-x-3 text-center animate-bounce duration-1000">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-rose-400 font-mono uppercase tracking-wider">
                  PHYSICALLY IMPOSSIBLE
                </div>
                <div className="text-sm font-black text-white font-mono">
                  {distanceKm} km in {timeDeltaSec} sec = {speedKmh} km/h
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Point B: Docklands Door D-401 */}
        <div
          className={`absolute left-[82%] top-[70%] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-20 ${
            replayStep >= 2 ? 'scale-100 opacity-100' : 'scale-90 opacity-40'
          }`}
        >
          <div className="relative group">
            {/* Ping pulse */}
            <span className="animate-ping absolute -inset-2 rounded-full bg-rose-500 opacity-75"></span>
            <div className="relative w-11 h-11 rounded-full bg-rose-950 border-2 border-rose-500 flex items-center justify-center text-rose-300 shadow-xl shadow-rose-600/50">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>

            {/* Label Card */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 border border-rose-500/50 rounded-lg px-3 py-1.5 shadow-xl">
              <div className="text-[10px] text-rose-400 font-mono font-bold flex items-center gap-1">
                <span>POINT 2 &bull; 08:43:40 AM</span>
                <span className="bg-rose-500 text-slate-950 px-1 rounded text-[9px] font-black">CRITICAL</span>
              </div>
              <div className="text-xs font-bold text-white">{travelData.to.name}</div>
              <div className="text-[10px] text-slate-400">Salto High-Security Hub D-401</div>
            </div>
          </div>
        </div>

        {/* Live Vector Legend in bottom left */}
        <div className="absolute bottom-3 left-3 z-10 bg-slate-950/80 backdrop-blur border border-slate-800/80 rounded-lg px-3 py-2 text-[11px] text-slate-400 flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Origin Door</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Impossible Destination</span>
          </div>
          <div className="text-slate-400 font-mono">
            &Delta;t: 90s &bull; Dist: 5.4km
          </div>
        </div>
      </div>

      {/* Physics Validation Breakdown & Velocity Comparison */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
        {/* Cardholder Details */}
        <div className="border-b md:border-b-0 md:border-r border-slate-800/80 pb-3 md:pb-0 md:pr-4">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Flagged Credential
          </span>
          <div className="text-sm font-bold text-white mt-1">{cardholder}</div>
          <div className="text-xs text-slate-400">
            Badge ID: <span className="font-mono text-cyan-300">{credentialId}</span> (Salto RFID)
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            VP Infrastructure &bull; Executive Access Level
          </div>
        </div>

        {/* Physics Comparison Gauge */}
        <div className="border-b md:border-b-0 md:border-r border-slate-800/80 pb-3 md:pb-0 md:pr-4">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Velocity Threshold Validation
          </span>
          <div className="mt-2 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between items-center text-slate-400">
              <span>Human Walking Max:</span>
              <span className="text-slate-300">6 km/h</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Urban Traffic Speed:</span>
              <span className="text-slate-300">35 km/h</span>
            </div>
            <div className="flex justify-between items-center text-rose-400 font-bold bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/50">
              <span>Detected Speed:</span>
              <span>216 km/h (45x faster)</span>
            </div>
          </div>
        </div>

        {/* Security Assessment & Response Actions */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Diagnostic Assessment
            </span>
            <p className="text-xs text-slate-300 mt-1">
              Probable RFID relay bridge or physical credential duplication clone. Cardholder cannot exist in two places at once.
            </p>
          </div>

          <div className="flex items-center space-x-2 mt-3">
            {alert && (
              <>
                <button
                  onClick={() => onAcknowledge?.(alert.id)}
                  className="flex-1 px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => onEscalate?.(alert.id)}
                  className="flex-1 px-2.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors shadow-sm"
                >
                  Escalate
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
