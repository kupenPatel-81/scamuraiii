import React from 'react';
import {
  X,
  HelpCircle,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  MessageSquare,
  Award,
} from 'lucide-react';

interface JudgeFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeFaqModal: React.FC<JudgeFaqModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#09101d] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#070b14]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-300">
              <Award className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-cyan-400">HACKATHON BUILD GUIDE</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  Pitch Reference
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Scamurai: Core Value Proposition & Judge FAQ
              </h2>
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
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* Executive Pitch Summary */}
          <div className="bg-[#060a12] p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold mb-1">
              What Scamurai Is
            </div>
            <p className="text-slate-200">
              An AI anomaly-detection layer sitting on top of existing Salto (door access) and Gantner (smart locker) event logs.
              It requires <strong>zero new hardware or sensors</strong> — it flags suspicious credential use by analyzing the access/locker events these systems already generate.
            </p>
          </div>

          {/* Anticipated Judge Questions & Strong Answers */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Anticipated Judge Questions & Defenses</span>
            </div>

            {/* Q1: Tailgating vs Software */}
            <div className="bg-[#0b1322] p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-1.5 text-cyan-300">
                1. "Isn't tailgating detection already solved with hardware sensors?"
              </h4>
              <p className="text-slate-300">
                <strong>Yes, as a separate hardware-based category.</strong> Overhead optical counters and 3D LiDAR turnstiles cost thousands of dollars per door. Scamurai is a <em>software-only behavioral intelligence layer</em> on log data that already exists in Salto and Gantner backends. It is complementary rather than competing, catching credential cloning, relay attacks, and off-hours reconnaissance that physical sensors cannot detect.
              </p>
            </div>

            {/* Q2: False Positives & Legitimate Travel */}
            <div className="bg-[#0b1322] p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-1.5 text-cyan-300">
                2. "What if there's a legitimate reason for unusual travel (e.g. fast car or network delay)?"
              </h4>
              <p className="text-slate-300">
                Scamurai employs <strong>defined physics velocity thresholds</strong> (e.g. 45 km/h urban speed limit vs 216 km/h impossible supersonic velocity) and enforces a <strong>human-in-the-loop acknowledge/false-positive workflow</strong> rather than aggressive automated lockouts. Marking an alert as a false positive tunes the credential's baseline weights in real-time.
              </p>
            </div>

            {/* Q3: Difference from native Salto/Gantner */}
            <div className="bg-[#0b1322] p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-1.5 text-cyan-300">
                3. "How is this different from what Salto/Gantner's access management already does?"
              </h4>
              <p className="text-slate-300">
                Salto and Gantner manage <strong>permissions</strong> (<em>who is allowed where</em> at a given moment). Scamurai analyzes <strong>behavioral context after the fact</strong> (<em>is this permission being misused or duplicated</em>). If a VP's badge is cloned, Salto grants entry because the badge is valid; Scamurai flags that the badge was swiped in two distant facilities within 90 seconds.
              </p>
            </div>
          </div>

          {/* Key Design Nuance Reminder */}
          <div className="bg-[#0b1322] p-4 rounded-xl border border-cyan-800/40">
            <h4 className="text-xs font-bold text-cyan-300 mb-1">
              Key Technical Nuance: Dual Baseline Engine
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>
                <strong>Doors (Salto):</strong> Modeled per-credential (long-lived personal identity, habitual working hours).
              </li>
              <li>
                <strong>Lockers (Gantner):</strong> Modeled per-locker/location (single-use session PINs have no history; baseline detects burst failed PINs and dwell anomalies at the node level).
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#070b14] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
          >
            Got It / Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
