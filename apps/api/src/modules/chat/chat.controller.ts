import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('conversations')
  async createConversation(@Req() req: any) {
    const userId = req.user.sub || req.user.userId;
    return await this.chatService.createConversation(userId);
  }

  @Get('conversations/:id')
  async getConversation(@Param('id') conversationId: string) {
    return await this.chatService.getConversation(conversationId);
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @Param('id') conversationId: string,
    @Body() body: { message: string },
    @Req() req: any,
    @Res() res: Response,
  ) {
    const userId = req.user.sub || req.user.userId;
    const { message } = body;

    try {
      const stream = await this.chatService.streamResponse(
        conversationId,
        message,
        userId,
      );

      // Set headers for streaming
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Stream the response
      const reader = stream.getReader();
      const pump = () => {
        return reader.read().then(({ done, value }) => {
          if (done) {
            res.end();
            return;
          }
          res.write(value);
          return pump();
        });
      };
      return pump();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}