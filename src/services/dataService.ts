
import { Spot } from '../types/spot';

export interface FilterOptions {
  vibe?: string;
  maxDistance?: number;
  minRating?: number;
  sortBy?: 'distance' | 'rating' | 'recent' | 'popular';
}

export interface SpotStats {
  totalSpots: number;
  averageRating: number;
  topVibes: { vibe: string; count: number }[];
  recentSpots: number;
}

class DataService {
  private baseUrl = '/api'; // This would be your actual API URL
  
  // Get all spots with optional filtering
  async getSpots(filters?: FilterOptions): Promise<Spot[]> {
    try {
      // Mock API call - in real app, this would be an actual HTTP request
      const spots = await this.getMockSpots();
      return this.applyFilters(spots, filters);
    } catch (error) {
      console.error('Error fetching spots:', error);
      throw error;
    }
  }

  // Get spot by ID
  async getSpotById(id: string): Promise<Spot | null> {
    try {
      const spots = await this.getMockSpots();
      return spots.find(spot => spot.id === id) || null;
    } catch (error) {
      console.error('Error fetching spot:', error);
      return null;
    }
  }

  // Create new spot
  async createSpot(spotData: Omit<Spot, 'id' | 'createdAt' | 'experiences'>): Promise<Spot> {
    try {
      const newSpot: Spot = {
        ...spotData,
        id: Date.now().toString(),
        experiences: 0,
        createdAt: new Date().toISOString(),
      };
      
      // In real app, this would save to database
      console.log('Creating new spot:', newSpot);
      return newSpot;
    } catch (error) {
      console.error('Error creating spot:', error);
      throw error;
    }
  }

  // Update spot rating
  async updateSpotRating(spotId: string, ratings: Spot['ratings']): Promise<boolean> {
    try {
      // In real app, this would update the database
      console.log('Updating spot rating:', spotId, ratings);
      return true;
    } catch (error) {
      console.error('Error updating spot rating:', error);
      return false;
    }
  }

  // Get spots statistics
  async getSpotStats(): Promise<SpotStats> {
    try {
      const spots = await this.getMockSpots();
      const totalRating = spots.reduce((sum, spot) => {
        return sum + (spot.ratings.uniqueness + spot.ratings.vibe + spot.ratings.safety) / 3;
      }, 0);

      const vibeCount = spots.reduce((acc, spot) => {
        acc[spot.vibe] = (acc[spot.vibe] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topVibes = Object.entries(vibeCount)
        .map(([vibe, count]) => ({ vibe, count }))
        .sort((a, b) => b.count - a.count);

      return {
        totalSpots: spots.length,
        averageRating: totalRating / spots.length,
        topVibes,
        recentSpots: spots.filter(spot => {
          const spotDate = new Date(spot.createdAt);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return spotDate > weekAgo;
        }).length,
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  private async getMockSpots(): Promise<Spot[]> {
    // Extended mock data with more spots in Gwalior
    return [
      {
        id: "1",
        name: "Sunset Point at Gwalior Fort",
        description: "A secluded corner of the ancient fort where golden hour paints the entire city below in warm hues. Perfect for intimate conversations and peaceful reflection.",
        story: "I discovered this spot during my college days when I was feeling overwhelmed with studies. As the sun set behind the Sasbahu temples, I realized that some of life's most beautiful moments happen when we least expect them. The way the light dances on the sandstone walls at sunset is pure magic.",
        vibe: "serene" as const,
        ratings: { uniqueness: 5, vibe: 5, safety: 4, crowdLevel: 2 },
        location: { lat: 26.2295, lng: 78.1691, address: "Gwalior Fort, Near Sasbahu Temple, Gwalior" },
        images: ["https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=600&fit=crop"],
        author: "Priya M.",
        experiences: 23,
        createdAt: "2024-03-15T16:30:00Z",
      },
      {
        id: "2",
        name: "The Secret Garden Café Corner",
        description: "A hidden courtyard behind Gwalior's old market where a tiny café serves the best masala chai. Surrounded by flowering vines and old-world charm.",
        story: "My grandmother used to bring me here when I was seven. The owner, Sharma Uncle, still remembers my favorite seat - the corner table under the jasmine vine. When I brought my partner here for our first anniversary, Sharma Uncle winked and said 'This corner has seen many love stories bloom.'",
        vibe: "romantic" as const,
        ratings: { uniqueness: 4, vibe: 5, safety: 5, crowdLevel: 1 },
        location: { lat: 26.2144, lng: 78.1869, address: "Behind Sarafa Bazaar, Old Gwalior City" },
        images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop"],
        author: "Arjun K.",
        experiences: 31,
        createdAt: "2024-03-10T14:20:00Z",
      },
      {
        id: "3",
        name: "Tighra Dam Artist's Retreat",
        description: "A quiet spot by the water where local artists gather to paint and create. The reflection of clouds in the still water provides endless inspiration.",
        story: "As an art student, I was struggling to find my style until I stumbled upon this corner of Tighra Dam. Every Sunday, a small group of artists gather here with their easels and sketchpads. The first time I painted the water lilies at dawn, with mist rising from the lake, I finally understood what it meant to capture a moment.",
        vibe: "creative" as const,
        ratings: { uniqueness: 4, vibe: 4, safety: 4, crowdLevel: 2 },
        location: { lat: 26.1876, lng: 78.1432, address: "Tighra Dam, Near Boat Club, Gwalior" },
        images: ["https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop"],
        author: "Meera S.",
        experiences: 18,
        createdAt: "2024-03-05T09:15:00Z",
      },
      {
        id: "4",
        name: "Phool Bagh Hidden Grove",
        description: "A secluded grove within the public garden where ancient trees create a natural canopy. Perfect for meditation, reading, or quiet dates away from city noise.",
        story: "After my father passed away, I couldn't find peace anywhere. A friend suggested this quiet corner of Phool Bagh where old banyan trees create a natural sanctuary. The first time I sat here with his favorite book, I felt his presence in the rustling leaves.",
        vibe: "serene" as const,
        ratings: { uniqueness: 3, vibe: 5, safety: 5, crowdLevel: 1 },
        location: { lat: 26.2089, lng: 78.1711, address: "Phool Bagh Garden, Behind Rose Section, Gwalior" },
        images: ["https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop"],
        author: "Rahul T.",
        experiences: 27,
        createdAt: "2024-02-28T11:45:00Z",
      },
      {
        id: "5",
        name: "Jai Vilas Palace Secret Balcony",
        description: "A forgotten balcony overlooking the manicured gardens of Jai Vilas Palace. Royal architecture meets intimate storytelling in this hidden gem.",
        story: "During a heritage walk, our guide mentioned this overlooked balcony. I returned alone the next evening and watched peacocks dance in the gardens below. The ornate carved pillars and the golden light filtering through old windows made me feel like I was living in a fairy tale.",
        vibe: "romantic" as const,
        ratings: { uniqueness: 5, vibe: 4, safety: 3, crowdLevel: 1 },
        location: { lat: 26.2158, lng: 78.1768, address: "Jai Vilas Palace Complex, Gwalior" },
        images: ["https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop"],
        author: "Kavya R.",
        experiences: 15,
        createdAt: "2024-02-20T18:45:00Z",
      },
      {
        id: "6",
        name: "Tansen's Musical Corner",
        description: "A acoustic sweet spot near Tansen's tomb where every whisper echoes with musical resonance. Local musicians gather here for impromptu jam sessions.",
        story: "I'm a music student and heard about this place from my professor. The acoustics here are incredible - even a simple hum resonates beautifully. I've met some amazing musicians here who taught me more about music in one evening than months of formal classes.",
        vibe: "creative" as const,
        ratings: { uniqueness: 5, vibe: 5, safety: 4, crowdLevel: 3 },
        location: { lat: 26.2167, lng: 78.1854, address: "Near Tansen Tomb, Gwalior" },
        images: ["https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop"],
        author: "Aryan V.",
        experiences: 42,
        createdAt: "2024-02-15T20:30:00Z",
      },
      {
        id: "7",
        name: "Gopachal Parvat Cave Temple",
        description: "Ancient Jain cave temples carved into rock faces, where silence speaks louder than words. A spiritual retreat from the modern world.",
        story: "My meditation teacher brought our group here for a silent retreat. Sitting in these 1500-year-old caves, surrounded by intricate carvings of Tirthankaras, I experienced the deepest meditation of my life. The energy here is indescribable - pure peace and ancient wisdom.",
        vibe: "serene" as const,
        ratings: { uniqueness: 5, vibe: 5, safety: 4, crowdLevel: 2 },
        location: { lat: 26.2134, lng: 78.1689, address: "Gopachal Parvat, Gwalior Fort Complex" },
        images: ["https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop"],
        author: "Sanjana M.",
        experiences: 29,
        createdAt: "2024-02-10T16:15:00Z",
      },
      {
        id: "8",
        name: "Kala Vithika Art Gallery Rooftop",
        description: "A rooftop space above the city's contemporary art gallery where sunset meets creativity. Local artists display their work under the open sky.",
        story: "I stumbled upon this during an art exhibition. The curator mentioned they sometimes host rooftop shows. I attended one last month - watching contemporary art pieces against the backdrop of Gwalior's ancient skyline while the sun set was surreal. It's where tradition meets modernity.",
        vibe: "creative" as const,
        ratings: { uniqueness: 4, vibe: 4, safety: 5, crowdLevel: 2 },
        location: { lat: 26.2178, lng: 78.1756, address: "Kala Vithika, City Center, Gwalior" },
        images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop"],
        author: "Nisha P.",
        experiences: 21,
        createdAt: "2024-02-05T19:20:00Z",
      }
    ];
  }

  private applyFilters(spots: Spot[], filters?: FilterOptions): Spot[] {
    if (!filters) return spots;

    let filtered = [...spots];

    if (filters.vibe && filters.vibe !== 'all') {
      filtered = filtered.filter(spot => spot.vibe === filters.vibe);
    }

    if (filters.minRating) {
      filtered = filtered.filter(spot => {
        const avgRating = (spot.ratings.uniqueness + spot.ratings.vibe + spot.ratings.safety) / 3;
        return avgRating >= filters.minRating!;
      });
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'rating':
            const aRating = (a.ratings.uniqueness + a.ratings.vibe + a.ratings.safety) / 3;
            const bRating = (b.ratings.uniqueness + b.ratings.vibe + b.ratings.safety) / 3;
            return bRating - aRating;
          case 'recent':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'popular':
            return b.experiences - a.experiences;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }
}

export const dataService = new DataService();
