import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './services/app.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private server: Server;

  constructor(private readonly appService: AppService) {}

  /** INITIAL */
  afterInit(server: Server) {
    this.server = server;
    console.log('Socket initialized');
  }

  /** CONNECTION */
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);

    // gửi message khi connect
    client.emit('connected', {
      id: client.id,
      time: new Date(),
    });
  }

  /** DISCONNECTION */
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  /** EVENTS */
  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Ping received:', data);

    // emit lại cho client gửi
    client.emit('pong', {
      message: 'pong',
      time: new Date(),
    });

    // hoặc broadcast
    this.server.emit('broadcast', data);
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    client.emit('joined', room);

    // this.server.to('room1').emit('msg', 'hello room');
  }
}
