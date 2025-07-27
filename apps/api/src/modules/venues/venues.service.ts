import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface SearchVenuesParams {
  query: string;
  category?: string;
  location?: string;
  priceRange?: string;
}

export interface Venue {
  id: string;
  name: string;
  category: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  rating?: number;
  priceLevel?: number;
  description?: string;
  photos?: string[];
}

@Injectable()
export class VenuesService {
  constructor(private prisma: PrismaService) {}

  async searchVenues(params: SearchVenuesParams): Promise<Venue[]> {
    const { query, category, location = 'San Francisco, CA', priceRange } = params;

    // For MVP, we'll return mock data
    // In production, this would integrate with Foursquare API
    const mockVenues: Venue[] = [
      {
        id: '1',
        name: 'Atelier Crenn',
        category: 'Fine Dining',
        location: {
          address: '3127 Fillmore St, San Francisco, CA 94123',
          lat: 37.7879,
          lng: -122.4364,
        },
        rating: 4.8,
        priceLevel: 4,
        description: 'Michelin-starred French restaurant with artistic presentation',
        photos: ['https://example.com/atelier-crenn.jpg'],
      },
      {
        id: '2',
        name: 'Golden Gate Park',
        category: 'Outdoor Recreation',
        location: {
          address: 'Golden Gate Park, San Francisco, CA',
          lat: 37.7694,
          lng: -122.4862,
        },
        rating: 4.6,
        priceLevel: 1,
        description: 'Beautiful park perfect for romantic walks and picnics',
        photos: ['https://example.com/golden-gate-park.jpg'],
      },
      {
        id: '3',
        name: 'The Museum of Modern Art',
        category: 'Arts & Culture',
        location: {
          address: '151 3rd St, San Francisco, CA 94103',
          lat: 37.7857,
          lng: -122.4011,
        },
        rating: 4.5,
        priceLevel: 2,
        description: 'World-class contemporary art museum',
        photos: ['https://example.com/sfmoma.jpg'],
      },
      {
        id: '4',
        name: 'Sunset Wine Bar',
        category: 'Wine Bar',
        location: {
          address: '2100 Irving St, San Francisco, CA 94122',
          lat: 37.7634,
          lng: -122.4831,
        },
        rating: 4.4,
        priceLevel: 3,
        description: 'Cozy wine bar with craft cocktails and small plates',
        photos: ['https://example.com/sunset-wine.jpg'],
      },
      {
        id: '5',
        name: 'Pier 39',
        category: 'Entertainment',
        location: {
          address: 'Pier 39, San Francisco, CA 94133',
          lat: 37.8087,
          lng: -122.4098,
        },
        rating: 4.2,
        priceLevel: 2,
        description: 'Waterfront entertainment complex with shops and restaurants',
        photos: ['https://example.com/pier39.jpg'],
      },
    ];

    // Filter venues based on search criteria
    let filteredVenues = mockVenues;

    if (query) {
      const searchLower = query.toLowerCase();
      filteredVenues = filteredVenues.filter(
        venue =>
          venue.name.toLowerCase().includes(searchLower) ||
          venue.category.toLowerCase().includes(searchLower) ||
          venue.description?.toLowerCase().includes(searchLower)
      );
    }

    if (category) {
      filteredVenues = filteredVenues.filter(
        venue => venue.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (priceRange) {
      const priceMap = { 'budget': 1, 'moderate': 2, 'expensive': 3, 'luxury': 4 };
      const maxPrice = priceMap[priceRange.toLowerCase()] || 4;
      filteredVenues = filteredVenues.filter(
        venue => (venue.priceLevel || 1) <= maxPrice
      );
    }

    return filteredVenues.slice(0, 6); // Return top 6 results
  }

  async getVenueById(id: string): Promise<Venue | null> {
    // In production, this would fetch from database or external API
    const venues = await this.searchVenues({ query: '' });
    return venues.find(venue => venue.id === id) || null;
  }

  async saveVenue(venue: Venue): Promise<void> {
    await this.prisma.venue.upsert({
      where: { id: venue.id },
      update: {
        name: venue.name,
        category: venue.category,
        location: JSON.stringify(venue.location),
        rating: venue.rating,
        priceLevel: venue.priceLevel,
        metadata: JSON.stringify({
          description: venue.description,
          photos: venue.photos,
        }),
      },
      create: {
        id: venue.id,
        name: venue.name,
        category: venue.category,
        location: JSON.stringify(venue.location),
        rating: venue.rating,
        priceLevel: venue.priceLevel,
        metadata: JSON.stringify({
          description: venue.description,
          photos: venue.photos,
        }),
      },
    });
  }
}