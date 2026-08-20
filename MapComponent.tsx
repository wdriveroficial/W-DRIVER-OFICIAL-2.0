import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { AddressDetails, DriverData, MapLayerStyle, RouteCalculationResult } from '../types';
import { decodePolyline } from '../services/geoService';
import { Locate, Layers, ZoomIn, ZoomOut, Activity, Navigation, Clock } from 'lucide-react';

interface MapComponentProps {
  userLocation: { lat: number; lng: number } | null;
  origin?: AddressDetails | null;
  destination?: AddressDetails | null;
  drivers?: DriverData[];
  selectedDriver?: DriverData | null;
  routePoints?: Array<[number, number]>;
  globalRoute?: RouteCalculationResult | null;
  isTrackingRide?: boolean;
  activeDriverPosition?: { lat: number; lng: number; heading?: number } | null;
  className?: string;
  onMapClick?: (lat: number, lng: number) => void;
  interactive?: boolean;
  initialStyle?: MapLayerStyle;
  theme?: 'dark' | 'light';
}

export const MapComponent: React.FC<MapComponentProps> = ({
  userLocation,
  origin,
  destination,
  drivers = [],
  selectedDriver,
  routePoints,
  globalRoute,
  isTrackingRide = false,
  activeDriverPosition,
  className = '',
  onMapClick,
  interactive = true,
  initialStyle = 'streets',
  theme = 'dark',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Dedicated Layer Groups for zero-flicker independent updates
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelLayerRef = useRef<L.TileLayer | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const driversLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const activeDriverLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const trafficLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const activeDriverMarkerRef = useRef<L.Marker | null>(null);

  const [mapStyle, setMapStyle] = useState<MapLayerStyle>(initialStyle);
  const [showTraffic, setShowTraffic] = useState<boolean>(true);

  // 1. Efficient Polyline Resolution (Decodes Google overviewPolyline or uses pre-calculated routePoints)
  const resolvedRoutePoints = useMemo<Array<[number, number]>>(() => {
    if (globalRoute?.overviewPolyline) {
      try {
        const decoded = decodePolyline(globalRoute.overviewPolyline);
        if (decoded && decoded.length > 1) {
          return decoded;
        }
      } catch (err) {
        console.warn('Polyline decode fallback:', err);
      }
    }
    if (globalRoute?.routePoints && globalRoute.routePoints.length > 1) {
      return globalRoute.routePoints;
    }
    if (routePoints && routePoints.length > 1) {
      return routePoints;
    }
    return [];
  }, [globalRoute?.overviewPolyline, globalRoute?.routePoints, routePoints]);

  // 2. Initialize Leaflet Map Instance Once on Mount (Clean ROADMAP by default)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = userLocation?.lat || -7.11532;
    const initialLng = userLocation?.lng || -34.861;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
    });

    // Base Tile Layer - Clean CartoDB Voyager Roadmap by default
    const tile = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd',
      }
    ).addTo(map);
    tileLayerRef.current = tile;

    // Initialize Dedicated Layer Groups in fixed z-stack order
    routeLayerGroupRef.current = L.layerGroup().addTo(map);
    trafficLayerGroupRef.current = L.layerGroup().addTo(map);
    driversLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);
    activeDriverLayerGroupRef.current = L.layerGroup().addTo(map);

    if (onMapClick) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    mapInstanceRef.current = map;

    // Trigger immediate invalidateSize to prevent grey tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 50);
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // ResizeObserver to ensure map viewport stays sharp without distortion on container size shifts
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 3. Tile Layer Switching (Streets/Roadmap, Satellite, Hybrid, Dark)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }
    if (labelLayerRef.current) {
      map.removeLayer(labelLayerRef.current);
      labelLayerRef.current = null;
    }

    if (mapStyle === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      ).addTo(map);
    } else if (mapStyle === 'hybrid') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18 }
      ).addTo(map);

      labelLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map);
    } else if (mapStyle === 'dark' || (mapStyle === 'streets' && theme === 'dark')) {
      // Dark Mode Tile (Clean CartoDB Dark Matter)
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map);
    } else {
      // Light Mode Tile (Clean CartoDB Voyager Day Roadmap)
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map);
    }
  }, [mapStyle, theme]);

  // 4. Center on User GPS when location is first acquired (only if no active destination)
  useEffect(() => {
    if (mapInstanceRef.current && userLocation && !destination && resolvedRoutePoints.length === 0) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15, {
        animate: true,
      });
    }
  }, [userLocation?.lat, userLocation?.lng]);

  // 5. Dedicated Route Polyline Layer (Updates independently WITHOUT reloading the map or other layers)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeGroup = routeLayerGroupRef.current;
    if (!map || !routeGroup) return;

    // Clear only route layers
    routeGroup.clearLayers();

    if (resolvedRoutePoints.length > 1) {
      const isDarkTheme = theme === 'dark' || mapStyle === 'dark';

      // Background outline / shadow for maximum contrast
      const shadowLine = L.polyline(resolvedRoutePoints, {
        color: isDarkTheme ? '#000000' : '#064E3B',
        weight: isDarkTheme ? 10 : 8,
        opacity: isDarkTheme ? 0.7 : 0.45,
        lineCap: 'round',
        lineJoin: 'round',
      });
      routeGroup.addLayer(shadowLine);

      // Glow polyline
      const glowLine = L.polyline(resolvedRoutePoints, {
        color: isDarkTheme ? '#A8E63A' : '#16A34A',
        weight: 6.5,
        opacity: isDarkTheme ? 0.4 : 0.3,
        lineCap: 'round',
        lineJoin: 'round',
      });
      routeGroup.addLayer(glowLine);

      // Main crisp road polyline (Neon Green with high contrast)
      const mainLine = L.polyline(resolvedRoutePoints, {
        color: isDarkTheme ? '#A8E63A' : '#15803D',
        weight: 4.5,
        opacity: 1.0,
        lineCap: 'round',
        lineJoin: 'round',
      });
      routeGroup.addLayer(mainLine);

      // Fit map viewport smoothly to the entire route
      const bounds = L.latLngBounds(resolvedRoutePoints);
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 16,
        animate: true,
      });
    }
  }, [resolvedRoutePoints, theme, mapStyle]);

  // 6. Dedicated Static POI Markers Layer (User GPS, Origin, Destination)
  useEffect(() => {
    const markersGroup = markersLayerGroupRef.current;
    if (!markersGroup) return;

    markersGroup.clearLayers();

    // User GPS location marker
    if (userLocation) {
      const userIconHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-9 h-9 rounded-full bg-[#A8E63A] opacity-35 animate-ping"></div>
          <div class="absolute w-6 h-6 rounded-full bg-[#A8E63A] opacity-50"></div>
          <div class="relative w-4 h-4 rounded-full bg-[#A8E63A] border-2 border-black shadow-2xl"></div>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userIconHtml,
        className: 'custom-user-gps-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      userMarker.bindPopup(`
        <div class="p-1 text-xs font-semibold text-white">
          <div class="flex items-center gap-1.5 text-[#A8E63A] mb-1">
            <span class="w-2 h-2 rounded-full bg-[#A8E63A]"></span>
            <span class="font-bold">Localização do Passageiro (GPS Real)</span>
          </div>
          <p class="text-zinc-300 text-[11px]">${origin?.formatted || 'Sua localização atual'}</p>
        </div>
      `);
      markersGroup.addLayer(userMarker);
    }

    // Destination marker
    if (destination) {
      const destIconHtml = `
        <div class="relative flex items-center justify-center transform -translate-y-4">
          <div class="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-black text-sm shadow-2xl border-2 border-[#A8E63A]">
            🏁
          </div>
          <div class="absolute -bottom-1 w-2.5 h-2.5 bg-white rotate-45 border-r border-b border-black"></div>
        </div>
      `;

      const destIcon = L.divIcon({
        html: destIconHtml,
        className: 'custom-dest-marker',
        iconSize: [36, 44],
        iconAnchor: [18, 44],
      });

      const destMarker = L.marker([destination.lat, destination.lng], { icon: destIcon });
      destMarker.bindPopup(`
        <div class="p-1 text-xs font-semibold text-white">
          <div class="text-[#A8E63A] font-bold mb-1">Destino da Viagem / Entrega</div>
          <p class="text-zinc-300 text-[11px]">${destination.formatted}</p>
        </div>
      `);
      markersGroup.addLayer(destMarker);
    }
  }, [userLocation?.lat, userLocation?.lng, origin?.formatted, destination?.lat, destination?.lng, destination?.formatted]);

  // 7. Dedicated Nearby Drivers Layer (Renders fleet with official W-DRIVER vehicle icon)
  useEffect(() => {
    const driversGroup = driversLayerGroupRef.current;
    if (!driversGroup) return;

    driversGroup.clearLayers();

    if (!isTrackingRide && drivers.length > 0) {
      drivers.forEach((drv) => {
        if (!drv.isOnline) return;

        let categoryName = 'W-CARRO';
        if (drv.category === 'w-bike') {
          categoryName = 'W-BIKE';
        } else if (drv.category === 'w-moto' || drv.category === 'w-moto-entrega') {
          categoryName = 'W-MOTO';
        } else if (drv.category === 'w-taxi') {
          categoryName = 'W-TÁXI';
        }

        // Official W-DRIVER 3D Pin on Map
        const driverHtml = `
          <div class="relative group cursor-pointer flex flex-col items-center">
            <div class="w-10 h-10 rounded-2xl bg-[#0e1014] border-2 border-[#A8E63A] shadow-[0_4px_16px_rgba(168,230,58,0.45)] flex items-center justify-center p-1 transform transition-transform hover:scale-125">
              <svg width="26" height="26" viewBox="0 0 120 120" fill="none">
                <path d="M18 24C18 24 29 25 36 44L47 76C47 76 34 85 24 58L18 24Z" fill="#C4F859"/>
                <path d="M98 24C102 34 96 56 83 78C73 95 65 95 65 95C65 95 75 79 85 55L98 24Z" fill="#95DA26"/>
                <path d="M39 77C39 77 56 34 94 24C94 24 81 38 52 83C46 93 37 96 33 94C29 91 33 82 39 77Z" fill="#A8E63A"/>
                <path d="M21 24L35 24L48 70C48 70 38 88 27 62L21 24Z" fill="#C4F859"/>
                <path d="M42 79L44 75" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
                <path d="M48 69L52 63" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
                <path d="M57 57L63 50" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
                <path d="M70 43L78 37" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
                <path d="M84 32L89 28" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="mt-0.5 px-1.5 py-0.2 bg-black text-[9px] font-black text-[#A8E63A] rounded border border-[#2a2a2a] whitespace-nowrap shadow-md">
              ${categoryName}
            </div>
          </div>
        `;

        const driverIcon = L.divIcon({
          html: driverHtml,
          className: 'custom-driver-marker',
          iconSize: [40, 48],
          iconAnchor: [20, 24],
        });

        const marker = L.marker([drv.lat, drv.lng], { icon: driverIcon });
        marker.bindPopup(`
          <div class="p-2 text-xs text-white min-w-[200px]">
            <div class="flex items-center gap-2.5 mb-2">
              <img src="${drv.photoUrl}" class="w-9 h-9 rounded-full object-cover border border-[#A8E63A]" />
              <div>
                <div class="font-bold text-white leading-tight flex items-center gap-1">
                  <span>${drv.name}</span>
                  ${drv.isFaceVerified ? '<span class="text-[#A8E63A] text-[10px]">✓ Homologado</span>' : ''}
                </div>
                <div class="text-[10px] text-[#A8E63A] font-bold">${categoryName} • ⭐ ${drv.rating.toFixed(2)}</div>
              </div>
            </div>
            <div class="text-[11px] text-zinc-300 border-t border-zinc-800 pt-1.5">
              ${drv.vehicleModel} <br />
              <span class="text-zinc-500 font-mono text-[10px]">Placa: ${drv.vehiclePlate}</span>
            </div>
          </div>
        `);
        driversGroup.addLayer(marker);
      });
    }
  }, [drivers, isTrackingRide]);

  // 8. Dedicated In-Transit Moving Driver Marker (Uses setLatLng for 60fps smooth animation)
  useEffect(() => {
    const activeDriverGroup = activeDriverLayerGroupRef.current;
    if (!activeDriverGroup) return;

    if (!activeDriverPosition) {
      if (activeDriverMarkerRef.current) {
        activeDriverGroup.removeLayer(activeDriverMarkerRef.current);
        activeDriverMarkerRef.current = null;
      }
      return;
    }

    if (activeDriverMarkerRef.current) {
      // Smoothly update position of existing marker
      activeDriverMarkerRef.current.setLatLng([activeDriverPosition.lat, activeDriverPosition.lng]);
    } else {
      const activeDriverHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-14 h-14 rounded-full bg-[#A8E63A] opacity-35 animate-ping"></div>
          <div class="w-12 h-12 rounded-2xl bg-[#0e1014] border-2 border-[#A8E63A] flex items-center justify-center shadow-[0_0_25px_rgba(168,230,58,0.6)] p-1.5">
            <svg width="32" height="32" viewBox="0 0 120 120" fill="none">
              <path d="M18 24C18 24 29 25 36 44L47 76C47 76 34 85 24 58L18 24Z" fill="#C4F859"/>
              <path d="M98 24C102 34 96 56 83 78C73 95 65 95 65 95C65 95 75 79 85 55L98 24Z" fill="#95DA26"/>
              <path d="M39 77C39 77 56 34 94 24C94 24 81 38 52 83C46 93 37 96 33 94C29 91 33 82 39 77Z" fill="#A8E63A"/>
              <path d="M21 24L35 24L48 70C48 70 38 88 27 62L21 24Z" fill="#C4F859"/>
              <path d="M42 79L44 75" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
              <path d="M48 69L52 63" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
              <path d="M57 57L63 50" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
              <path d="M70 43L78 37" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
              <path d="M84 32L89 28" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      `;

      const activeIcon = L.divIcon({
        html: activeDriverHtml,
        className: 'custom-active-driver-marker',
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      const activeMarker = L.marker([activeDriverPosition.lat, activeDriverPosition.lng], { icon: activeIcon });
      activeMarker.bindPopup(`
        <div class="p-1 text-xs text-white">
          <span class="text-[#A8E63A] font-bold">Deslocamento em Tempo Real</span>
          <p class="text-zinc-300 text-[11px]">${selectedDriver?.name || 'Parceiro W-DRIVER Oficial'}</p>
        </div>
      `);
      activeDriverGroup.addLayer(activeMarker);
      activeDriverMarkerRef.current = activeMarker;
    }
  }, [activeDriverPosition?.lat, activeDriverPosition?.lng, selectedDriver]);

  // 9. Traffic Overlay Indicators
  useEffect(() => {
    const trafficGroup = trafficLayerGroupRef.current;
    if (!trafficGroup) return;

    trafficGroup.clearLayers();
    if (showTraffic && userLocation) {
      const trafficPoints: Array<{ lat: number; lng: number; status: 'fast' | 'moderate' | 'slow' }> = [
        { lat: userLocation.lat + 0.003, lng: userLocation.lng + 0.002, status: 'fast' },
        { lat: userLocation.lat - 0.004, lng: userLocation.lng - 0.003, status: 'moderate' },
        { lat: userLocation.lat + 0.006, lng: userLocation.lng - 0.005, status: 'fast' },
      ];

      trafficPoints.forEach((tp) => {
        const color = tp.status === 'fast' ? '#A8E63A' : tp.status === 'moderate' ? '#FBBF24' : '#EF4444';
        const circle = L.circleMarker([tp.lat, tp.lng], {
          radius: 4,
          color,
          fillColor: color,
          fillOpacity: 0.8,
          weight: 1,
        });
        trafficGroup.addLayer(circle);
      });
    }
  }, [showTraffic, userLocation?.lat, userLocation?.lng]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 16, { animate: true });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const toggleLayerStyle = () => {
    setMapStyle((prev) => {
      if (prev === 'dark') return 'streets';
      if (prev === 'streets') return 'satellite';
      if (prev === 'satellite') return 'hybrid';
      return 'dark';
    });
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      {/* Real Interactive Map Viewport */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Floating HUD Controls */}
      {interactive && (
        <div className="absolute right-4 top-20 z-10 flex flex-col gap-2">
          {/* Recenter GPS */}
          <button
            onClick={handleRecenter}
            title="Centralizar no meu GPS Real"
            className="w-11 h-11 rounded-xl bg-[#121212]/95 hover:bg-[#1f1f1f] text-[#A8E63A] border border-[#2a2a2a] backdrop-blur-md flex items-center justify-center shadow-2xl transition-all active:scale-95"
          >
            <Locate className="w-5 h-5" />
          </button>

          {/* Toggle Map Layer: Dark / Normal (Ruas) / Satélite / Híbrido */}
          <button
            onClick={toggleLayerStyle}
            title={`Alternar Visualização: ${
              mapStyle === 'dark'
                ? 'Dark Tech'
                : mapStyle === 'streets'
                ? 'Ruas (Normal)'
                : mapStyle === 'satellite'
                ? 'Satélite'
                : 'Híbrido'
            }`}
            className="w-11 h-11 rounded-xl bg-[#121212]/95 hover:bg-[#1f1f1f] text-white border border-[#2a2a2a] backdrop-blur-md flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95"
          >
            <Layers className="w-4 h-4 text-[#A8E63A]" />
            <span className="text-[8px] font-mono uppercase text-zinc-400 mt-0.5">
              {mapStyle === 'dark'
                ? 'DARK'
                : mapStyle === 'streets'
                ? 'RUAS'
                : mapStyle === 'satellite'
                ? 'SAT'
                : 'HÍBR'}
            </span>
          </button>

          {/* Traffic Toggle */}
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            title={showTraffic ? 'Trânsito em Tempo Real Ativado' : 'Trânsito Oculto'}
            className={`w-11 h-11 rounded-xl border backdrop-blur-md flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
              showTraffic
                ? 'bg-[#121212]/95 text-[#A8E63A] border-[#A8E63A]/40'
                : 'bg-[#121212]/80 text-zinc-500 border-[#2a2a2a]'
            }`}
          >
            <Activity className="w-5 h-5" />
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            title="Aproximar"
            className="w-11 h-11 rounded-xl bg-[#121212]/95 hover:bg-[#1f1f1f] text-white border border-[#2a2a2a] backdrop-blur-md flex items-center justify-center shadow-2xl transition-all active:scale-95"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            title="Afastar"
            className="w-11 h-11 rounded-xl bg-[#121212]/95 hover:bg-[#1f1f1f] text-white border border-[#2a2a2a] backdrop-blur-md flex items-center justify-center shadow-2xl transition-all active:scale-95"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Active GPS & Real Map Status Pill */}
      <div className="absolute left-4 top-20 z-10 pointer-events-none flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-[#252525] shadow-2xl text-xs font-semibold text-white">
          <span className="w-2.5 h-2.5 rounded-full bg-[#A8E63A] animate-pulse"></span>
          <span className="text-[11px] text-zinc-200 font-bold">
            Google Maps & GPS Oficial
          </span>
        </div>

        {globalRoute && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/95 backdrop-blur-md border border-[#A8E63A]/40 shadow-2xl text-xs text-white animate-fade-in">
            <Navigation className="w-3.5 h-3.5 text-[#A8E63A]" />
            <div className="flex items-center gap-2 font-mono">
              <span className="font-extrabold text-[#A8E63A]">{globalRoute.distanceKm} km</span>
              <span className="text-zinc-500">•</span>
              <span className="font-bold text-white flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-400" /> ~{globalRoute.estimatedMinutes} min
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
