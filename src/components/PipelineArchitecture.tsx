import React, { useState } from 'react';
import {
  SAMPLE_RAW_SALTO_EVENT,
  SAMPLE_RAW_GANTNER_EVENT,
  normalizeAccessEvent,
  CREDENTIAL_BASELINES,
  LOCKER_BANK_BASELINES,
} from '../data/mockDatabase';
import {
  Layers,
  ArrowRight,
  Database,
  Cpu,
  ShieldAlert,
  KeyRound,
  DoorClosed,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Zap,
} from 'lucide-react';

export const PipelineArchitecture: React.FC = () => {
  const [selectedBrandView, setSelectedBrandView] = useState<'Salto' | 'Gantner'>('Salto');

  const rawSalto = SAMPLE_RAW_SALTO_EVENT;
  const rawGantner = SAMPLE_RAW_GANTNER_EVENT;

  const normalizedSalto = normalizeAccessEvent(rawSalto);
  const normalizedGantner = normalizeAccessEvent(rawGantner);

  const activeRaw = selectedBrandView === 'Salto' ? rawSalto : rawGantner;
  const activeNormalized = selectedBrandView === 'Salto' ? normalizedSalto : normalizedGantner;

  return (
    <div className="space-y-6">
      {/* 5-Stage Architecture Visualizer */}
      <div className="bg-[#09101d] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="pb-4 border-b border-slate-800/80 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              System Specification
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-slate-400 font-medium">Software-Only Access Layer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Scamurai 5-Stage Detection Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Zero hardware required. Sits non-invasively on existing Salto (door access) and Gantner (smart locker) event telemetry streams.
          </p>
        </div>

        {/* The 5 Stages Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {/* Stage 1: Sources */}
          <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 font-bold mb-2">
                <span>STAGE 1</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Raw Telemetry Sources</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Salto door swipes (RFID/PIN/BLE) & Gantner locker logs (PIN/session). Two separate proprietary log shapes.
              </p>
            </div>
            <div className="space-y-1 text-[10px] font-mono text-slate-300 bg-[#060a12] p-2 rounded border border-slate-800">
              <div>&bull; Salto Space Events</div>
              <div>&bull; Gantner GAT Lockers</div>
            </div>
          </div>

          {/* Stage 2: Normalization */}
          <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-blue-400 font-bold mb-2">
                <span>STAGE 2</span>
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Schema Normalization</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Maps both brands into one uniform event shape so detection rules remain agnostic to brand protocols.
              </p>
            </div>
            <div className="text-[10px] font-mono text-slate-300 bg-[#060a12] p-2 rounded border border-slate-800 truncate">
              {'{ credential, loc, time, result, brand }'}
            </div>
          </div>

          {/* Stage 3: Baseline Store */}
          <div className="bg-[#0b1322] border border-cyan-800/60 rounded-xl p-4 flex flex-col justify-between shadow-md shadow-cyan-950/30">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 font-bold mb-2">
                <span>STAGE 3</span>
                <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Dual Baseline Store</h3>
              <p className="text-[11px] text-cyan-200/80 leading-relaxed mb-3">
                <strong>Crucial Design Nuance:</strong> Per-credential baseline for doors; per-location profile for single-use lockers!
              </p>
            </div>
            <div className="space-y-1 text-[10px] font-mono text-slate-300 bg-[#060a12] p-2 rounded border border-slate-800">
              <div className="text-cyan-300">&bull; Door: Credential Hours</div>
              <div className="text-purple-300">&bull; Locker: Bank Open Rate</div>
            </div>
          </div>

          {/* Stage 4: Detection Engine */}
          <div className="bg-[#0b1322] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold mb-2">
                <span>STAGE 4</span>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Anomaly Detection</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Runs 3 core heuristic rules: Impossible Travel vector, Off-Baseline timing, and Locker Brute-Force PIN bursts.
              </p>
            </div>
            <div className="space-y-1 text-[10px] font-mono text-slate-300 bg-[#060a12] p-2 rounded border border-slate-800">
              <div>&bull; Travel Velocity &gt; 45 km/h</div>
              <div>&bull; Fails &gt; 3 / 120s</div>
            </div>
          </div>

          {/* Stage 5: Alert Scoring */}
          <div className="bg-[#0b1322] border border-rose-900/60 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-rose-400 font-bold mb-2">
                <span>STAGE 5</span>
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Severity Scoring</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Weighted combination into single 0-100 severity score with plain-language explanation and guard triage actions.
              </p>
            </div>
            <div className="text-[10px] font-mono text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-900/50">
              Ranked Alert Feed (Critical/High/Med)
            </div>
          </div>
        </div>
      </div>

      {/* Critical Design Nuance Spotlight (Directly from guide!) */}
      <div className="bg-gradient-to-r from-[#0d162a] via-[#101b33] to-[#0d162a] rounded-2xl border border-cyan-500/40 p-5 sm:p-6 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
              Key Hackathon Design Nuance &bull; Why One Rule Doesn't Fit All
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Door Credentials vs. Locker Session PINs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
              <div className="bg-[#060a12]/80 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1.5 text-blue-400 font-bold mb-1">
                  <DoorClosed className="w-4 h-4" />
                  <span>Salto Doors: Per-Credential Baseline</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Door credentials are long-lived personal identities tied to one human for months/years.
                  A rich individual behavioral profile (normal arrival time, habitual doors, typical floor) is
                  statistically meaningful.
                </p>
              </div>

              <div className="bg-[#060a12]/80 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1.5 text-purple-400 font-bold mb-1">
                  <KeyRound className="w-4 h-4" />
                  <span>Gantner Lockers: Per-Location Baseline</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Locker credentials are frequently single-use guest PINs or transient session tokens with no prior history.
                  Baselining per credential fails here. Instead, Scamurai baselines per locker bank ("Bank B normally handles ~18 opens/day") and detects anomalies at the node level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Raw-to-Normalized JSON Inspector */}
      <div className="bg-[#09101d] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80 mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Interactive Schema Normalizer
            </h3>
            <p className="text-xs text-slate-400">
              Inspect how distinct proprietary payloads map into the unified detection schema.
            </p>
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setSelectedBrandView('Salto')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedBrandView === 'Salto'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Salto Door Payload
            </button>
            <button
              onClick={() => setSelectedBrandView('Gantner')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedBrandView === 'Gantner'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gantner Locker Payload
            </button>
          </div>
        </div>

        {/* Split View: Raw JSON vs Normalized JSON */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Raw Source Event */}
          <div className="bg-[#060a12] border border-slate-800/90 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-mono mb-2 pb-2 border-b border-slate-800">
              <span className="text-slate-400 font-bold">RAW SOURCE PAYLOAD ({selectedBrandView})</span>
              <span className="text-[10px] text-slate-400">Proprietary API Ingest</span>
            </div>
            <pre className="text-[11px] font-mono text-cyan-300/90 overflow-x-auto p-2 leading-relaxed max-h-72">
              {JSON.stringify(activeRaw, null, 2)}
            </pre>
          </div>

          {/* Right: Normalized Engine Event */}
          <div className="bg-[#060a12] border border-slate-800/90 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-mono mb-2 pb-2 border-b border-slate-800">
              <span className="text-emerald-400 font-bold">NORMALIZED ENGINE EVENT SCHEMA</span>
              <span className="text-[10px] text-emerald-400/80 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                Agnostic Stream
              </span>
            </div>
            <pre className="text-[11px] font-mono text-emerald-300/90 overflow-x-auto p-2 leading-relaxed max-h-72">
              {JSON.stringify(activeNormalized, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
