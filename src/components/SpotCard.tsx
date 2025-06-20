
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users, Shield, Sparkles, Heart, Leaf, Palette, MessageCircle } from "lucide-react";

interface Spot {
  id: string;
  name: string;
  description: string;
  story: string;
  vibe: "romantic" | "serene" | "creative";
  ratings: {
    uniqueness: number;
    vibe: number;
    safety: number;
    crowdLevel: number;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  author: string;
  experiences: number;
  createdAt: string;
}

interface SpotCardProps {
  spot: Spot;
  onClick: () => void;
}

const SpotCard = ({ spot, onClick }: SpotCardProps) => {
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

  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-fade-in"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={spot.images[0]}
          alt={spot.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge className={`${vibeColors[spot.vibe]} font-medium`}>
            <VibeIcon className="w-3 h-3 mr-1" />
            {spot.vibe.charAt(0).toUpperCase() + spot.vibe.slice(1)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{averageRating.toFixed(1)}</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-lg mb-1">{spot.name}</h3>
          <div className="flex items-center text-white/80 text-sm">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{spot.location.address}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {spot.description}
        </p>

        {/* Rating Indicators */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span>Uniqueness</span>
                <span>{spot.ratings.uniqueness}/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-amber-500 h-1 rounded-full" 
                  style={{ width: `${(spot.ratings.uniqueness / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span>Safety</span>
                <span>{spot.ratings.safety}/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-green-500 h-1 rounded-full" 
                  style={{ width: `${(spot.ratings.safety / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{spot.experiences}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Level {5 - spot.ratings.crowdLevel + 1}</span>
            </div>
          </div>
          <span className="text-xs">by {spot.author}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpotCard;
