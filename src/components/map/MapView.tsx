import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle } from 'lucide-react';

interface MapPoint {
  coordinates: { lat: number; lng: number };
  label: string;
  timestamp?: string;
  type?: 'punch' | 'visit' | 'doctor' | 'shop';
}

interface MapViewProps {
  points: MapPoint[];
  showRoute?: boolean;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  height?: string;
}

// Mapbox token - in production, this would come from environment or API
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNtNnF5bGNhbTAwdWcya3NhZGx0ZXdqbHQifQ.Ai-ukjxBfK3bwNPvcM2TBA';

export const MapView: React.FC<MapViewProps> = ({
  points,
  showRoute = false,
  center,
  zoom = 12,
  className,
  height = '400px',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [useCustomToken, setUseCustomToken] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeToken = useCustomToken && tokenInput ? tokenInput : MAPBOX_TOKEN;

  useEffect(() => {
    if (!mapContainer.current || !activeToken) return;

    try {
      mapboxgl.accessToken = activeToken;

      const defaultCenter = center || 
        (points.length > 0 ? points[0].coordinates : { lat: 19.0760, lng: 72.8777 });

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [defaultCenter.lng, defaultCenter.lat],
        zoom: zoom,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setMapLoaded(true);
        setError(null);

        // Add markers for each point
        points.forEach((point, index) => {
          const markerColor = 
            point.type === 'punch' ? '#2563EB' :
            point.type === 'doctor' ? '#10B981' :
            point.type === 'shop' ? '#F59E0B' :
            '#2563EB';

          const el = document.createElement('div');
          el.className = 'marker';
          el.style.cssText = `
            width: 32px;
            height: 32px;
            background-color: ${markerColor};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
          `;
          el.innerHTML = `${index + 1}`;

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <strong>${point.label}</strong>
              ${point.timestamp ? `<br/><span style="color: #666; font-size: 12px;">${new Date(point.timestamp).toLocaleTimeString()}</span>` : ''}
            </div>
          `);

          new mapboxgl.Marker(el)
            .setLngLat([point.coordinates.lng, point.coordinates.lat])
            .setPopup(popup)
            .addTo(map.current!);
        });

        // Draw route line if showRoute is true and we have multiple points
        if (showRoute && points.length > 1) {
          const routeCoordinates = points.map(p => [p.coordinates.lng, p.coordinates.lat]);

          map.current!.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates,
              },
            },
          });

          map.current!.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#2563EB',
              'line-width': 3,
              'line-opacity': 0.8,
            },
          });
        }

        // Fit bounds to show all points
        if (points.length > 1) {
          const bounds = new mapboxgl.LngLatBounds();
          points.forEach(point => {
            bounds.extend([point.coordinates.lng, point.coordinates.lat]);
          });
          map.current!.fitBounds(bounds, { padding: 50 });
        }
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load map. Please check your Mapbox token.');
      });

    } catch (err) {
      setError('Failed to initialize map.');
    }

    return () => {
      map.current?.remove();
    };
  }, [points, showRoute, center, zoom, activeToken]);

  if (error || (!MAPBOX_TOKEN && !tokenInput)) {
    return (
      <Card className={`flex flex-col items-center justify-center p-6 ${className}`} style={{ height }}>
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center mb-4">
          {error || 'Please enter your Mapbox public token to view the map'}
        </p>
        <div className="flex gap-2 w-full max-w-md">
          <Input
            placeholder="Enter Mapbox public token"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />
          <Button onClick={() => setUseCustomToken(true)}>Load Map</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Get your token from{' '}
          <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            mapbox.com
          </a>
        </p>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div ref={mapContainer} style={{ height }} />
    </Card>
  );
};
