
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, MapPin, Star, Users, Shield, Sparkles, Heart, Leaf, Palette, MessageCircle, Navigation, Share2, Bookmark, Camera } from "lucide-react";
import { Spot } from '@/types/spot';
import { locationService } from '@/services/locationService';

interface SpotDetailsModalProps {
  spot: Spot;
  onClose: () => void;
  userLocation?: { lat: number; lng: number } | null;
}

const SpotDetailsModal = ({ spot, onClose, userLocation }: SpotDetailsModalProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [newExperience, setNewExperience] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: spot.name,
          text: spot.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${spot.name} - ${spot.description} ${window.location.href}`);
    }
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.location.lat},${spot.location.lng}`;
    window.open(url, '_blank');
  };

  const handleAddExperience = () => {
    if (newExperience.trim()) {
      // In real app, this would save to backend
      console.log('Adding experience:', newExperience);
      setNewExperience('');
      setShowExperienceForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="relative p-0">
          {/* Image Gallery */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={spot.images[selectedImageIndex]}
              alt={spot.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Navigation */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Image Counter */}
            {spot.images.length > 1 && (
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                {selectedImageIndex + 1} / {spot.images.length}
              </div>
            )}

            {/* Image Navigation */}
            {spot.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {spot.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === selectedImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Overlay Info */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge className={`${vibeColors[spot.vibe]} mb-2`}>
                    <VibeIcon className="w-3 h-3 mr-1" />
                    {spot.vibe.charAt(0).toUpperCase() + spot.vibe.slice(1)}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{spot.name}</h2>
                  <div className="flex items-center text-white/80 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{spot.location.address}</span>
                    {distance && (
                      <span className="ml-2 bg-white/20 rounded-full px-2 py-0.5 text-xs">
                        {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`} away
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-medium">{averageRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Action Buttons */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <Button onClick={handleGetDirections} className="flex-1 min-w-0">
              <Navigation className="w-4 h-4 mr-2" />
              Directions
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={isBookmarked ? 'bg-amber-50 border-amber-200 text-amber-800' : ''}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">About this place</h3>
            <p className="text-gray-600 leading-relaxed">{spot.description}</p>
          </div>

          {/* Story */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Personal Story</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed italic">"{spot.story}"</p>
              <p className="text-sm text-gray-500 mt-2">— {spot.author}</p>
            </div>
          </div>

          {/* Ratings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Community Ratings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uniqueness</span>
                    <span className="font-medium">{spot.ratings.uniqueness}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(spot.ratings.uniqueness / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <VibeIcon className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Vibe</span>
                    <span className="font-medium">{spot.ratings.vibe}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(spot.ratings.vibe / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Safety</span>
                    <span className="font-medium">{spot.ratings.safety}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(spot.ratings.safety / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Crowd Level</span>
                    <span className="font-medium">{5 - spot.ratings.crowdLevel + 1}/5 (Peaceful)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${((5 - spot.ratings.crowdLevel + 1) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Community Experiences */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Community Experiences ({spot.experiences})</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowExperienceForm(!showExperienceForm)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Share Experience
              </Button>
            </div>

            {showExperienceForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <Textarea
                  value={newExperience}
                  onChange={(e) => setNewExperience(e.target.value)}
                  placeholder="Share your experience at this hidden spot..."
                  rows={3}
                  className="mb-3"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setShowExperienceForm(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddExperience}>
                    Share Experience
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {/* Mock experiences */}
              <div className="bg-white border rounded-lg p-3">
                <p className="text-sm text-gray-700">"Visited here last weekend with my partner. The sunset view was absolutely magical! Perfect for a romantic evening."</p>
                <p className="text-xs text-gray-500 mt-2">— Anonymous • 2 days ago</p>
              </div>
              <div className="bg-white border rounded-lg p-3">
                <p className="text-sm text-gray-700">"Great spot for photography. The lighting here is incredible during golden hour. Highly recommend for creative souls!"</p>
                <p className="text-xs text-gray-500 mt-2">— Creative_Soul_99 • 1 week ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpotDetailsModal;
