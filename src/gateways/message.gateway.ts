import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3333, { cors: true })
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger(MessageGateway.name);
  @SubscribeMessage('userSendMessage')
  receiveMessage(client: Socket, payload: any) {
    this.server.emit('sendMessageToUser', payload);
  }

  afterInit(server: Server): any {
    this.logger.log(`Application initialized`);
  }

  handleConnection(client: Socket, ...args: any[]): any {
    this.logger.log(`Client connected as: ${client.id}`);
    this.server.emit('msgToClient', {
      owner: 'Renan Oliveira',
      message: 'Hello World',
    });
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`Client disconnected as: ${client.id}`);
  }
}
