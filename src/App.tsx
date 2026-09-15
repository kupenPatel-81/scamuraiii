import React, { useState, useEffect } from 'react';
import {
  INITIAL_NODES,
  INITIAL_ALERTS,
  EDGE_CASE_SCENARIOS,
  CREDENTIAL_BASELINES,
  LOCKER_BANK_BASELINES,
} from './data/mockDatabase';
import {
  AnomalyAlert,
  DashboardFilters,
  EdgeCaseScenario,
  MonitoredNode,
  SourceBrand,
} from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { SummaryMetrics } from './components/SummaryMetrics';
import { AlertFeed } from './components/AlertFeed';
import { ImpossibleTravelMap } from './components/ImpossibleTravelMap';
import { LockerDoorNetwork } from './components/LockerDoorNetwork';
import { EdgeCaseSimulator } from './components/EdgeCaseSimulator';
import { PipelineArchitecture } from './components/PipelineArchitecture';
import { AlertDetailModal } from './components/AlertDetailModal';
import { NodeDetailModal } from './components/NodeDetailModal';
import { JudgeFaqModal } from './components/JudgeFaqModal';
import {
  CheckCircle,
  Bell,
  ShieldAlert,
  ArrowRight,
  Info,
  X,
  Layers,
} from 'lucide-react';

export default function App() {
  const [nodes, setNodes] = useState<MonitoredNode[]>(INITIAL_NODES);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(INITIAL_ALERTS);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'map' | 'network' | 'edgecases' | 'pipeline'
  >('overview');

  const [filters, setFilters] = useState<DashboardFilters>({
    brand: 'all',
    severity: 'all',
    status: 'all',
    search: '',
    timeRange: '24h',
  });

  const [selectedAlertForModal, setSelectedAlertForModal] =
    useState<AnomalyAlert | null>(null);
  const [selectedNodeForModal, setSelectedNodeForModal] =
    useState<MonitoredNode | null>(null);
  const [isJudgeFaqOpen, setIsJudgeFaqOpen] = useState(false);

  // Simulation controls
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'alert' | 'info';
  } | null>(null);

  // Thresholds configuration for demo tuning
  const [thresholds, setThresholds] = useState({
    maxWalkSpeedKmh: 45,
    pinFailureBurstCount: 3,
    offHoursZScore: 2.5,
  });

  // Helper to show transient toast message
  const triggerToast = (text: string, type: 'success' | 'alert' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Live simulation background loop
  useEffect(() => {
    if (!isSimulating) return;

    const intervalTime = Math.max(1000, Math.floor(4000 / simSpeed));
    const timer = setInterval(() => {
      // Minor realistic telemetry oscillations (temp fluctuate +/- 0.1°C, event count ticks)
      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (n.type === 'locker' && n.temperature && n.status === 'normal') {
            const delta = (Math.random() - 0.5) * 0.2;
            const newTemp = Math.round((n.temperature + delta) * 10) / 10;
            return {
              ...n,
              temperature: newTemp,
              total_events_today: n.total_events_today + (Math.random() > 0.7 ? 1 : 0),
            };
          }
          if (n.type === 'door' && n.status === 'normal') {
            return {
              ...n,
              total_events_today: n.total_events_today + (Math.random() > 0.6 ? 1 : 0),
            };
          }
          return n;
        })
      );
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isSimulating, simSpeed]);

  // Alert Workflow actions
  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'acknowledged' } : a))
    );
    triggerToast(`Incident ${id} marked as Acknowledged.`, 'info');
  };

  const handleEscalate = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'escalated' } : a))
    );
    triggerToast(`Incident ${id} Escalated! Notified on-duty Security Patrol.`, 'alert');
  };

  const handleMarkFalsePositive = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'false_positive' } : a))
    );
    triggerToast(`Incident ${id} marked as False Positive. Tuning baseline weights.`, 'success');
  };

  // Scenario Injection
  const handleTriggerScenario = (scenario: EdgeCaseScenario) => {
    if (scenario.category === 'benign_control') {
      triggerToast(
        '0% FALSE POSITIVE BENCHMARK: Walk from Door D-101 to D-102 took 110s (1.96 km/h). Below threshold (45 km/h). No alert triggered!',
        'success'
      );
      return;
    }

    if (scenario.category === 'impossible_travel') {
      // Focus or trigger Marcus Vance impossible travel
      setActiveTab('map');
      setNodes((prev) =>
        prev.map((n) =>
          n.id === 'D-401' || n.id === 'D-101'
            ? { ...n, status: 'anomaly', risk_score: 96 }
            : n
        )
      );
      triggerToast(
        'IMPOSSIBLE TRAVEL INJECTED: Cloned credential CRD-8821 detected at 216 km/h velocity across campuses!',
        'alert'
      );
      return;
    }

    if (scenario.category === 'brute_force_signature') {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === 'L-014'
            ? {
                ...n,
                status: 'anomaly',
                state: 'tamper',
                risk_score: 91,
                failed_attempts_today: n.failed_attempts_today + 7,
                temperature: 29.4,
              }
            : n
        )
      );
      triggerToast(
        'PIN BRUTE-FORCE INJECTED: 7 failed PIN attempts on Gantner Locker L-014 in 38 seconds. Tamper alarm triggered!',
        'alert'
      );
      setActiveTab('overview');
      return;
    }

    if (scenario.category === 'off_baseline_timing') {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === 'D-302' ? { ...n, status: 'anomaly', risk_score: 82 } : n
        )
      );
      triggerToast(
        'OFF-BASELINE INTRUSION INJECTED: Server Room Vault D-302 unlocked at 03:14 AM Sunday by CRD-4109 (Elena Rostova)!',
        'alert'
      );
      setActiveTab('overview');
      return;
    }

    if (scenario.category === 'prolonged_dwell') {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === 'L-022' ? { ...n, status: 'attention', risk_score: 64 } : n
        )
      );
      triggerToast(
        'LOCKER DWELL ANOMALY: Locker L-022 held continuously for 18 days in day-use bank!',
        'info'
      );
      setActiveTab('overview');
      return;
    }
  };

  // Custom Event Injector from Mock Generator
  const handleInjectCustomEvent = (eventData: {
    brand: SourceBrand;
    nodeId: string;
    credentialId: string;
    action: string;
    result: 'granted' | 'denied';
    isOffHours: boolean;
  }) => {
    const isAnomaly =
      eventData.isOffHours ||
      eventData.result === 'denied' ||
      eventData.credentialId === 'UNREGISTERED';

    const newScore = isAnomaly
      ? eventData.isOffHours && eventData.result === 'denied'
        ? 88
        : 76
      : 15;

    if (isAnomaly) {
      const newAlert: AnomalyAlert = {
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        type: eventData.isOffHours ? 'off_baseline_timing' : 'brute_force_signature',
        severity: newScore >= 80 ? 'critical' : 'high',
        score: newScore,
        title: `Custom Simulated Incident: ${eventData.nodeId} (${eventData.brand})`,
        plain_language_reason: `Event at ${eventData.nodeId} triggered: ${
          eventData.isOffHours ? 'Access attempt during 03:00 AM off-baseline window.' : ''
        } ${eventData.result === 'denied' ? 'Repeated denied authentication token.' : ''}`,
        timestamp: 'Just now',
        status: 'active',
        source_brand: eventData.brand,
        involved_nodes: [eventData.nodeId],
        credential_id: eventData.credentialId,
        cardholder_name:
          eventData.credentialId === 'CRD-8821'
            ? 'Marcus Vance'
            : eventData.credentialId === 'CRD-4109'
            ? 'Elena Rostova'
            : eventData.credentialId === 'CRD-5503'
            ? 'David Chen'
            : 'Unknown Clone',
        recommended_action: 'Audit physical node event log and verify subject authorization.',
        history_context: [
          `Just now - Node ${eventData.nodeId} - ${eventData.action} (${eventData.result})`,
        ],
      };

      setAlerts((prev) => [newAlert, ...prev]);

      setNodes((prev) =>
        prev.map((n) =>
          n.id === eventData.nodeId
            ? {
                ...n,
                status: 'anomaly',
                risk_score: newScore,
                last_event_time: 'Just now',
              }
            : n
        )
      );

      triggerToast(`Custom anomaly detected and added to feed! Score: ${newScore}/100`, 'alert');
    } else {
      triggerToast(
        `Event passed all detection rules cleanly. Node ${eventData.nodeId} remains nominal.`,
        'success'
      );
    }
  };

  // Node tampering simulation
  const handleSimulateTamper = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              status: 'anomaly',
              state: 'tamper',
              risk_score: 92,
              failed_attempts_today: n.failed_attempts_today + 3,
            }
          : n
      )
    );
    triggerToast(`Tamper sensor trip triggered on ${nodeId}!`, 'alert');
  };

  const handleResetNode = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              status: 'normal',
              state: n.type === 'locker' ? 'closed' : 'locked',
              risk_score: 0,
              failed_attempts_today: 0,
            }
          : n
      )
    );
    triggerToast(`Node ${nodeId} reset to nominal state.`, 'success');
  };

  // Reset all mock data to clean demo state
  const handleResetData = () => {
    setNodes(INITIAL_NODES);
    setAlerts(INITIAL_ALERTS);
    triggerToast('Mock database reset to initial demo configuration.', 'info');
  };

  const impossibleTravelAlert = alerts.find(
    (a) => a.type === 'impossible_travel'
  );
  const criticalCount = alerts.filter(
    (a) => a.severity === 'critical' && a.status !== 'false_positive'
  ).length;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Top Sticky Navigation Bar */}
      <Navbar
        isSimulating={isSimulating}
        onToggleSim={() => setIsSimulating(!isSimulating)}
        simSpeed={simSpeed}
        onChangeSimSpeed={setSimSpeed}
        onResetData={handleResetData}
        onOpenFaq={() => setIsJudgeFaqOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeAnomaliesCount={
          alerts.filter((a) => a.status === 'active' || a.status === 'escalated')
            .length
        }
      />

      {/* Floating Dynamic Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up">
          <div
            className={`p-4 rounded-xl shadow-2xl border flex items-start space-x-3 backdrop-blur-md ${
              toastMessage.type === 'alert'
                ? 'bg-rose-950/90 border-rose-600/80 text-rose-100 shadow-rose-950/60'
                : toastMessage.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-600/80 text-emerald-100 shadow-emerald-950/60'
                : 'bg-slate-900/90 border-cyan-500/60 text-slate-100 shadow-cyan-950/60'
            }`}
          >
            {toastMessage.type === 'alert' ? (
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : toastMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs leading-relaxed font-medium">
              {toastMessage.text}
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main App Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Hero Banner (matching user reference image) */}
        <HeroBanner
          criticalCount={criticalCount}
          totalAlertsCount={alerts.length}
          onNavigateToAlerts={() => setActiveTab('overview')}
        />

        {/* 5 KPI Stat Cards Row (matching reference image) */}
        <SummaryMetrics
          nodes={nodes}
          alerts={alerts}
          onSelectMetricFilter={(type) => {
            if (type === 'critical') {
              setFilters((f) => ({ ...f, severity: 'critical' }));
              setActiveTab('overview');
            } else if (type === 'active') {
              setFilters((f) => ({ ...f, status: 'active' }));
              setActiveTab('overview');
            } else if (type === 'offline') {
              setActiveTab('network');
            } else {
              setFilters((f) => ({ ...f, severity: 'all', status: 'all' }));
              setActiveTab('overview');
            }
          }}
        />

        {/* Tab 1: Overview & Alert Feed (Top UX Priority #1) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* If impossible travel exists, show quick vector teaser banner */}
            {impossibleTravelAlert && (
              <div
                onClick={() => setActiveTab('map')}
                className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-cyan-950/40 border border-rose-900/60 hover:border-rose-500 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer transition-all shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-rose-400 font-mono flex items-center gap-1.5">
                      <span>CRITICAL VECTOR ANOMALY DETECTED</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Marcus Vance (CRD-8821) swiped 5.4 km apart in 90 seconds (216 km/h)
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs font-bold text-cyan-300 bg-cyan-950/80 px-3 py-1.5 rounded-lg border border-cyan-800">
                  <span>Inspect Vector Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

            <AlertFeed
              alerts={alerts}
              filters={filters}
              onUpdateFilters={(newFilters) =>
                setFilters((prev) => ({ ...prev, ...newFilters }))
              }
              onSelectAlert={(alert) => setSelectedAlertForModal(alert)}
              onAcknowledge={handleAcknowledge}
              onEscalate={handleEscalate}
              onMarkFalsePositive={handleMarkFalsePositive}
              onViewTravelMap={(alert) => {
                setActiveTab('map');
              }}
            />
          </div>
        )}

        {/* Tab 2: Impossible Travel Geo-Map (Highest-leverage Live Demo Visual) */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <ImpossibleTravelMap
              alert={impossibleTravelAlert}
              onSelectAlert={(a) => setSelectedAlertForModal(a)}
              onAcknowledge={handleAcknowledge}
              onEscalate={handleEscalate}
            />

            {/* Accompanying Alert List Filtered to Impossible Travel */}
            <AlertFeed
              alerts={alerts.filter((a) => a.type === 'impossible_travel')}
              filters={filters}
              onUpdateFilters={(newFilters) =>
                setFilters((prev) => ({ ...prev, ...newFilters }))
              }
              onSelectAlert={(alert) => setSelectedAlertForModal(alert)}
              onAcknowledge={handleAcknowledge}
              onEscalate={handleEscalate}
              onMarkFalsePositive={handleMarkFalsePositive}
              onViewTravelMap={() => {}}
            />
          </div>
        )}

        {/* Tab 3: Physical Fleet Network (Locker & Door Grid matching image) */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            <LockerDoorNetwork
              nodes={nodes}
              onSelectNode={(node) => setSelectedNodeForModal(node)}
            />
          </div>
        )}

        {/* Tab 4: Edge Cases & Mock Data Sandbox */}
        {activeTab === 'edgecases' && (
          <EdgeCaseSimulator
            scenarios={EDGE_CASE_SCENARIOS}
            nodes={nodes}
            onTriggerScenario={handleTriggerScenario}
            onInjectCustomEvent={handleInjectCustomEvent}
            thresholds={thresholds}
            onUpdateThresholds={setThresholds}
          />
        )}

        {/* Tab 5: 5-Stage Pipeline Architecture & Schema Inspector */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <PipelineArchitecture />
          </div>
        )}
      </main>

      {/* Footer info bar (resembling bottom bar in screenshot) */}
      <footer className="border-t border-slate-800/80 bg-[#060a12] py-4 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>
            Scamurai &bull; Salto Systems Door Access + Gantner Smart Lockers Physical Fraud Intelligence
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Dual Baseline Engine Active</span>
          <span>&bull;</span>
          <button
            onClick={() => setIsJudgeFaqOpen(true)}
            className="text-cyan-400 hover:underline"
          >
            Judge Questions & Architecture Guide
          </button>
        </div>
      </footer>

      {/* Modals and Drawers */}
      <AlertDetailModal
        alert={selectedAlertForModal}
        onClose={() => setSelectedAlertForModal(null)}
        onAcknowledge={handleAcknowledge}
        onEscalate={handleEscalate}
        onMarkFalsePositive={handleMarkFalsePositive}
        onOpenTravelMap={(alert) => {
          setSelectedAlertForModal(null);
          setActiveTab('map');
        }}
      />

      <NodeDetailModal
        node={selectedNodeForModal}
        onClose={() => setSelectedNodeForModal(null)}
        onSimulateTamper={handleSimulateTamper}
        onResetNode={handleResetNode}
      />

      <JudgeFaqModal
        isOpen={isJudgeFaqOpen}
        onClose={() => setIsJudgeFaqOpen(false)}
      />
    </div>
  );
}
