
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Users, Shield, Sparkles, Search, Plus, Heart, Leaf, Palette, Menu, Filter } from "lucide-react";
import SpotCard from "@/components/SpotCard";
import SpotSubmissionForm from "@/components/SpotSubmissionForm";
import { hiddenSpots } from "@/data/spots";

const Index = () => {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("all");
  const [filteredSpots, setFilteredSpots] = useState(hiddenSpots);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
    let filtered = hiddenSpots;
    
    if (searchTerm) {
      filtered = filtered.filter(spot => 
        spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.story.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedVibe !== "all") {
      filtered = filtered.filter(spot => spot.vibe === selectedVibe);
    }
    
    setFilteredSpots(filtered);
  }, [searchTerm, selectedVibe]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Header - Responsive */}
      <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-8 md:py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 animate-fade-in">Hidden Spots</h1>
          <p className="text-lg md:text-xl opacity-90 mb-4 md:mb-8 animate-fade-in px-4">
            Discover Gwalior's secret gems through stories and community
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-1 md:gap-2 bg-white/10 rounded-full px-2 md:px-3 py-1">
              <MapPin className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Location-Based Discovery</span>
              <span className="sm:hidden">Location</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 bg-white/10 rounded-full px-2 md:px-3 py-1">
              <Star className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Community Rated</span>
              <span className="sm:hidden">Rated</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 bg-white/10 rounded-full px-2 md:px-3 py-1">
              <Users className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Story Driven</span>
              <span className="sm:hidden">Stories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar - Responsive */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search spots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="shrink-0"
              >
                <Filter className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setShowSubmissionForm(true)}
                size="sm"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="flex gap-2 overflow-x-auto pb-2">
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
                    className={`shrink-0 ${selectedVibe === vibe ? vibeColors[vibe] : ""}`}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search hidden spots, stories, or vibes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
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
                  className={selectedVibe === vibe ? vibeColors[vibe] : ""}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
                </Button>
              ))}
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

      {/* Main Content - Responsive Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredSpots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              onClick={() => setSelectedSpot(spot)}
            />
          ))}
        </div>

        {filteredSpots.length === 0 && (
          <div className="text-center py-12 md:py-16">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-12 h-12 md:w-16 md:h-16 mx-auto" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">No spots found</h3>
            <p className="text-gray-500 text-sm md:text-base px-4">Try adjusting your search or filters, or add a new hidden spot!</p>
          </div>
        )}
      </div>

      {/* Spot Submission Form Modal */}
      {showSubmissionForm && (
        <SpotSubmissionForm
          onClose={() => setShowSubmissionForm(false)}
          onSubmit={(newSpot) => {
            console.log("New spot submitted:", newSpot);
            setShowSubmissionForm(false);
          }}
        />
      )}
    </div>
  );
};

export default Index;
