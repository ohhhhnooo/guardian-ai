'use client';

import React from 'react';
import { Box, alpha } from '@mui/material';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { Flight } from '@/types/domain';
import { colors } from '@/theme/theme';

import 'leaflet/dist/leaflet.css';

/* -------------------- helpers -------------------- */

const MAP_CENTER: [number, number] = [56.900987, 60.649370];
const MAP_ZOOM = 12;

const createCustomIcon = (color: string, isActive: boolean = true) => {
  const size = isActive ? 32 : 24;

  return L.divIcon({
    html: `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="12" fill="${color}" stroke="#fff" stroke-width="2"/>
        <circle cx="16" cy="16" r="4" fill="#fff"/>
      </svg>
    `,
    className: 'custom-drone-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const getSafetyColor = (cls?: string) => {
  switch (cls) {
    case 'green':
      return colors.safety.green;
    case 'yellow':
      return colors.safety.yellow;
    case 'red':
      return colors.safety.red;
    default:
      return colors.text.muted;
  }
};

/* -------------------- FitBounds (safe) -------------------- */

const FitBounds = ({ flights }: { flights: Flight[] }) => {
  const map = useMap();

  React.useEffect(() => {
    if (!flights.length) return;

    const bounds = L.latLngBounds(
      flights.map((f) => [f.location.lat, f.location.lon])
    );

    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [flights, map]);

  return null;
};

/* -------------------- Component -------------------- */

interface FlightMapProps {
  flights: Flight[];
  selectedFlightId?: string | null;
  onSelectFlight?: (flightId: string) => void;
  showRoutes?: boolean;
  height?: string | number;
}

export default function FlightMap({
  flights,
  selectedFlightId,
  onSelectFlight,
  showRoutes = true,
  height = 400,
}: FlightMapProps) {
  return (
    <Box
      sx={{
        height,
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${colors.border.default}`,
        '& .leaflet-container': {
          height: '100%',
          width: '100%',
        },
      }}
    >
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />

        {flights.length > 0 && <FitBounds flights={flights} />}

        {flights.map((flight) => {
          const isSelected = flight.id === selectedFlightId;
          const isActive = flight.status === 'in_flight';
          const color = getSafetyColor(flight.current_safety_class);

          return (
            <Marker
              key={flight.id}
              position={[flight.location.lat, flight.location.lon]}
              icon={createCustomIcon(color, isActive)}
              eventHandlers={{
                click: () => onSelectFlight?.(flight.id),
              }}
            >
              <Popup>{flight.id}</Popup>

              {isSelected && isActive && (
                <Circle
                  center={[flight.location.lat, flight.location.lon]}
                  radius={500}
                  pathOptions={{
                    color,
                    fillOpacity: 0.1,
                  }}
                />
              )}

              {showRoutes && flight.route?.length > 1 && (
                <Polyline
                  positions={flight.route.map((p) => [p.lat, p.lon])}
                  color={color}
                  weight={isSelected ? 4 : 2}
                />
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
}
