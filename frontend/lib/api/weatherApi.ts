import { ForecastPoint, SafeWindow, WeatherData } from "@/types/domain";

const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const mockForecast = (hours: number): ForecastPoint[] => {
  const now = Date.now();
  return Array.from({ length: hours }, (_, i) => {
    const baseWind = 4 + Math.random() * 6;
    const safetyIndex = Math.max(
      10,
      Math.min(98, 90 - baseWind * 3 + (Math.random() - 0.5) * 10)
    );
    const safety_class: ForecastPoint["safety_class"] =
      safetyIndex >= 80 ? "green" : safetyIndex >= 60 ? "yellow" : "red";
    return {
      time: new Date(now + i * 60 * 60 * 1000).toISOString(),
      temp_c: 0 + Math.sin(i / 2) * 3,
      wind_speed_mps: baseWind,
      wind_gust_mps: baseWind + 2 + Math.random() * 4,
      precip_mmph: Math.max(0, (Math.random() - 0.6) * 2),
      visibility_km: 6 + Math.random() * 4,
      pressure_hpa: 1000 + Math.random() * 10,
      cloud_cover_pct: 40 + Math.random() * 60,
      safety_index: Math.round(safetyIndex),
      safety_class
    };
  });
};

const deriveSafeWindows = (forecast: ForecastPoint[]): SafeWindow[] => {
  const safeWindows: SafeWindow[] = [];
  let currentStart: ForecastPoint | null = null;
  let maxSafety = 0;

  forecast.forEach((p, idx) => {
    if (p.safety_index >= 80) {
      if (!currentStart) {
        currentStart = p;
        maxSafety = p.safety_index;
      } else {
        maxSafety = Math.max(maxSafety, p.safety_index);
      }
      const isLast = idx === forecast.length - 1;
      if (isLast) {
        safeWindows.push({
          start: currentStart.time,
          end: p.time,
          max_safety_index: maxSafety
        });
      }
    } else if (currentStart) {
      safeWindows.push({
        start: currentStart.time,
        end: forecast[idx - 1].time,
        max_safety_index: maxSafety
      });
      currentStart = null;
      maxSafety = 0;
    }
  });

  return safeWindows;
};

export const getCurrentWeather = async (
  lat: number,
  lon: number,
  droneId?: string
): Promise<WeatherData> => {
  await simulateDelay(400);
  const forecast = mockForecast(6);
  const current = forecast[0];
  return {
    location: { lat, lon },
    drone_id: droneId,
    current,
    forecast,
    safe_windows: deriveSafeWindows(forecast)
  };
};

export const getForecast = async (
  lat: number,
  lon: number,
  hours: number,
  droneId?: string
): Promise<WeatherData> => {
  await simulateDelay(500);
  const forecast = mockForecast(hours);
  const current = forecast[0];
  return {
    location: { lat, lon },
    drone_id: droneId,
    current,
    forecast,
    safe_windows: deriveSafeWindows(forecast)
  };
};


