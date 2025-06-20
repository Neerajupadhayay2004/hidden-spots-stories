import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Users, Search, Plus, Heart, Leaf, Palette, Filter, TrendingUp, Clock, Award } from "lucide-react";
import SpotCard from "@/components/SpotCard";
import SpotDetailsModal from "@/components/SpotDetailsModal";
import InteractiveMap from "@/components/InteractiveMap";
import SpotSubmissionForm from "@/components/SpotSubmissionForm";
import { dataService, FilterOptions } from "@/services/dataService";
import { locationService, LocationCoordinates } from "@/services/locationService";
import { Spot } from "@/types/spot";

const Index = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showSpotDetails, setShowSpotDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');

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

  useEffect(() => {
    loadSpots();
    getUserLocation();
  }, []);

  useEffect(() => {
    loadSpots();
  }, [searchTerm, selectedVibe, sortBy]);

  const loadSpots = async () => {
    try {
      setIsLoading(true);
      const filters: FilterOptions = {
        vibe: selectedVibe === 'all' ? undefined : selectedVibe,
        sortBy: sortBy as any,
      };
      
      const spotsData = await dataService.getSpots(filters);
      
      // Apply search filter
      let filteredSpots = spotsData;
      if (searchTerm) {
        filteredSpots = spotsData.filter(spot => 
          spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          spot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          spot.story.toLowerCase().includes(searchTerm.toLowerCase()) ||
          spot.location.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setSpots(filteredSpots);
    } catch (error) {
      console.error('Error loading spots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      setUserLocation(location);
    } catch (error) {
      console.error('Could not get user location:', error);
    }
  };

  const handleSpotSelect = (spot: Spot) => {
    setSelectedSpot(spot);
    setShowSpotDetails(true);
  };

  const handleNewSpotSubmit = async (newSpotData: any) => {
    try {
      const newSpot = await dataService.createSpot(newSpotData);
      setSpots(prev => [newSpot, ...prev]);
      setShowSubmissionForm(false);
    } catch (error) {
      console.error('Error creating spot:', error);
    }
  };

  const getSpotStats = () => {
    const totalSpots = spots.length;
    const averageRating = spots.reduce((sum, spot) => {
      return sum + (spot.ratings.uniqueness + spot.ratings.vibe + spot.ratings.safety) / 3;
    }, 0) / totalSpots || 0;
    
    const vibeCount = spots.reduce((acc, spot) => {
      acc[spot.vibe] = (acc[spot.vibe] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topVibe = Object.entries(vibeCount).sort(([,a], [,b]) => b - a)[0];
    
    return { totalSpots, averageRating, topVibe };
  };

  const stats = getSpotStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Enhanced Hero Header */}
      <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-12 md:py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in">Hidden Spots</h1>
            <p className="text-xl md:text-2xl opacity-90 mb-6 animate-fade-in px-4">
              Discover Gwalior's secret gems through stories and community
            </p>
            
            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base mb-8">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                <span>{stats.totalSpots} Hidden Spots</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Star className="w-4 h-4 md:w-5 md:h-5" />
                <span>{stats.averageRating.toFixed(1)} Avg Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Award className="w-4 h-4 md:w-5 md:h-5" />
                <span>Community Driven</span>
              </div>
              {stats.topVibe && (
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  {React.createElement(vibeIcons[stats.topVibe[0] as keyof typeof vibeIcons], { className: "w-4 h-4 md:w-5 md:h-5" })}
                  <span>Trending: {stats.topVibe[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Bar */}
      <div className="bg-white shadow-lg border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search spots, stories, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Filter className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setShowSubmissionForm(true)}
                size="sm"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="space-y-3 pb-4">
                <div className="flex gap-2 overflow-x-auto">
                  <Button
                    variant={selectedVibe === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedVibe("all")}
                    className="shrink-0"
                  >
                    All
                  </Button>
                  {Object.entries(vibeIcons).map(([vibe, Icon]) => (
                    <Button
                      key={vibe}
                      variant={selectedVibe === vibe ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedVibe(vibe)}
                      className={`shrink-0 ${selectedVibe === vibe ? vibeColors[vibe as keyof typeof vibeColors] : ""}`}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
                    </Button>
                  ))}
                </div>
                
                <div className="flex gap-2 overflow-x-auto">
                  <Button
                    variant={sortBy === "recent" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("recent")}
                    className="shrink-0"
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Recent
                  </Button>
                  <Button
                    variant={sortBy === "rating" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("rating")}
                    className="shrink-0"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Top Rated
                  </Button>
                  <Button
                    variant={sortBy === "popular" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("popular")}
                    className="shrink-0"
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Popular
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex gap-6 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search hidden spots, stories, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 text-base"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                variant={selectedVibe === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedVibe("all")}
              >
                All Vibes
              </Button>
              {Object.entries(vibeIcons).map(([vibe, Icon]) => (
                <Button
                  key={vibe}
                  variant={selectedVibe === vibe ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedVibe(vibe)}
                  className={selectedVibe === vibe ? vibeColors[vibe as keyof typeof vibeColors] : ""}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant={sortBy === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("recent")}
              >
                <Clock className="w-4 h-4 mr-1" />
                Recent
              </Button>
              <Button
                variant={sortBy === "rating" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("rating")}
              >
                <Star className="w-4 h-4 mr-1" />
                Top Rated
              </Button>
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("popular")}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Popular
              </Button>
            </div>

            <Button
              onClick={() => setShowSubmissionForm(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Spot
            </Button>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            Map View
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {viewMode === 'map' ? (
          <InteractiveMap
            spots={spots}
            onSpotSelect={handleSpotSelect}
            selectedSpot={selectedSpot}
          />
        ) : (
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {spots.map((spot) => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    onClick={() => handleSpotSelect(spot)}
                    userLocation={userLocation}
                  />
                ))}
              </div>
            )}

            {spots.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-6">
                  <MapPin className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-3">No spots found</h3>
                <p className="text-gray-500 text-lg mb-6 px-4">
                  {searchTerm || selectedVibe !== 'all' 
                    ? 'Try adjusting your search or filters to discover more hidden gems.'
                    : 'Be the first to share a hidden spot in Gwalior!'
                  }
                </p>
                <Button 
                  onClick={() => setShowSubmissionForm(true)}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your Hidden Spot
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showSubmissionForm && (
        <SpotSubmissionForm
          onClose={() => setShowSubmissionForm(false)}
          onSubmit={handleNewSpotSubmit}
          userLocation={userLocation}
        />
      )}

      {showSpotDetails && selectedSpot && (
        <SpotDetailsModal
          spot={selectedSpot}
          onClose={() => setShowSpotDetails(false)}
          userLocation={userLocation}
        />
      )}
    </div>
  );
};

export default Index;
