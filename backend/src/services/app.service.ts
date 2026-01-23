import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  CreateRoomDto,
  JoinRoomDto,
  VerifyRoomDto,
  VerifyPlayerDto,
} from '../dto/join-room.dto';
import { generateId } from '../utils';
import { CACHE_TTL } from '../constants/cache-ttl.constant';
import { CardValue, Player, Room } from '../types';
import { EventsGateway } from '../app.events.gateways';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AppService {
  constructor(
    private readonly eventsGateway: EventsGateway,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createRoom(body: CreateRoomDto): Promise<unknown> {
    const { username, roomName } = body;
    const roomId = body?.roomId ? body.roomId : generateId();
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

    return {
      success: true,
      message: 'Create room success',
      data: newRoom,
    };
  }

  async joinRoom(body: JoinRoomDto): Promise<unknown> {
    const { username, roomId } = body;

    if (!username || !roomId) return null;
    const room: Room = await this.cache.get(roomId);
    if (!room) return null;

    const playerId = generateId();
    const player: Player = {
      id: playerId,
      name: username,
      role: 'player',
      vote: null,
      hasVoted: false,
    };

    room.players.push(player);
    await this.cache.set(roomId, room, CACHE_TTL.HOUR);

    this.eventsGateway.emitToRoom(roomId, 'user-joined', {
      roomId: roomId,
      player: player,
    });

    return {
      success: true,
      message: 'Join room success',
      data: room,
    };
  }

  async verifyRoom(body: VerifyRoomDto): Promise<unknown> {
    const { roomId } = body;
    if (!roomId) return null;

    const existingRoom: Room = await this.cache.get(roomId);
    if (!existingRoom) return null;

    return {
      success: true,
      message: 'get room success',
      data: existingRoom,
    };
  }

  async verifyPlayer(body: VerifyPlayerDto): Promise<unknown> {
    const { roomId, userId } = body;

    const existingRoom: Room = await this.cache.get(roomId);
    if (!existingRoom) return null;

    const players = existingRoom.players ?? [];
    const player = players.find((item) => item.id === userId);
    if (!player) return null;

    return {
      success: true,
      message: 'get player success',
      data: player,
    };
  }

  /** NODE ENVENTS */
  @OnEvent('room.player.left')
  async handlePlayerLeft(payload: { roomId: string; playerId: string }) {
    const { roomId, playerId } = payload;

    const existingRoom: Room = await this.cache.get(roomId);
    if (!existingRoom) return;

    existingRoom.players = existingRoom.players.filter(
      (item) => item.id !== playerId,
    );

    if (existingRoom.players.length === 0) {
      await this.cache.del(roomId);
    } else {
      if (existingRoom.hostId === playerId) {
        existingRoom.hostId = existingRoom.players[0]?.id;
        existingRoom.players[0].role = 'host';
      }
      await this.cache.set(roomId, existingRoom, CACHE_TTL.HOUR);
    }
  }

  @OnEvent('room.player.vote', { async: true })
  async handleVote(payload: { roomId: string; vote: string; player: Player }) {
    const { roomId, vote, player } = payload;

    const existingRoom: Room = await this.cache.get(roomId);
    if (!existingRoom) return;

    existingRoom.players = existingRoom.players.map((item) => {
      if (item.id === player.id) {
        item.vote = vote as CardValue;
        item.hasVoted = true;
      }
      return item;
    });

    await this.cache.set(roomId, existingRoom, CACHE_TTL.HOUR);
  }

  @OnEvent('room.player.reveal', { async: true })
  async handleReveal(payload: { roomId: string }) {
    const { roomId } = payload;

    const existingRoom: Room = await this.cache.get(roomId);
    if (!existingRoom) return;

    existingRoom.isRevealed = true;

    await this.cache.set(roomId, existingRoom, CACHE_TTL.HOUR);
  }

  @OnEvent('room.player.reset', { async: true })
  async handleResetRound(payload: { roomId: string }) {
    const { roomId } = payload;

    const existingRoom: Room = await this.cache.get(roomId);
    if (!existingRoom) return;

    const currentRound = existingRoom.currentRound ?? 0;

    existingRoom.isRevealed = false;
    existingRoom.currentRound = currentRound + 1;
    existingRoom.players = existingRoom.players.map((item) => {
      return {
        ...item,
        vote: null,
        hasVoted: false,
      };
    });

    await this.cache.set(roomId, existingRoom, CACHE_TTL.HOUR);
  }
}
