
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Layers, Heart, Leaf, Palette, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { Spot } from '@/types/spot';
import { locationService, LocationCoordinates } from '@/services/locationService';

interface InteractiveMapProps {
  spots: Spot[];
  onSpotSelect: (spot: Spot) => void;
  selectedSpot?: Spot | null;
}

const InteractiveMap = ({ spots, onSpotSelect, selectedSpot }: InteractiveMapProps) => {
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);
  const [mapCenter, setMapCenter] = useState<LocationCoordinates>({ lat: 26.2183, lng: 78.1828 });
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const vibeIcons = {
    romantic: Heart,
    serene: Leaf,
    creative: Palette,
  };

  const vibeColors = {
    romantic: "bg-gradient-to-br from-pink-400 to-pink-600 border-pink-300 shadow-pink-200",
    serene: "bg-gradient-to-br from-green-400 to-green-600 border-green-300 shadow-green-200",
    creative: "bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300 shadow-purple-200",
  };

  const vibeGlow = {
    romantic: "shadow-lg shadow-pink-300/50",
    serene: "shadow-lg shadow-green-300/50",
    creative: "shadow-lg shadow-purple-300/50",
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    setIsLocationLoading(true);
    try {
      const location = await locationService.getCurrentLocation();
      setUserLocation(location);
      const gwaliורCenter = { lat: 26.2183, lng: 78.1828 };
      const distance = locationService.calculateDistance(location, gwaliורCenter);
      if (distance < 50) {
        setMapCenter(location);
      }
    } catch (error) {
      console.error('Could not get user location:', error);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const filteredSpots = selectedFilter === 'all' 
    ? spots 
    : spots.filter(spot => spot.vibe === selectedFilter);

  const getSpotDistance = (spot: Spot): string => {
    if (!userLocation) return '';
    const distance = locationService.calculateDistance(userLocation, spot.location);
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const resetMapView = () => {
    setMapCenter({ lat: 26.2183, lng: 78.1828 });
    setMapZoom(1);
  };

  const zoomIn = () => setMapZoom(prev => Math.min(prev + 0.2, 2));
  const zoomOut = () => setMapZoom(prev => Math.max(prev - 0.2, 0.5));

  return (
    <Card className={`w-full ${isFullscreen ? 'fixed inset-4 z-50' : 'h-[500px]'} relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50`}>
      {/* Enhanced Control Panel */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-3">
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
            className="bg-white/95 backdrop-blur-md shadow-lg border-white/20 hover:bg-white hover:scale-105 transition-all duration-200"
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
              className={`bg-white/95 backdrop-blur-md shadow-lg border-white/20 hover:scale-105 transition-all duration-200 ${
                selectedFilter === vibe ? vibeColors[vibe as keyof typeof vibeColors] + ' text-white' : 'hover:bg-white'
              }`}
            >
              <Icon className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{vibe.charAt(0).toUpperCase() + vibe.slice(1)}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Enhanced Right Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={getUserLocation}
          disabled={isLocationLoading}
          className="bg-white/95 backdrop-blur-md shadow-lg border-white/20 hover:bg-white hover:scale-105 transition-all duration-200"
        >
          <Navigation className={`w-4 h-4 mr-1 ${isLocationLoading ? 'animate-spin' : ''}`} />
          {isLocationLoading ? 'Finding...' : 'My Location'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-white/95 backdrop-blur-md shadow-lg border-white/20 hover:bg-white hover:scale-105 transition-all duration-200"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={resetMapView}
          className="bg-white/95 backdrop-blur-md shadow-lg border-white/20 hover:bg-white hover:scale-105 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-20 right-4 z-20 flex flex-col gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={zoomIn}
          className="bg-white/95 backdrop-blur-md shadow-lg border-white/20 hover:bg-white hover:scale-105 transition-all duration-200 w-10 h-10 p-0"
        >
          +
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={zoomOut}
          className="bg-white/95 backdrop-blur-md shadow-lg border-white/20 hover:bg-white hover:scale-105 transition-all duration-200 w-10 h-10 p-0"
        >
          −
        </Button>
      </div>

      {/* Enhanced Map Background with Animation */}
      <div 
        ref={mapRef}
        className="w-full h-full relative overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #667eea 0%, #764ba2 100%)
          `,
          transform: `scale(${mapZoom})`,
          transformOrigin: 'center',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Animated Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'float 20s ease-in-out infinite',
          }}
        />

        {/* Gwalior City Area Outline */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-2xl h-full max-h-2xl">
            
            {/* User Location with Enhanced Animation */}
            {userLocation && (
              <div 
                className="absolute z-10"
                style={{
                  left: `${((userLocation.lng - 78.15) / 0.08) * 100}%`,
                  top: `${((26.25 - userLocation.lat) / 0.08) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative">
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-xl animate-pulse">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute inset-1 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}

            {/* Enhanced Spot Markers */}
            {filteredSpots.map((spot) => {
              const VibeIcon = vibeIcons[spot.vibe];
              const isSelected = selectedSpot?.id === spot.id;
              const isHovered = hoveredSpot === spot.id;
              const distance = getSpotDistance(spot);
              
              return (
                <div
                  key={spot.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-15 ${
                    isSelected ? 'scale-125 z-20' : isHovered ? 'scale-110 z-15' : 'hover:scale-110'
                  }`}
                  style={{
                    left: `${((spot.location.lng - 78.15) / 0.08) * 100}%`,
                    top: `${((26.25 - spot.location.lat) / 0.08) * 100}%`,
                  }}
                  onClick={() => onSpotSelect(spot)}
                  onMouseEnter={() => setHoveredSpot(spot.id)}
                  onMouseLeave={() => setHoveredSpot(null)}
                >
                  <div className={`relative ${isSelected ? 'animate-bounce' : ''}`}>
                    {/* Enhanced Marker with Glow */}
                    <div className={`w-12 h-12 rounded-full border-3 border-white flex items-center justify-center ${vibeColors[spot.vibe]} ${vibeGlow[spot.vibe]} transition-all duration-300`}>
                      <VibeIcon className="w-6 h-6 text-white drop-shadow-sm" />
                    </div>
                    
                    {/* Enhanced Tooltip */}
                    {(isSelected || isHovered) && (
                      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-3 min-w-max animate-fade-in border border-white/20">
                        <p className="text-sm font-bold text-gray-800 mb-1">{spot.name}</p>
                        {distance && (
                          <p className="text-xs text-blue-600 font-medium">{distance} away</p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < Math.round((spot.ratings.uniqueness + spot.ratings.vibe + spot.ratings.safety) / 3)
                                    ? 'bg-yellow-400'
                                    : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600 ml-1">
                            {((spot.ratings.uniqueness + spot.ratings.vibe + spot.ratings.safety) / 3).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Animated Ripples for Selected Spot */}
                    {isSelected && (
                      <>
                        <div className="absolute inset-0 rounded-full border-2 border-current animate-ping opacity-75"></div>
                        <div className="absolute -inset-2 rounded-full border border-current animate-ping opacity-50 animation-delay-300"></div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-4 text-sm border border-white/20">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            Legend
          </h4>
          <div className="space-y-2">
            {Object.entries(vibeIcons).map(([vibe, Icon]) => (
              <div key={vibe} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${vibeColors[vibe as keyof typeof vibeColors]} shadow-sm`}>
                  <Icon className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700 font-medium capitalize">{vibe} Spots</span>
              </div>
            ))}
            {userLocation && (
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-sm relative">
                  <div className="absolute inset-1 bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-gray-700 font-medium">Your Location</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Spot Count with Animation */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-4 text-sm border border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">{filteredSpots.length}</span>
            </div>
            <div>
              <p className="text-gray-800 font-bold">Hidden Spots</p>
              <p className="text-gray-600 text-xs">Discovered in Gwalior</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-none" />
      )}
    </Card>
  );
};

export default InteractiveMap;
