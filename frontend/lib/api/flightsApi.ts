import {
  ActiveFlightTelemetry,
  Flight,
  FlightPlanRequest,
  FlightPlanResponse,
  FlightPlan,
  SafetyClass,
} from "@/types/domain";

const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let flights: Flight[] = [];

const buildMockRoute = (
  lat: number,
  lon: number,
  durationMinutes: number
) => {
  const points = 6;
  return Array.from({ length: points }, (_, i) => ({
    lat: lat + 0.01 * i,
    lon: lon + 0.01 * i,
    altitude_m: 80 + i * 5,
    eta: new Date(
      Date.now() + (durationMinutes / points) * i * 60 * 1000
    ).toISOString(),
    safety_index: 75 + Math.random() * 15
  }));
};

export const getFlights = async (): Promise<Flight[]> => {
  await simulateDelay(250);
  if (flights.length === 0) {
    flights = [
      {
        id: "flight_1",
        drone_id: "dji_mavic_3_enterprise",
        operator_id: "op_1",
        status: "in_flight",
        planned_start: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        duration_minutes: 45,
        location: { lat: 55.75, lon: 37.62 },
        current_safety_index: 82,
        current_safety_class: "green",
        last_warning: {
          time: new Date().toISOString(),
          message: "Порывы ветра до 9 м/с"
        }
      },
      {
        id: "flight_2",
        drone_id: "dji_matrice_300_rtk",
        operator_id: "op_2",
        status: "planned",
        planned_start: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        duration_minutes: 60,
        location: { lat: 55.8, lon: 37.7 }
      }
    ];
  }
  return flights;
};

export const planFlight = async (payload: {
  drone_id: string;
  location: { lat: number; lon: number };
  planned_start: string;
  duration_minutes: number;
  mode: 'auto' | 'manual';
}): Promise<FlightPlan> => {
  await simulateDelay(800);
  const recommendedStart = new Date(
    Date.parse(payload.planned_start) + 30 * 60 * 1000
  ).toISOString();

  const waypoints = Array.from({ length: 6 }, (_, i) => ({
    lat: payload.location.lat + 0.01 * i,
    lon: payload.location.lon + 0.01 * i,
    altitude_m: 80 + i * 5,
    safety_index: 75 + Math.random() * 15,
    safety_class: (75 + Math.random() * 15 > 80 ? 'green' : 75 + Math.random() * 15 > 60 ? 'yellow' : 'red') as SafetyClass,
  }));

  const avgSafetyIndex = waypoints.reduce((acc, p) => acc + p.safety_index, 0) / waypoints.length;
  const avgSafetyClass: SafetyClass = avgSafetyIndex > 80 ? 'green' : avgSafetyIndex > 60 ? 'yellow' : 'red';

  return {
    recommended_start: recommendedStart,
    route: {
      waypoints,
      distance_km: 5.2,
      max_altitude_m: 120,
      avg_safety_index: avgSafetyIndex,
      avg_safety_class: avgSafetyClass,
    },
    alternative_routes: [
      {
        waypoints: waypoints.map((p) => ({ ...p, lat: p.lat + 0.02 })),
        distance_km: 5.5,
        max_altitude_m: 110,
        avg_safety_index: avgSafetyIndex - 5,
        avg_safety_class: avgSafetyClass,
      },
    ],
  };
};

export const getFlightById = async (id: string): Promise<Flight | null> => {
  await simulateDelay(200);
  const all = await getFlights();
  return all.find((f) => f.id === id) ?? null;
};

export const getActiveFlights = async (): Promise<Flight[]> => {
  await simulateDelay(300);
  const all = await getFlights();
  return all.filter((f) => f.status === 'in_flight');
};


