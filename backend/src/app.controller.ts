import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './services/app.service';

/** DTO */
import {
  JoinRoomDto,
  VerifyRoomDto,
  VerifyPlayerDto,
} from './dto/join-room.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api/ping')
  pingPong(): string {
    return this.appService.getHello();
  }

  @Post('api/create-room')
  async createRoom(@Body() body: JoinRoomDto) {
    const result = await this.appService.joinRoom(body);
    return result;
  }

  @Post('api/verify-room')
  async verifyRoom(@Body() body: VerifyRoomDto) {
    const result = await this.appService.verifyRoom(body);
    return result;
  }

  @Post('api/verify-player')
  async verifyPlayer(@Body() body: VerifyPlayerDto) {
    const result = await this.appService.verifyPlayer(body);
    return result;
  }
}
