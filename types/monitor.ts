export interface Heartbeat {
  status: number; // 0: down, 1: up, 2: maintenance
  time: string;
  msg: string;
  ping: number | null; // latency in ms
}

export interface UptimeData {
  [key: string]: number; // Format: "{monitorId}_{hours}" -> uptime percentage
}

export interface MonitorTag {
  id: number;
  monitor_id: number;
  tag_id: number;
  name: string;
  value?: string;
  color: string;
}

export interface Monitor {
  id: number;
  name: string;
  sendUrl: number;
  type: 'http' | 'ping' | 'port';
  url?: string;
  tags?: MonitorTag[];
}

export interface MonitorGroup {
  id: number;
  name: string;
  weight: number;
  monitorList: Monitor[];
}

export interface HeartbeatData {
  [key: string]: Heartbeat[]; // key is monitor ID
}

export interface MonitoringData {
  heartbeatList: HeartbeatData;
  uptimeList: UptimeData;
}

/**
 * Incident Message (Maintenance)
 */
export interface Incident {
  id: number;
  style: 'info' | 'warning' | 'danger' | 'primary' | 'light' | 'dark';
  // info -> primary
  // light -> default
  // dark -> secondary
  title: string;
  content: string;
  pin: number;
  createdDate: string;
  lastUpdatedDate: string;
}
