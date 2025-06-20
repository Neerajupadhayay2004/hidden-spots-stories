
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, MapPin, Heart, Leaf, Palette } from "lucide-react";

interface SpotSubmissionFormProps {
  onClose: () => void;
  onSubmit: (spot: any) => void;
}

const SpotSubmissionForm = ({ onClose, onSubmit }: SpotSubmissionFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    story: "",
    vibe: "",
    address: "",
    author: "",
    images: [] as string[],
  });

  const vibeOptions = [
    { value: "romantic", label: "Romantic", icon: Heart, color: "text-pink-600" },
    { value: "serene", label: "Serene", icon: Leaf, color: "text-green-600" },
    { value: "creative", label: "Creative", icon: Palette, color: "text-purple-600" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSpot = {
      id: Date.now().toString(),
      ...formData,
      ratings: {
        uniqueness: 4,
        vibe: 4,
        safety: 4,
        crowdLevel: 2,
      },
      location: {
        lat: 26.2183 + (Math.random() - 0.5) * 0.02,
        lng: 78.1828 + (Math.random() - 0.5) * 0.02,
        address: formData.address,
      },
      images: formData.images.length > 0 ? formData.images : [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop"
      ],
      experiences: 0,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newSpot);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Share a Hidden Spot</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Spot Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="What do you call this place?"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Address/Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter the location in Gwalior"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="vibe">Vibe *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, vibe: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="What's the vibe of this place?" />
                  </SelectTrigger>
                  <SelectContent>
                    {vibeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${option.color}`} />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Quick Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this place in a few words..."
                rows={3}
                required
              />
            </div>

            {/* Story */}
            <div>
              <Label htmlFor="story">Your Story *</Label>
              <Textarea
                id="story"
                value={formData.story}
                onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
                placeholder="Share your experience... What makes this place special? What happened here? Why should others visit?"
                rows={4}
                required
              />
            </div>

            {/* Image Upload Placeholder */}
            <div>
              <Label>Photos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 mb-2">Upload photos of this hidden spot</p>
                <p className="text-xs text-gray-400">For demo purposes, we'll use a placeholder image</p>
              </div>
            </div>

            {/* Author */}
            <div>
              <Label htmlFor="author">Your Name (optional)</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="How should we credit you?"
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                disabled={!formData.name || !formData.address || !formData.vibe || !formData.description || !formData.story}
              >
                Share Hidden Spot
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpotSubmissionForm;
