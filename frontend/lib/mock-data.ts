export type MockListing = {
  id: number;
  title: string;
  location: string;
  pricePerNight: number;
  deposit: number;
  maxGuests: number;
  image: string;
  rating: number;
  reviews: number;
  host: string;
  amenities: string[];
  description: string;
};

export const MOCK_LISTINGS: MockListing[] = [
  {
    id: 1,
    title: "Modern Loft in Palermo Soho",
    location: "Buenos Aires, Argentina",
    pricePerNight: 85,
    deposit: 100,
    maxGuests: 3,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    rating: 4.92,
    reviews: 128,
    host: "0xHost...Palermo",
    amenities: ["WiFi", "Kitchen", "Air conditioning", "Workspace"],
    description: "Bright loft in the heart of Palermo. Perfect for remote work and exploring the city.",
  },
  {
    id: 2,
    title: "Beach House with Ocean View",
    location: "Punta del Este, Uruguay",
    pricePerNight: 220,
    deposit: 300,
    maxGuests: 6,
    image: "https://images.unsplash.com/photo-1499793983690-e29dafd1c5c1?w=800&q=80",
    rating: 4.98,
    reviews: 87,
    host: "0xHost...Punta",
    amenities: ["Pool", "Parking", "BBQ", "Ocean view"],
    description: "Stunning beach house steps from the sand. Ideal for families and groups.",
  },
  {
    id: 3,
    title: "Minimalist Apartment – Recoleta",
    location: "Buenos Aires, Argentina",
    pricePerNight: 65,
    deposit: 80,
    maxGuests: 2,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    rating: 4.85,
    reviews: 214,
    host: "0xHost...Recoleta",
    amenities: ["WiFi", "Elevator", "Heating", "Washer"],
    description: "Quiet and elegant apartment near the cemetery and parks of Recoleta.",
  },
  {
    id: 4,
    title: "Mountain Cabin Escape",
    location: "Bariloche, Argentina",
    pricePerNight: 140,
    deposit: 200,
    maxGuests: 5,
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80",
    rating: 4.95,
    reviews: 56,
    host: "0xHost...Bariloche",
    amenities: ["Fireplace", "Kitchen", "Parking", "Mountain view"],
    description: "Cozy cabin with panoramic lake and mountain views. Perfect digital detox.",
  },
  {
    id: 5,
    title: "Design Studio – São Paulo",
    location: "São Paulo, Brazil",
    pricePerNight: 95,
    deposit: 120,
    maxGuests: 2,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    rating: 4.88,
    reviews: 93,
    host: "0xHost...SP",
    amenities: ["WiFi", "Workspace", "Gym access", "Concierge"],
    description: "Stylish studio in Vila Madalena. Walking distance to the best bars and galleries.",
  },
  {
    id: 6,
    title: "Colonial House – Cartagena",
    location: "Cartagena, Colombia",
    pricePerNight: 175,
    deposit: 250,
    maxGuests: 4,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    rating: 4.97,
    reviews: 142,
    host: "0xHost...Cartagena",
    amenities: ["Pool", "Patio", "AC", "Historic center"],
    description: "Beautifully restored colonial house inside the walled city.",
  },
];
