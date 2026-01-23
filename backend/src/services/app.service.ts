import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JoinRoomDto } from '../dto/join-room.dto';
import { generateId } from '../utils';
import { CACHE_TTL } from '../constants/cache-ttl.constant';
import { Player, Room } from '../types';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  getHello(): string {
    return 'Hello World!';
  }

  async joinRoom(body: JoinRoomDto): Promise<unknown> {
    console.log(body);
    const { username, roomName } = body;
    const roomId = generateId();
    const playerId = generateId();

    const host: Player = {
      id: playerId,
      name: username,
      role: 'host',
      vote: null,
      hasVoted: false,
    };

    const newRoom: Room = {
      id: roomId,
      name: roomName,
      hostId: playerId,
      players: [host],
      isRevealed: false,
      currentRound: 1,
    };

    const existingRoom = await this.cache.get(roomId);
    if (existingRoom) return null;

    await this.cache.set(roomId, newRoom, CACHE_TTL.HOUR);

    console.log(await this.cache.get(roomId));

    return {
      success: true,
      message: 'Create room success',
      data: newRoom,
    };
  }
}
