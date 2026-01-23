import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './services/app.service';

/** DTO */
import { JoinRoomDto } from './dto/join-room.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('api/create-room')
  async createRoom(@Body() body: JoinRoomDto) {
    const result = await this.appService.joinRoom(body);
    return result;
  }
}
