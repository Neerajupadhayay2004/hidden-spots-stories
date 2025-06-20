
export interface Spot {
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

export interface SpotFormData {
  name: string;
  description: string;
  story: string;
  vibe: string;
  address: string;
  author: string;
  images: string[];
}

export interface SpotFilters {
  search: string;
  vibe: string;
  sortBy: string;
  minRating: number;
  maxDistance: number;
}
