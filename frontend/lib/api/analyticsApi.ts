import { AnalyticsSummary, AnalyticsData, Flight } from "@/types/domain";
import { getFlights } from "./flightsApi";

const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  await simulateDelay(400);
  const flights = await getFlights();
  const total = flights.length || 10;
  const completed = flights.filter((f) => f.status === "completed").length;
  const cancelled = flights.filter((f) => f.status === "cancelled").length;

  // const successRatePct = (completed / total) * 100;
  const successRatePct = 87;
  const weatherRelatedCancels = Math.max(2, Math.round(cancelled * 0.6));

  const savedHours = 35;
  const savedCostUsd = 3500;

  const summary: AnalyticsSummary = {
    totalFlights: total,
    successRatePct: Math.round(successRatePct),
    weatherRelatedCancels,
    savedHours,
    savedCostUsd
  };
  return summary;
};

export const getAnalytics = async (): Promise<AnalyticsData> => {
  await simulateDelay(500);
  const [summary, flightsSuccess, downtime, economy] = await Promise.all([
    getAnalyticsSummary(),
    getFlightsWeatherCorrelation(),
    getDowntimeStats(),
    Promise.resolve({
      savings_rub: 125000,
      losses_rub: -15000,
      roi_percent: 15.5,
    }),
  ]);

  return {
    summary: {
      total_flights: summary.totalFlights,
      success_rate: summary.successRatePct,
      total_flight_hours: summary.savedHours * 4.5, // Примерная оценка
      total_warnings: 23,
    },
    flights_success_by_weather: flightsSuccess.map((item) => ({
      condition: item.condition,
      success_rate: item.success,
      failed_rate: item.failed,
    })),
    downtime_stats: downtime,
    economy_metrics: economy,
  };
};

export const getFlightsWeatherCorrelation = async (): Promise<
  {
    condition: string;
    success: number;
    failed: number;
  }[]
> => {
  await simulateDelay(300);
  return [
    { condition: "Ветер < 5 м/с", success: 95, failed: 5 },
    { condition: "Ветер 5–10 м/с", success: 86, failed: 14 },
    { condition: "Ветер > 10 м/с", success: 62, failed: 38 }
  ];
};

export const getDowntimeStats = async (): Promise<
  { period: string; cancellations: number; postponements: number }[]
> => {
  await simulateDelay(300);
  return [
    { period: "Нед 1", cancellations: 2, postponements: 5 },
    { period: "Нед 2", cancellations: 4, postponements: 3 },
    { period: "Нед 3", cancellations: 1, postponements: 6 },
    { period: "Нед 4", cancellations: 3, postponements: 4 }
  ];
};
