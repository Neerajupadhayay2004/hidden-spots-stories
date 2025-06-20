
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users, Shield, Sparkles, Heart, Leaf, Palette, MessageCircle, Navigation } from "lucide-react";
import { Spot } from "@/types/spot";
import { locationService } from "@/services/locationService";

interface SpotCardProps {
  spot: Spot;
  onClick: () => void;
  userLocation?: { lat: number; lng: number } | null;
}

const SpotCard = ({ spot, onClick, userLocation }: SpotCardProps) => {
  const vibeIcons = {
    romantic: Heart,
    serene: Leaf,
    creative: Palette,
  };

  const vibeColors = {
    romantic: "bg-pink-100 text-pink-800 border-pink-200",
    serene: "bg-green-100 text-green-800 border-green-200",
    creative: "bg-purple-100 text-purple-800 border-purple-200",
  };

  const VibeIcon = vibeIcons[spot.vibe];
  const averageRating = (spot.ratings.uniqueness + spot.ratings.vibe + spot.ratings.safety) / 3;
  
  const distance = userLocation 
    ? locationService.calculateDistance(userLocation, spot.location)
    : null;

  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 overflow-hidden animate-fade-in w-full"
      onClick={onClick}
    >
      <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
        <img
          src={spot.images[0]}
          alt={spot.name}
          className="w-full h-full object-cover group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-2 md:top-3 left-2 md:left-3">
          <Badge className={`${vibeColors[spot.vibe]} font-medium text-xs`}>
            <VibeIcon className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">{spot.vibe.charAt(0).toUpperCase() + spot.vibe.slice(1)}</span>
            <span className="sm:hidden">{spot.vibe.charAt(0).toUpperCase()}</span>
          </Badge>
        </div>
        
        <div className="absolute top-2 md:top-3 right-2 md:right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{averageRating.toFixed(1)}</span>
        </div>
        
        {distance && (
          <div className="absolute top-8 md:top-9 right-2 md:right-3 bg-blue-500/90 text-white rounded-full px-2 py-1 flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            <span className="text-xs font-medium">
              {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
            </span>
          </div>
        )}
        
        <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 right-2 md:right-3">
          <h3 className="text-white font-bold text-sm md:text-lg mb-1 line-clamp-1">{spot.name}</h3>
          <div className="flex items-center text-white/80 text-xs md:text-sm">
            <MapPin className="w-3 h-3 mr-1 shrink-0" />
            <span className="line-clamp-1">{spot.location.address}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-3 md:p-4">
        <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
          {spot.description}
        </p>

        {/* Rating Indicators - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-amber-500" />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-xs">Uniqueness</span>
                <span className="text-xs">{spot.ratings.uniqueness}/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-amber-500 h-1 rounded-full transition-all duration-500" 
                  style={{ width: `${(spot.ratings.uniqueness / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-xs">Safety</span>
                <span className="text-xs">{spot.ratings.safety}/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-green-500 h-1 rounded-full transition-all duration-500" 
                  style={{ width: `${(spot.ratings.safety / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Responsive */}
        <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
              <span>{spot.experiences}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Level {5 - spot.ratings.crowdLevel + 1}</span>
              <span className="sm:hidden">L{5 - spot.ratings.crowdLevel + 1}</span>
            </div>
          </div>
          <span className="text-xs truncate ml-2">by {spot.author}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotCard;
