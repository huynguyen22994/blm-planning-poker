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
import { AppService } from './services/app.service';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

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
    client.emit('user-joined', message);
  }
}
