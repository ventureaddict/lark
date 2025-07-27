import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userData: {
    email: string;
    password: string;
    name: string;
    avatar?: string;
    preferences?: any;
  }) {
    return await this.prisma.user.create({
      data: userData,
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updatePreferences(userId: string, preferences: any) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { preferences },
    });
  }

  async updateProfile(userId: string, data: {
    name?: string;
    avatar?: string;
  }) {
    return await this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
}