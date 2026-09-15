export type SourceBrand = 'Salto' | 'Gantner' | 'Cross-Brand';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export type AlertStatus = 'active' | 'acknowledged' | 'escalated' | 'false_positive';

export type AnomalyRuleType =
  | 'impossible_travel'
  | 'off_baseline_timing'
  | 'brute_force_signature'
  | 'prolonged_dwell'
  | 'simultaneous_passback';

export interface GeoCoordinate {
  x: number; // percentage in campus/floorplan 0-100
  y: number;
  lat?: number;
  lng?: number;
}

export interface NodeLocation {
  building: string;
  floor: string;
  zone: string;
  campus: string;
  coordinates: GeoCoordinate;
}

// Salto Door Access Event (Original log shape)
export interface SaltoDoorEvent {
  event_id: string;
  credential_id: string;
  door_id: string;
  reader_id: string;
  location: NodeLocation;
  timestamp: string; // ISO string
  result: 'granted' | 'denied';
  method: 'RFID' | 'PIN' | 'mobile' | 'biometric';
  cardholder_name: string;
  cardholder_role: string;
  battery_level?: number;
}

// Gantner Locker Event (Original log shape)
export interface GantnerLockerEvent {
  event_id: string;
  locker_id: string;
  bank_id: string;
  location: NodeLocation;
  credential_id: string; // Often short-lived session PIN or RFID
  timestamp: string;
  action: 'open' | 'close' | 'failed_pin_attempt' | 'forced_entry' | 'tamper';
  result: 'granted' | 'denied';
  duration_seconds?: number;
  temperature: number;
  battery_level: number;
}

// Normalized Shared Event Schema (both map into this)
export interface NormalizedEvent {
  id: string;
  credential_id: string;
  location: NodeLocation;
  timestamp: string;
  event_type: 'door_access' | 'locker_action';
  action: string;
  result: 'granted' | 'denied';
  source_brand: 'Salto' | 'Gantner';
  node_id: string; // door_id or locker_id
  user_name?: string;
  user_role?: string;
  raw_payload?: Record<string, any>;
}

// Credential Behavioral Baseline (for Salto doors - long-lived personal identity)
export interface CredentialBaseline {
  credential_id: string;
  cardholder_name: string;
  cardholder_role: string;
  department: string;
  regular_hours: {
    start_hour: number; // e.g. 8 (8 AM)
    end_hour: number;   // e.g. 19 (7 PM)
    allowed_days: number[]; // 1=Mon, 5=Fri
  };
  frequent_doors: string[];
  last_known_location?: NodeLocation;
  last_access_time?: string;
}

// Locker Bank Baseline (for Gantner lockers - per-location/locker aggregated profile)
export interface LockerBankBaseline {
  bank_id: string;
  location: NodeLocation;
  normal_daily_opens: number;
  peak_hours: string;
  max_acceptable_failed_attempts: number; // e.g. 3 in 2 minutes
  average_dwell_minutes: number;
  active_occupancy_rate: number;
}

// Anomaly Alert
export interface AnomalyAlert {
  id: string;
  type: AnomalyRuleType;
  severity: AlertSeverity;
  score: number; // 0 - 100
  title: string;
  plain_language_reason: string;
  timestamp: string;
  status: AlertStatus;
  source_brand: SourceBrand;
  involved_nodes: string[];
  credential_id?: string;
  cardholder_name?: string;
  cardholder_role?: string;
  metrics?: {
    speed_kmh?: number;
    distance_km?: number;
    time_delta_sec?: number;
    failed_attempts?: number;
    window_sec?: number;
    baseline_expectation?: string;
    observed_value?: string;
  };
  travel_path?: {
    from: {
      name: string;
      node_id: string;
      building: string;
      x: number;
      y: number;
      time: string;
    };
    to: {
      name: string;
      node_id: string;
      building: string;
      x: number;
      y: number;
      time: string;
    };
  };
  recommended_action: string;
  history_context: string[];
}

// Physical Nodes for Network Grid
export interface MonitoredNode {
  id: string; // 'L-001' or 'D-101'
  type: 'locker' | 'door';
  brand: 'Salto' | 'Gantner';
  label: string;
  bank_or_building: string;
  floor: string;
  status: 'normal' | 'attention' | 'anomaly';
  state: 'closed' | 'open' | 'locked' | 'unlocked' | 'tamper' | 'offline';
  temperature?: number; // e.g. 25.5°C
  battery: number;
  risk_score: number;
  last_event_time: string;
  last_user?: string;
  coordinates: GeoCoordinate;
  failed_attempts_today: number;
  total_events_today: number;
}

// Filter Options
export interface DashboardFilters {
  brand: 'all' | 'Salto' | 'Gantner' | 'Cross-Brand';
  severity: 'all' | 'critical' | 'high' | 'medium' | 'low';
  status: 'all' | 'active' | 'acknowledged' | 'escalated' | 'false_positive';
  search: string;
  timeRange: '1h' | '6h' | '24h' | '7d';
}

// Edge case preset scenario
export interface EdgeCaseScenario {
  id: string;
  title: string;
  category: AnomalyRuleType | 'benign_control';
  tag: string;
  description: string;
  triggerDescription: string;
  expectedResult: 'Alert Triggered' | 'Clean / No Alert (0% FP)';
  severityExpected?: AlertSeverity;
  payloadDescription: string;
}
