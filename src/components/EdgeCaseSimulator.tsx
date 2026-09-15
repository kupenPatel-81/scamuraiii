import React, { useState } from 'react';
import {
  EdgeCaseScenario,
  MonitoredNode,
  AnomalyAlert,
  SourceBrand,
} from '../types';
import {
  Sparkles,
  Zap,
  Play,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Send,
  PlusCircle,
  HelpCircle,
  Clock,
  Gauge,
  Info,
} from 'lucide-react';

interface EdgeCaseSimulatorProps {
  scenarios: EdgeCaseScenario[];
  nodes: MonitoredNode[];
  onTriggerScenario: (scenario: EdgeCaseScenario) => void;
  onInjectCustomEvent: (eventData: {
    brand: SourceBrand;
    nodeId: string;
    credentialId: string;
    action: string;
    result: 'granted' | 'denied';
    isOffHours: boolean;
  }) => void;
  thresholds: {
    maxWalkSpeedKmh: number;
    pinFailureBurstCount: number;
    offHoursZScore: number;
  };
  onUpdateThresholds: (newThresholds: {
    maxWalkSpeedKmh: number;
    pinFailureBurstCount: number;
    offHoursZScore: number;
  }) => void;
}

export const EdgeCaseSimulator: React.FC<EdgeCaseSimulatorProps> = ({
  scenarios,
  nodes,
  onTriggerScenario,
  onInjectCustomEvent,
  thresholds,
  onUpdateThresholds,
}) => {
  // Custom mock event builder state
  const [selectedBrand, setSelectedBrand] = useState<SourceBrand>('Salto');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('D-302');
  const [selectedCredential, setSelectedCredential] = useState<string>('CRD-4109');
  const [selectedAction, setSelectedAction] = useState<string>('entry_granted');
  const [selectedResult, setSelectedResult] = useState<'granted' | 'denied'>('granted');
  const [isOffHours, setIsOffHours] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const availableNodes = nodes.filter((n) =>
    selectedBrand === 'Salto' ? n.type === 'door' : n.type === 'locker'
  );

  const handleRunCustomEvent = () => {
    onInjectCustomEvent({
      brand: selectedBrand,
      nodeId: selectedNodeId,
      credentialId: selectedCredential,
      action: selectedAction,
      result: selectedResult,
      isOffHours,
    });

    setFeedbackMessage(
      `Event dispatched for ${selectedNodeId} (${selectedBrand}) using ${selectedCredential}. Evaluating against baseline...`
    );

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Introduction Header */}
      <div className="bg-[#09101d] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Edge-Case Testing Lab & Mock Data Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Simulate Physical Access Anomalies
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verify how the Scamurai dual-baseline engine flags planted security edge cases while protecting normal employee traffic from false positives.
            </p>
          </div>

          <div className="bg-[#060a12] border border-slate-800 p-3 rounded-xl flex items-center space-x-3 text-xs">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-300">
              Preset tests demonstrate: Impossible travel, PIN brute-force, off-baseline hours, and 0% FP benign walks.
            </span>
          </div>
        </div>

        {/* Section 1: Pre-Configured Edge Cases Showcase */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>1. Preset Edge-Case Attack Scenarios</span>
            <span className="text-[11px] font-mono text-cyan-400">(Click to inject into live engine)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => {
              const isBenign = scenario.category === 'benign_control';

              return (
                <div
                  key={scenario.id}
                  className={`relative rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 ${
                    isBenign
                      ? 'bg-[#091522] border-emerald-900/60 hover:border-emerald-500/50'
                      : 'bg-[#0b1322] border-slate-800 hover:border-cyan-500/50 hover:bg-[#0e172a]'
                  }`}
                >
                  <div>
                    {/* Tag + Expected Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        {scenario.tag}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isBenign
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {scenario.expectedResult}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1.5">{scenario.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2">
                      {scenario.description}
                    </p>

                    <div className="text-[11px] text-slate-400 bg-[#060a12] p-2 rounded-lg border border-slate-800/80 mb-3 font-mono">
                      <span className="text-cyan-400 font-semibold">Sim details:</span> {scenario.payloadDescription}
                    </div>
                  </div>

                  <button
                    onClick={() => onTriggerScenario(scenario)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 shadow-md ${
                      isBenign
                        ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isBenign ? 'Run Benign Control Test' : 'Inject Attack Scenario'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Mock Data Builder (Custom Event Injector) */}
      <div className="bg-[#09101d] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800/80 mb-5">
          <PlusCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            2. Custom Telemetry Mock Data Generator
          </h3>
          <span className="text-xs text-slate-400 hidden sm:inline">
            &bull; Forge specific Salto or Gantner events to test detection logic
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-xs">
          {/* Brand select */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Source Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                const b = e.target.value as SourceBrand;
                setSelectedBrand(b);
                setSelectedNodeId(b === 'Salto' ? 'D-101' : 'L-001');
              }}
              className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="Salto">Salto Systems (Door Access)</option>
              <option value="Gantner">Gantner Technologies (Smart Locker)</option>
            </select>
          </div>

          {/* Node select */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Monitored Node</label>
            <select
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
              className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              {availableNodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.id} — {n.label}
                </option>
              ))}
            </select>
          </div>

          {/* Credential select */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Cardholder / Identity</label>
            <select
              value={selectedCredential}
              onChange={(e) => setSelectedCredential(e.target.value)}
              className="w-full bg-[#060a12] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="CRD-8821">Marcus Vance (CRD-8821 - VP Exec)</option>
              <option value="CRD-4109">Elena Rostova (CRD-4109 - Junior QA)</option>
              <option value="CRD-5503">David Chen (CRD-5503 - Contractor)</option>
              <option value="UNREGISTERED">Unknown / Cloned RFID Badge</option>
            </select>
          </div>

          {/* Result & Timing */}
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Access Result & Time Context</label>
            <div className="flex items-center space-x-2">
              <select
                value={selectedResult}
                onChange={(e) => setSelectedResult(e.target.value as any)}
                className="flex-1 bg-[#060a12] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="granted">Granted (Valid Key)</option>
                <option value="denied">Denied (Invalid PIN/Badge)</option>
              </select>

              <label className="flex items-center space-x-1.5 bg-[#060a12] border border-slate-800 rounded-xl px-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOffHours}
                  onChange={(e) => setIsOffHours(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0"
                />
                <span className="text-slate-300">03:00 AM</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Button & Feedback */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {feedbackMessage ? (
            <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>{feedbackMessage}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              Generates a synthetic raw log, normalizes to shared schema, and passes through detection heuristics.
            </div>
          )}

          <button
            onClick={handleRunCustomEvent}
            className="w-full sm:w-auto px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/40 flex items-center justify-center space-x-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Event to Detection Pipeline</span>
          </button>
        </div>
      </div>

      {/* Section 3: Detection Engine Thresholds Tuning (Judge Question Support) */}
      <div className="bg-[#09101d] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-5">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                3. Detection Threshold Tuning & Sensitivity
              </h3>
              <p className="text-xs text-slate-400">
                Addresses Judge Question: "What if someone walks quickly or there is legitimate travel?"
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Slider 1: Impossible Travel Speed Threshold */}
          <div className="bg-[#060a12] p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-200">Max Physical Travel Velocity</span>
              <span className="font-mono text-cyan-400 font-bold">
                {thresholds.maxWalkSpeedKmh} km/h
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Speeds exceeding this threshold flag as impossible travel. Default is 45 km/h (cross-campus vehicle).
            </p>
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={thresholds.maxWalkSpeedKmh}
              onChange={(e) =>
                onUpdateThresholds({
                  ...thresholds,
                  maxWalkSpeedKmh: Number(e.target.value),
                })
              }
              className="w-full accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>10 km/h (Strict)</span>
              <span>45 km/h (Balanced)</span>
              <span>120 km/h (Permissive)</span>
            </div>
          </div>

          {/* Slider 2: Locker PIN Brute-Force Burst Limit */}
          <div className="bg-[#060a12] p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-200">PIN Burst Failure Threshold</span>
              <span className="font-mono text-amber-400 font-bold">
                {thresholds.pinFailureBurstCount} fails / 2m
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Allowed failed PIN attempts on single locker bank before brute-force alarm and lockout.
            </p>
            <input
              type="range"
              min="2"
              max="10"
              step="1"
              value={thresholds.pinFailureBurstCount}
              onChange={(e) =>
                onUpdateThresholds({
                  ...thresholds,
                  pinFailureBurstCount: Number(e.target.value),
                })
              }
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>2 fails (Zero tolerance)</span>
              <span>3 fails (Standard)</span>
              <span>10 fails (Loose)</span>
            </div>
          </div>

          {/* Slider 3: Off-Hours Z-Score Tolerance */}
          <div className="bg-[#060a12] p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-200">Off-Baseline Statistical Sigma</span>
              <span className="font-mono text-purple-400 font-bold">
                {thresholds.offHoursZScore}&sigma; deviation
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Standard deviations from normal credential access window before generating an off-hours alert.
            </p>
            <input
              type="range"
              min="1.5"
              max="4.0"
              step="0.5"
              value={thresholds.offHoursZScore}
              onChange={(e) =>
                onUpdateThresholds({
                  ...thresholds,
                  offHoursZScore: Number(e.target.value),
                })
              }
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>1.5&sigma; (Sensitive)</span>
              <span>2.5&sigma; (Recommended)</span>
              <span>4.0&sigma; (Outliers only)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
