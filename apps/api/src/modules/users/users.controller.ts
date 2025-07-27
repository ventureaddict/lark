import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req: any) {
    const userId = req.user.sub || req.user.userId;
    return await this.usersService.findById(userId);
  }

  @Put('profile')
  async updateProfile(
    @Req() req: any,
    @Body() body: { name?: string; avatar?: string },
  ) {
    const userId = req.user.sub || req.user.userId;
    return await this.usersService.updateProfile(userId, body);
  }

  @Put('preferences')
  async updatePreferences(
    @Req() req: any,
    @Body() body: { preferences: any },
  ) {
    const userId = req.user.sub || req.user.userId;
    return await this.usersService.updatePreferences(userId, body.preferences);
  }
}