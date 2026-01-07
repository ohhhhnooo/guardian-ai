import { useQuery } from '@tanstack/react-query';
import { getCurrentWeather, getForecast } from '@/lib/api/weatherApi';
import { WeatherData } from '@/types/domain';

export function useWeather(lat: number, lon: number, droneId?: string) {
  return useQuery<WeatherData>({
    queryKey: ['weather', 'current', lat, lon, droneId],
    queryFn: () => getCurrentWeather(lat, lon, droneId),
    enabled: !isNaN(lat) && !isNaN(lon),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}

export function useForecast(
  lat: number,
  lon: number,
  hours: 1 | 3 | 6,
  droneId?: string
) {
  return useQuery<WeatherData>({
    queryKey: ['weather', 'forecast', lat, lon, hours, droneId],
    queryFn: () => getForecast(lat, lon, hours, droneId),
    enabled: !isNaN(lat) && !isNaN(lon),
    staleTime: 5 * 60 * 1000,
  });
}

