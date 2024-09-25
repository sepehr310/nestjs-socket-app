import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { log } from 'console';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('addmessage')
  create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    createMessageDto.socketId = client.id;
    this.chatService.addNewMessage(createMessageDto);
    this.server.emit('addmessage', { createMessageDto });
  }

  @SubscribeMessage('connectUser')
  connect(
    @ConnectedSocket() client: Socket,
    @MessageBody() createChatDto: CreateChatDto,
  ) {
    createChatDto.socketId = client.id;
    log('connect: ' + client.id + '- User: ' + createChatDto.name);

    this.chatService.createChatUser(createChatDto);
    this.server.emit('connectUser', { createChatDto });
  }
}
