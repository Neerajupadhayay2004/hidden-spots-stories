
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Users, Shield, Sparkles, Search, Plus, Heart, Leaf, Palette } from "lucide-react";
import SpotCard from "@/components/SpotCard";
import SpotSubmissionForm from "@/components/SpotSubmissionForm";
import { hiddenSpots } from "@/data/spots";

const Index = () => {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("all");
  const [filteredSpots, setFilteredSpots] = useState(hiddenSpots);

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
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4 animate-fade-in">Hidden Spots</h1>
          <p className="text-xl opacity-90 mb-8 animate-fade-in">
            Discover Gwalior's secret gems through stories and community
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Location-Based Discovery</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>Community Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Story Driven</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSpots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              onClick={() => setSelectedSpot(spot)}
            />
          ))}
        </div>

        {filteredSpots.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No spots found</h3>
            <p className="text-gray-500">Try adjusting your search or filters, or add a new hidden spot!</p>
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
