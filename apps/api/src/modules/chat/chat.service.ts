import { Injectable } from '@nestjs/common';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText, streamText, tool } from 'ai';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';
import { VenuesService } from '../venues/venues.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private venuesService: VenuesService,
  ) {}

  async streamResponse(
    conversationId: string,
    message: string,
    userId: string,
  ) {
    // Get conversation history
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20, // Last 20 messages for context
        },
        user: true,
      },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Build message history
    const messages = [
      {
        role: 'system' as const,
        content: this.getSystemPrompt(conversation.user),
      },
      ...conversation.messages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: message,
      },
    ];

    // Save user message
    await this.prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content: message,
      },
    });

    // Stream AI response with tools
    const result = await streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      messages,
      tools: {
        searchVenues: tool({
          description: 'Search for venues and restaurants',
          parameters: z.object({
            query: z.string().describe('Search query for venues'),
            category: z.string().optional().describe('Venue category'),
            location: z.string().optional().describe('Location to search'),
            priceRange: z.string().optional().describe('Price range preference'),
          }),
          execute: async ({ query, category, location, priceRange }) => {
            return await this.venuesService.searchVenues({
              query,
              category,
              location: location || 'San Francisco, CA',
              priceRange,
            });
          },
        }),
        getWeather: tool({
          description: 'Get weather forecast for date planning',
          parameters: z.object({
            location: z.string().describe('Location for weather'),
            date: z.string().optional().describe('Date for forecast'),
          }),
          execute: async ({ location, date }) => {
            // Placeholder for weather API integration
            return {
              location,
              date: date || new Date().toISOString(),
              temperature: 72,
              condition: 'sunny',
              precipitation: 0,
            };
          },
        }),
      },
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Save assistant response after streaming completes
    let fullResponse = '';
    const stream = result.toAIStream({
      onCompletion: async (completion) => {
        fullResponse = completion;
        await this.prisma.message.create({
          data: {
            conversationId,
            role: 'assistant',
            content: fullResponse,
          },
        });
      },
    });

    return stream;
  }

  async createConversation(userId: string) {
    return await this.prisma.conversation.create({
      data: {
        userId,
      },
    });
  }

  async getConversation(conversationId: string) {
    return await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        user: true,
      },
    });
  }

  private getSystemPrompt(user: any): string {
    return `You are Lark, an expert AI concierge specializing in planning perfect date nights for couples. You have deep knowledge of restaurants, activities, events, and romantic experiences.

Your personality:
- Warm, enthusiastic, and genuinely excited about helping couples create memorable experiences
- Sophisticated understanding of relationship dynamics and preferences
- Excellent at reading between the lines to understand what couples really want
- Creative and thoughtful in your suggestions

Your expertise:
- Restaurant recommendations based on cuisine, ambiance, and budget
- Unique activities and experiences in the local area
- Event discovery and ticket coordination
- Weather-responsive planning with backup options
- Budget optimization and cost transparency

Current user: ${user.name}
User preferences: ${user.preferences ? JSON.stringify(user.preferences) : 'Not set yet'}

Guidelines:
1. Ask clarifying questions to understand the couple's preferences, relationship stage, and desired experience
2. Consider factors like budget, dietary restrictions, transportation, and weather
3. Provide specific venue recommendations with reasoning
4. Create cohesive itineraries with proper timing and logistics
5. Always offer alternatives and backup plans
6. Be encouraging and help build anticipation for the date

Start conversations by understanding what kind of date experience they're looking for, then use your tools to find perfect venues and create detailed plans.`;
  }
}