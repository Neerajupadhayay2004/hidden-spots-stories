
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Layers, Heart, Leaf, Palette } from 'lucide-react';
import { Spot } from '@/types/spot';
import { locationService, LocationCoordinates } from '@/services/locationService';

interface InteractiveMapProps {
  spots: Spot[];
  onSpotSelect: (spot: Spot) => void;
  selectedSpot?: Spot | null;
}

const InteractiveMap = ({ spots, onSpotSelect, selectedSpot }: InteractiveMapProps) => {
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);
  const [mapCenter, setMapCenter] = useState<LocationCoordinates>({ lat: 26.2183, lng: 78.1828 }); // Gwalior center
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const vibeIcons = {
    romantic: Heart,
    serene: Leaf,
    creative: Palette,
  };

  const vibeColors = {
    romantic: "bg-pink-500 border-pink-600",
    serene: "bg-green-500 border-green-600",
    creative: "bg-purple-500 border-purple-600",
  };

  useEffect(() => {
    // Initialize map with user location
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    setIsLocationLoading(true);
    try {
      const location = await locationService.getCurrentLocation();
      setUserLocation(location);
      // Check if user is in Gwalior area (within 50km radius)
      const gwaliορCenter = { lat: 26.2183, lng: 78.1828 };
      const distance = locationService.calculateDistance(location, gwaliορCenter);
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

  return (
    <Card className="w-full h-[500px] relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          variant={selectedFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedFilter('all')}
          className="bg-white/90 backdrop-blur-sm"
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
            className={`bg-white/90 backdrop-blur-sm ${
              selectedFilter === vibe ? vibeColors[vibe as keyof typeof vibeColors] : ''
            }`}
          >
            <Icon className="w-4 h-4 mr-1" />
            {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
          </Button>
        ))}
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={getUserLocation}
          disabled={isLocationLoading}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Navigation className={`w-4 h-4 mr-1 ${isLocationLoading ? 'animate-spin' : ''}`} />
          {isLocationLoading ? 'Locating...' : 'My Location'}
        </Button>
      </div>

      {/* Map Background */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-amber-50 relative"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v40c11.046 0 20-8.954 20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Gwalior City Outline */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-md h-full max-h-md">
            {/* User Location Marker */}
            {userLocation && (
              <div 
                className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"
                style={{
                  left: `${((userLocation.lng - 78.15) / 0.08) * 100}%`,
                  top: `${((26.25 - userLocation.lat) / 0.08) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              </div>
            )}

            {/* Spot Markers */}
            {filteredSpots.map((spot) => {
              const VibeIcon = vibeIcons[spot.vibe];
              const isSelected = selectedSpot?.id === spot.id;
              const distance = getSpotDistance(spot);
              
              return (
                <div
                  key={spot.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
                    isSelected ? 'scale-125 z-20' : 'z-10'
                  }`}
                  style={{
                    left: `${((spot.location.lng - 78.15) / 0.08) * 100}%`,
                    top: `${((26.25 - spot.location.lat) / 0.08) * 100}%`,
                  }}
                  onClick={() => onSpotSelect(spot)}
                >
                  <div className={`relative ${isSelected ? 'animate-bounce' : ''}`}>
                    <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${vibeColors[spot.vibe]}`}>
                      <VibeIcon className="w-4 h-4 text-white" />
                    </div>
                    
                    {isSelected && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-max animate-fade-in">
                        <p className="text-xs font-medium text-gray-800">{spot.name}</p>
                        {distance && (
                          <p className="text-xs text-gray-500">{distance} away</p>
                        )}
                      </div>
                    )}

                    {/* Ripple effect for selected spot */}
                    {isSelected && (
                      <div className="absolute inset-0 rounded-full border-2 border-current animate-ping opacity-75"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
          <h4 className="font-medium text-gray-700 mb-2">Legend</h4>
          <div className="space-y-1">
            {Object.entries(vibeIcons).map(([vibe, Icon]) => (
              <div key={vibe} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full border border-white ${vibeColors[vibe as keyof typeof vibeColors]}`}>
                  <Icon className="w-2 h-2 text-white m-0.5" />
                </div>
                <span className="text-gray-600 capitalize">{vibe}</span>
              </div>
            ))}
            {userLocation && (
              <div className="flex items-center gap-2 pt-1 border-t">
                <div className="w-4 h-4 bg-blue-500 rounded-full border border-white"></div>
                <span className="text-gray-600">Your Location</span>
              </div>
            )}
          </div>
        </div>

        {/* Spot Count */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
          <p className="text-gray-700">
            <span className="font-medium">{filteredSpots.length}</span> spots found
          </p>
        </div>
      </div>
    </Card>
  );
};

export default InteractiveMap;
