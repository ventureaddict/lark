import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VenuesService, Venue } from './venues.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('venues')
@Controller('venues')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VenuesController {
  constructor(private venuesService: VenuesService) {}

  @Get('search')
  async searchVenues(
    @Query('query') query: string,
    @Query('category') category?: string,
    @Query('location') location?: string,
    @Query('priceRange') priceRange?: string,
  ): Promise<Venue[]> {
    return await this.venuesService.searchVenues({
      query,
      category,
      location,
      priceRange,
    });
  }
}