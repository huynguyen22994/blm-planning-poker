import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JoinRoomDto } from '../dto/join-room.dto';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  getHello(): string {
    return 'Hello World!';
  }

  async joinRoom(body: JoinRoomDto): Promise<unknown> {
    console.log(body);
    const { username, roomName } = body;
    return {
      success: true,
      message: 'Join room success',
      data: {
        username,
        roomName,
      },
    };
  }
}
