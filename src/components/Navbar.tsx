import React from 'react';
import {
  ShieldAlert,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Radio,
  Sliders,
} from 'lucide-react';

interface NavbarProps {
  isSimulating: boolean;
  onToggleSim: () => void;
  simSpeed: number;
  onChangeSimSpeed: (speed: number) => void;
  onResetData: () => void;
  onOpenFaq: () => void;
  activeTab: 'overview' | 'map' | 'network' | 'edgecases' | 'pipeline';
  onSelectTab: (tab: 'overview' | 'map' | 'network' | 'edgecases' | 'pipeline') => void;
  activeAnomaliesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isSimulating,
  onToggleSim,
  simSpeed,
  onChangeSimSpeed,
  onResetData,
  onOpenFaq,
  activeTab,
  onSelectTab,
  activeAnomaliesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-950/40">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-wider text-base sm:text-lg text-slate-100 font-mono">
                  SCAMURAI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  AI DEFENSE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Salto Doors & Gantner Locker Risk Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              id="nav-tab-overview"
              onClick={() => onSelectTab('overview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'overview'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>Alert Feed</span>
              {activeAnomaliesCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/40">
                  {activeAnomaliesCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-map"
              onClick={() => onSelectTab('map')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'map'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>Impossible Travel Map</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
            </button>

            <button
              id="nav-tab-network"
              onClick={() => onSelectTab('network')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'network'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Locker & Door Fleet
            </button>

            <button
              id="nav-tab-edgecases"
              onClick={() => onSelectTab('edgecases')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'edgecases'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Edge Cases & Sandbox</span>
            </button>

            <button
              id="nav-tab-pipeline"
              onClick={() => onSelectTab('pipeline')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              Pipeline & Baselines
            </button>
          </nav>

          {/* Right Action Controls: Simulation status, speed, FAQ */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live simulation pill (resembling screenshot) */}
            <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    isSimulating ? 'bg-emerald-400 opacity-75' : 'bg-slate-500'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isSimulating ? 'bg-emerald-400' : 'bg-slate-500'
                  }`}
                ></span>
              </span>
              <span className="text-xs font-medium text-slate-300 hidden sm:inline">
                {isSimulating ? 'Simulation connected' : 'Simulation paused'}
              </span>

              <button
                id="btn-toggle-sim"
                onClick={onToggleSim}
                title={isSimulating ? 'Pause simulation stream' : 'Resume simulation stream'}
                className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
              >
                {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <select
                id="select-sim-speed"
                value={simSpeed}
                onChange={(e) => onChangeSimSpeed(Number(e.target.value))}
                className="bg-slate-950 text-slate-300 text-[11px] rounded px-1.5 py-0.5 border border-slate-800 focus:outline-none focus:border-cyan-500"
                title="Simulation event rate"
              >
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={5}>5x</option>
              </select>
            </div>

            {/* Reset Dummy DB button */}
            <button
              id="btn-reset-db"
              onClick={onResetData}
              title="Reset mock database to initial demo state"
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Build Guide & FAQ modal button */}
            <button
              id="btn-open-judge-faq"
              onClick={onOpenFaq}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 hover:bg-cyan-900/60 rounded-xl transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Judge & Build Guide</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Strip */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-800/60">
          <button
            onClick={() => onSelectTab('overview')}
            className={`px-3 py-1 text-xs rounded whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            Alerts ({activeAnomaliesCount})
          </button>
          <button
            onClick={() => onSelectTab('map')}
            className={`px-3 py-1 text-xs rounded whitespace-nowrap ${
              activeTab === 'map' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            Travel Map
          </button>
          <button
            onClick={() => onSelectTab('network')}
            className={`px-3 py-1 text-xs rounded whitespace-nowrap ${
              activeTab === 'network' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            Locker & Door Fleet
          </button>
          <button
            onClick={() => onSelectTab('edgecases')}
            className={`px-3 py-1 text-xs rounded whitespace-nowrap ${
              activeTab === 'edgecases' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            Edge Cases
          </button>
          <button
            onClick={() => onSelectTab('pipeline')}
            className={`px-3 py-1 text-xs rounded whitespace-nowrap ${
              activeTab === 'pipeline' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            Pipeline
          </button>
        </div>
      </div>
    </header>
  );
};
