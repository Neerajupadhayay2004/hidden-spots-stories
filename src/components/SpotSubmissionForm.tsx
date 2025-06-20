
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Upload, MapPin, Heart, Leaf, Palette, Camera, Trash2, Eye } from "lucide-react";

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

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const vibeOptions = [
    { value: "romantic", label: "Romantic", icon: Heart, color: "text-pink-600" },
    { value: "serene", label: "Serene", icon: Leaf, color: "text-green-600" },
    { value: "creative", label: "Creative", icon: Palette, color: "text-purple-600" },
  ];

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length + uploadedImages.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    const newUrls: string[] = [];
    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      newUrls.push(url);
    });

    setUploadedImages(prev => [...prev, ...validFiles]);
    setImagePreviewUrls(prev => [...prev, ...newUrls]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileChange(e.dataTransfer.files);
  };

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
      images: imagePreviewUrls.length > 0 ? imagePreviewUrls : [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop"
      ],
      experiences: 0,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newSpot);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl md:text-2xl">Share a Hidden Spot</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name">Spot Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="What do you call this place?"
                  required
                />
              </div>

              <div className="md:col-span-2">
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

              <div className="md:col-span-1">
                <Label htmlFor="vibe">Vibe *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, vibe: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vibe" />
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

              <div className="md:col-span-1">
                <Label htmlFor="author">Your Name (optional)</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="How should we credit you?"
                />
              </div>
            </div>

            {/* Photo Upload Section */}
            <div>
              <Label>Photos ({uploadedImages.length}/5)</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-amber-400 bg-amber-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files)}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, JPEG up to 5 images</p>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

            {/* Submit Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 order-1 sm:order-2"
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
