import {
  Flight,
  FlightPlan,
  SafetyClass,
  FlightRoutePoint,
} from "@/types/domain";

const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Moscow area locations for realistic flight data
const moscowLocations = {
  kremlin: { lat: 55.7520, lon: 37.6175, name: "Кремль" },
  vnukovo: { lat: 55.5915, lon: 37.2615, name: "Внуково" },
  sheremetyevo: { lat: 55.9726, lon: 37.4146, name: "Шереметьево" },
  skolkovo: { lat: 55.6867, lon: 37.3587, name: "Сколково" },
  vdnkh: { lat: 55.8267, lon: 37.6373, name: "ВДНХ" },
  kolomenskoye: { lat: 55.6672, lon: 37.6706, name: "Коломенское" },
  izmaylovo: { lat: 55.7887, lon: 37.7483, name: "Измайлово" },
  luzhniki: { lat: 55.7155, lon: 37.5536, name: "Лужники" },
  ostankino: { lat: 55.8197, lon: 37.6117, name: "Останкино" },
  tsaritsyno: { lat: 55.6158, lon: 37.6869, name: "Царицыно" },
};

// Generate route points along a path
const generateRoute = (
  start: { lat: number; lon: number },
  end: { lat: number; lon: number },
  points: number,
  startTime: Date,
  durationMinutes: number
): FlightRoutePoint[] => {
  return Array.from({ length: points }, (_, i) => {
    const progress = i / (points - 1);
    const timeOffset = (durationMinutes / (points - 1)) * i * 60 * 1000;
    const safetyIndex = 70 + Math.random() * 25;

    return {
      lat: start.lat + (end.lat - start.lat) * progress + (Math.random() - 0.5) * 0.002,
      lon: start.lon + (end.lon - start.lon) * progress + (Math.random() - 0.5) * 0.002,
      altitude_m: 80 + Math.sin(progress * Math.PI) * 40,
      eta: new Date(startTime.getTime() + timeOffset).toISOString(),
      safety_index: safetyIndex,
    };
  });
};

const now = Date.now();

let flights: Flight[] = [
  // Active flights
  {
    id: "FLT-2024-001",
    drone_id: "drone_001",
    operator_id: "op_001",
    status: "in_flight",
    planned_start: new Date(now - 25 * 60 * 1000).toISOString(),
    duration_minutes: 45,
    location: moscowLocations.skolkovo,
    route: generateRoute(
      moscowLocations.skolkovo,
      moscowLocations.vnukovo,
      8,
      new Date(now - 25 * 60 * 1000),
      45
    ),
    current_safety_index: 87,
    current_safety_class: "green",
    last_warning: null
  },
  {
    id: "FLT-2024-002",
    drone_id: "drone_002",
    operator_id: "op_002",
    status: "in_flight",
    planned_start: new Date(now - 15 * 60 * 1000).toISOString(),
    duration_minutes: 60,
    location: moscowLocations.vdnkh,
    route: generateRoute(
      moscowLocations.vdnkh,
      moscowLocations.ostankino,
      10,
      new Date(now - 15 * 60 * 1000),
      60
    ),
    current_safety_index: 72,
    current_safety_class: "yellow",
    last_warning: {
      time: new Date(now - 3 * 60 * 1000).toISOString(),
      message: "Усиление ветра до 8.5 м/с на высоте 100м"
    }
  },
  {
    id: "FLT-2024-003",
    drone_id: "drone_003",
    operator_id: "op_003",
    status: "in_flight",
    planned_start: new Date(now - 35 * 60 * 1000).toISOString(),
    duration_minutes: 50,
    location: moscowLocations.kolomenskoye,
    route: generateRoute(
      moscowLocations.kolomenskoye,
      moscowLocations.tsaritsyno,
      7,
      new Date(now - 35 * 60 * 1000),
      50
    ),
    current_safety_index: 91,
    current_safety_class: "green",
    last_warning: null
  },
  {
    id: "FLT-2024-004",
    drone_id: "drone_005",
    operator_id: "op_004",
    status: "in_flight",
    planned_start: new Date(now - 10 * 60 * 1000).toISOString(),
    duration_minutes: 30,
    location: moscowLocations.luzhniki,
    route: generateRoute(
      moscowLocations.luzhniki,
      { lat: 55.7300, lon: 37.5800 },
      6,
      new Date(now - 10 * 60 * 1000),
      30
    ),
    current_safety_index: 58,
    current_safety_class: "red",
    last_warning: {
      time: new Date(now - 1 * 60 * 1000).toISOString(),
      message: "КРИТИЧНО: Сильные порывы ветра до 12 м/с. Рекомендуется посадка."
    }
  },
  // Planned flights
  {
    id: "FLT-2024-005",
    drone_id: "drone_006",
    operator_id: "op_002",
    status: "planned",
    planned_start: new Date(now + 30 * 60 * 1000).toISOString(),
    duration_minutes: 45,
    location: moscowLocations.izmaylovo,
  },
  {
    id: "FLT-2024-006",
    drone_id: "drone_008",
    operator_id: "op_005",
    status: "planned",
    planned_start: new Date(now + 60 * 60 * 1000).toISOString(),
    duration_minutes: 35,
    location: moscowLocations.ostankino,
  },
  {
    id: "FLT-2024-007",
    drone_id: "drone_001",
    operator_id: "op_009",
    status: "planned",
    planned_start: new Date(now + 120 * 60 * 1000).toISOString(),
    duration_minutes: 90,
    location: moscowLocations.sheremetyevo,
  },
  // Completed flights
  {
    id: "FLT-2024-008",
    drone_id: "drone_002",
    operator_id: "op_001",
    status: "completed",
    planned_start: new Date(now - 180 * 60 * 1000).toISOString(),
    duration_minutes: 55,
    location: moscowLocations.kremlin,
    current_safety_index: 85,
    current_safety_class: "green",
  },
  {
    id: "FLT-2024-009",
    drone_id: "drone_003",
    operator_id: "op_004",
    status: "completed",
    planned_start: new Date(now - 300 * 60 * 1000).toISOString(),
    duration_minutes: 40,
    location: moscowLocations.vdnkh,
    current_safety_index: 78,
    current_safety_class: "yellow",
  },
  {
    id: "FLT-2024-010",
    drone_id: "drone_005",
    operator_id: "op_003",
    status: "cancelled",
    planned_start: new Date(now - 60 * 60 * 1000).toISOString(),
    duration_minutes: 45,
    location: moscowLocations.luzhniki,
    last_warning: {
      time: new Date(now - 65 * 60 * 1000).toISOString(),
      message: "Отменён из-за неблагоприятных погодных условий"
    }
  },
];

// Simulate real-time position updates for active flights
const getSimulatedPosition = (flight: Flight) => {
  if (flight.status !== "in_flight" || !flight.route) return null;

  const startTime = new Date(flight.planned_start).getTime();
  const elapsed = (Date.now() - startTime) / (flight.duration_minutes * 60 * 1000);
  const progress = Math.min(Math.max(elapsed, 0), 1);

  const routeIndex = Math.floor(progress * (flight.route.length - 1));
  const point = flight.route[Math.min(routeIndex, flight.route.length - 1)];

  // Add some random movement to simulate real-time
  return {
    lat: point.lat + (Math.random() - 0.5) * 0.0005,
    lon: point.lon + (Math.random() - 0.5) * 0.0005,
    altitude_m: point.altitude_m + (Math.random() - 0.5) * 5,
  };
};

export const getFlights = async (): Promise<Flight[]> => {
  await simulateDelay(250);
  return flights;
};

export const getFlightById = async (id: string): Promise<Flight | null> => {
  await simulateDelay(200);
  return flights.find((f) => f.id === id) ?? null;
};

export const getActiveFlights = async (): Promise<Flight[]> => {
  await simulateDelay(300);

  // Update positions for active flights
  return flights
    .filter((f) => f.status === "in_flight")
    .map((f) => {
      const position = getSimulatedPosition(f);
      if (position) {
        return {
          ...f,
          location: { lat: position.lat, lon: position.lon },
          // Simulate slight safety index changes
          current_safety_index: Math.max(
            40,
            Math.min(100, (f.current_safety_index || 80) + (Math.random() - 0.5) * 5)
          ),
        };
      }
      return f;
    });
};

export const getFlightTelemetry = async (flightId: string) => {
  await simulateDelay(150);
  const flight = flights.find((f) => f.id === flightId);
  if (!flight || flight.status !== "in_flight") return null;

  const position = getSimulatedPosition(flight);
  if (!position) return null;

  return {
    id: flight.id,
    drone_id: flight.drone_id,
    operator_id: flight.operator_id,
    status: flight.status,
    current_position: position,
    current_safety_index: flight.current_safety_index || 80,
    current_safety_class: flight.current_safety_class || "green",
    speed_mps: 8 + Math.random() * 4,
    heading_deg: Math.random() * 360,
    battery_pct: 85 - Math.random() * 30,
    signal_strength_pct: 90 + Math.random() * 10,
    last_warning: flight.last_warning,
  };
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

  const endPoint = {
    lat: payload.location.lat + 0.05,
    lon: payload.location.lon + 0.03,
  };

  const waypoints = generateRoute(
    payload.location,
    endPoint,
    8,
    new Date(payload.planned_start),
    payload.duration_minutes
  ).map((p) => ({
    ...p,
    safety_class: (p.safety_index! > 80 ? 'green' : p.safety_index! > 60 ? 'yellow' : 'red') as SafetyClass,
  }));

  const avgSafetyIndex = waypoints.reduce((acc, p) => acc + (p.safety_index || 0), 0) / waypoints.length;
  const avgSafetyClass: SafetyClass = avgSafetyIndex > 80 ? 'green' : avgSafetyIndex > 60 ? 'yellow' : 'red';

  return {
    recommended_start: recommendedStart,
    route: {
      waypoints: waypoints as any,
      distance_km: 5.2 + Math.random() * 2,
      max_altitude_m: 120,
      avg_safety_index: avgSafetyIndex,
      avg_safety_class: avgSafetyClass,
    },
    alternative_routes: [
      {
        waypoints: waypoints.map((p) => ({ ...p, lat: p.lat + 0.01 })) as any,
        distance_km: 5.8 + Math.random() * 2,
        max_altitude_m: 100,
        avg_safety_index: avgSafetyIndex - 5,
        avg_safety_class: avgSafetyClass,
      },
    ],
  };
};

export const createFlight = async (flight: Omit<Flight, "id">): Promise<Flight> => {
  await simulateDelay(400);
  const newFlight: Flight = {
    ...flight,
    id: `FLT-2024-${String(flights.length + 1).padStart(3, "0")}`,
  };
  flights = [...flights, newFlight];
  return newFlight;
};

export const updateFlightStatus = async (
  id: string,
  status: Flight["status"]
): Promise<Flight> => {
  await simulateDelay(300);
  flights = flights.map((f) => (f.id === id ? { ...f, status } : f));
  const updated = flights.find((f) => f.id === id);
  if (!updated) throw new Error("Flight not found");
  return updated;
};
