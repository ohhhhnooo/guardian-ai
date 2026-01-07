export type SafetyClass = "green" | "yellow" | "red";

export interface ForecastPoint {
  time: string;
  temp_c: number;
  wind_speed_mps: number;
  wind_gust_mps: number;
  precip_mmph: number;
  visibility_km: number;
  pressure_hpa: number;
  cloud_cover_pct: number;
  safety_index: number;
  safety_class: SafetyClass;
}

export interface SafeWindow {
  start: string;
  end: string;
  max_safety_index: number;
}

export interface WeatherData {
  location: { lat: number; lon: number };
  drone_id?: string;
  current: ForecastPoint;
  forecast: ForecastPoint[];
  safe_windows?: SafeWindow[];
}

export interface SafetyFactorContribution {
  factor: "wind" | "temperature" | "precipitation" | "visibility";
  delta: number;
  description: string;
}

export interface SafetyResult {
  safety_index: number;
  safety_class: SafetyClass;
  message: string;
  factors: SafetyFactorContribution[];
  recommended_params?: {
    max_altitude_m?: number;
    max_speed_mps?: number;
  };
}

export type UserRole = "admin" | "operator";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type DroneStatus = "active" | "maintenance";

export interface Drone {
  id: string;
  name: string;
  model: string;
  serial_number: string;
  specs_id: string;
  status: DroneStatus;
}

export type OperatorStatus = "active" | "inactive";

export interface Operator {
  id: string;
  name: string;
  email: string;
  role: string;
  status: OperatorStatus;
}

export type FlightStatus = "planned" | "in_flight" | "completed" | "cancelled";

export interface FlightRoutePoint {
  lat: number;
  lon: number;
  altitude_m: number;
  eta?: string;
  safety_index?: number;
}

export interface Flight {
  id: string;
  drone_id: string;
  operator_id: string;
  status: FlightStatus;
  planned_start: string;
  duration_minutes: number;
  location: { lat: number; lon: number };
  route?: FlightRoutePoint[];
  current_safety_index?: number;
  current_safety_class?: SafetyClass;
  last_warning?: { time: string; message: string };
}

export interface FlightPlanRequest {
  drone_id: string;
  lat: number;
  lon: number;
  start_time: string;
  duration_minutes: number;
  mode: "auto" | "manual";
}

export interface FlightPlanResponse {
  flight: Flight;
  recommended_start: string;
  primary_route: FlightRoutePoint[];
  alternative_routes: FlightRoutePoint[][];
  route_safety_index: number;
}

export interface ActiveFlightWarning {
  time: string;
  level: "info" | "warning" | "critical";
  message: string;
}

export interface ActiveFlightTelemetry {
  id: string;
  drone_id: string;
  operator_id: string;
  status: "in_flight" | "landing" | "returning";
  current_position: { lat: number; lon: number; altitude_m: number };
  current_safety_index: number;
  current_safety_class: SafetyClass;
  last_warning?: ActiveFlightWarning;
}

export interface AnalyticsSummary {
  totalFlights: number;
  successRatePct: number;
  weatherRelatedCancels: number;
  savedHours: number;
  savedCostUsd: number;
}

export interface FlightPlan {
  recommended_start: string;
  route: {
    waypoints: Array<{
      lat: number;
      lon: number;
      altitude_m: number;
      safety_index: number;
      safety_class: SafetyClass;
    }>;
    distance_km: number;
    max_altitude_m: number;
    avg_safety_index: number;
    avg_safety_class: SafetyClass;
  };
  alternative_routes?: Array<{
    waypoints: Array<{
      lat: number;
      lon: number;
      altitude_m: number;
      safety_index: number;
      safety_class: SafetyClass;
    }>;
    distance_km: number;
    max_altitude_m: number;
    avg_safety_index: number;
    avg_safety_class: SafetyClass;
  }>;
}

export interface AnalyticsData {
  summary: {
    total_flights: number;
    success_rate: number;
    total_flight_hours: number;
    total_warnings: number;
  };
  flights_success_by_weather: Array<{
    condition: string;
    success_rate: number;
    failed_rate: number;
  }>;
  downtime_stats: Array<{
    period: string;
    cancellations: number;
    postponements: number;
  }>;
  economy_metrics: {
    savings_rub: number;
    losses_rub: number;
    roi_percent: number;
  };
}


