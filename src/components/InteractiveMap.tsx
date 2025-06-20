
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Layers, Heart, Leaf, Palette, Maximize2, Minimize2, RotateCcw, AlertCircle } from 'lucide-react';
import { Spot } from '@/types/spot';
import { locationService, LocationCoordinates } from '@/services/locationService';

interface InteractiveMapProps {
  spots: Spot[];
  onSpotSelect: (spot: Spot) => void;
  selectedSpot?: Spot | null;
}

const InteractiveMap = ({ spots, onSpotSelect, selectedSpot }: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  const vibeIcons = {
    romantic: Heart,
    serene: Leaf,
    creative: Palette,
  };

  const vibeColors = {
    romantic: "#ec4899",
    serene: "#10b981", 
    creative: "#8b5cf6",
  };

  useEffect(() => {
    if (!mapboxToken) {
      setShowTokenInput(true);
      return;
    }
    
    initializeMap();
    getUserLocation();
  }, [mapboxToken]);

  useEffect(() => {
    if (map.current && spots.length > 0) {
      updateMarkers();
    }
  }, [spots, selectedFilter]);

  const initializeMap = () => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [78.1828, 26.2183], // Gwalior coordinates
      zoom: 12,
      pitch: 0,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    map.current.on('load', () => {
      updateMarkers();
    });
  };

  const getUserLocation = async () => {
    setIsLocationLoading(true);
    setLocationPermissionDenied(false);
    
    try {
      const location = await locationService.getCurrentLocation();
      setUserLocation(location);
      
      if (map.current) {
        // Add user location marker
        const userMarker = new mapboxgl.Marker({
          color: '#3b82f6',
          scale: 1.2
        })
          .setLngLat([location.lng, location.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML('<div class="text-center p-2"><strong>Your Location</strong></div>')
          )
          .addTo(map.current);

        // Center map on user location if they're in Gwalior area
        const gwaliOrCenter = { lat: 26.2183, lng: 78.1828 };
        const distance = locationService.calculateDistance(location, gwaliOrCenter);
        
        if (distance < 50) {
          map.current.flyTo({
            center: [location.lng, location.lat],
            zoom: 14,
            duration: 2000
          });
        }
      }
    } catch (error) {
      console.error('Could not get user location:', error);
      setLocationPermissionDenied(true);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const updateMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    const filteredSpots = selectedFilter === 'all' 
      ? spots 
      : spots.filter(spot => spot.vibe === selectedFilter);

    filteredSpots.forEach((spot) => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundImage = `linear-gradient(135deg, ${vibeColors[spot.vibe]}, ${vibeColors[spot.vibe]}dd)`;
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = 'white';
      el.style.fontSize = '14px';
      el.style.fontWeight = 'bold';
      el.style.transition = 'all 0.3s ease';

      // Add vibe icon
      const VibeIcon = vibeIcons[spot.vibe];
      el.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${spot.vibe === 'romantic' ? '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' : 
          spot.vibe === 'serene' ? '<path d="M11 6.5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v3.5a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5z"/><path d="M15.5 8a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5z"/>' :
          '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'
        }
      </svg>`;

      // Hover effects
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.zIndex = '1000';
        setHoveredSpot(spot.id);
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = '1';
        setHoveredSpot(null);
      });

      el.addEventListener('click', () => {
        onSpotSelect(spot);
      });

      // Create popup content
      const averageRating = ((spot.ratings.uniqueness + spot.ratings.vibe + spot.ratings.safety) / 3).toFixed(1);
      const distance = userLocation ? locationService.calculateDistance(userLocation, spot.location) : null;
      
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <h3 class="font-bold text-lg mb-2">${spot.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${spot.description}</p>
          <div class="flex items-center gap-2 mb-2">
            <div class="flex">
              ${[1,2,3,4,5].map(i => `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="${i <= Math.round(parseFloat(averageRating)) ? '#fbbf24' : '#e5e7eb'}" class="mr-1">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              `).join('')}
            </div>
            <span class="text-sm text-gray-600">${averageRating}</span>
          </div>
          ${distance ? `<p class="text-sm text-blue-600">${distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`} away</p>` : ''}
        </div>
      `;

      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(popupContent);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([spot.location.lng, spot.location.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current[spot.id] = marker;

      // Show popup on hover
      el.addEventListener('mouseenter', () => {
        popup.addTo(map.current!);
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });

      // Highlight selected spot
      if (selectedSpot?.id === spot.id) {
        el.style.transform = 'scale(1.4)';
        el.style.zIndex = '1000';
        popup.addTo(map.current!);
      }
    });
  };

  const resetMapView = () => {
    if (map.current) {
      map.current.flyTo({
        center: [78.1828, 26.2183],
        zoom: 12,
        duration: 1000
      });
    }
  };

  if (showTokenInput) {
    return (
      <Card className={`w-full ${isFullscreen ? 'fixed inset-4 z-50' : 'h-[500px]'} relative overflow-hidden`}>
        <CardContent className="p-8 flex flex-col items-center justify-center h-full">
          <MapPin className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-4">Setup Mapbox</h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            To display the interactive map, please enter your Mapbox public token. 
            You can get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">mapbox.com</a>
          </p>
          <div className="w-full max-w-md space-y-4">
            <Input
              type="text"
              placeholder="Enter your Mapbox public token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <Button 
              onClick={() => setShowTokenInput(false)}
              disabled={!mapboxToken}
              className="w-full"
            >
              Initialize Map
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${isFullscreen ? 'fixed inset-4 z-50' : 'h-[500px]'} relative overflow-hidden shadow-2xl`}>
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
            className="bg-white/95 backdrop-blur-md shadow-lg"
          >
            <Layers className="w-4 h-4 mr-1" />
            All
          </Button>
          {Object.entries(vibeIcons).map(([vibe, Icon]) => (
            <Button
              key={vibe}
              variant={selectedFilter === vibe ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(vibe)}
              className="bg-white/95 backdrop-blur-md shadow-lg"
            >
              <Icon className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{vibe.charAt(0).toUpperCase() + vibe.slice(1)}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Right Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={getUserLocation}
          disabled={isLocationLoading}
          className="bg-white/95 backdrop-blur-md shadow-lg"
        >
          <Navigation className={`w-4 h-4 mr-1 ${isLocationLoading ? 'animate-spin' : ''}`} />
          {isLocationLoading ? 'Finding...' : 'My Location'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-white/95 backdrop-blur-md shadow-lg"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={resetMapView}
          className="bg-white/95 backdrop-blur-md shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Location Permission Alert */}
      {locationPermissionDenied && (
        <div className="absolute top-20 left-4 right-4 z-20 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800">Location access denied</p>
            <p className="text-yellow-700">Please allow location access to see your position on the map and get directions to spots.</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Spot Count */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">
              {selectedFilter === 'all' ? spots.length : spots.filter(s => s.vibe === selectedFilter).length}
            </span>
          </div>
          <div>
            <p className="text-gray-800 font-bold">Hidden Spots</p>
            <p className="text-gray-600 text-xs">In Gwalior</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InteractiveMap;
