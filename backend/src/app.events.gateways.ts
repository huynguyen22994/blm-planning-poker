import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(private eventEmitter: EventEmitter2) {}

  afterInit() {
    console.log('Socket initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  /** 🔥 METHOD CHO SERVICE DÙNG */
  emitToRoom(room: string, event: string, payload: any) {
    this.server.to(room).emit(event, payload);
  }

  emitToClient(clientId: string, event: string, payload: any) {
    this.server.to(clientId).emit(event, payload);
  }

  emitAll(event: string, payload: any) {
    this.server.emit(event, payload);
  }

  /** EVENTS */
  @SubscribeMessage('join-room')
  handleJoin(@MessageBody() message: any, @ConnectedSocket() client: Socket) {
    const { roomId, player } = message ?? {};
    client.join(roomId);
    client.emit('user-joined', {
      roomId,
      player,
    });
  }

  @SubscribeMessage('leave-room')
  async handleLeave(
    @MessageBody() message: any,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, playerId } = message ?? {};

    if (!roomId || !playerId) {
      return;
    }
    this.eventEmitter.emit('room.player.left', {
      roomId,
      playerId,
    });
    setTimeout(() => {
      client.leave(roomId);
      client.to(roomId).emit('user-left', {
        roomId,
        playerId,
      });
      console.log(`Player ${playerId} left room ${roomId}`);
    }, 800);
  }
}
