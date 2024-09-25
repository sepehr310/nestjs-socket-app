import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async addNewMessage(createMessageDto: CreateMessageDto) {
    const { message, socketId } = createMessageDto;

    const chat = await this.chatModel.findOne({ socketId });
    const newMessage = new this.messageModel({ user: chat._id, message });
    await newMessage.save();

    chat.messages.push(newMessage);
    await chat.save();

    return newMessage;
  }

  async createChatUser(createChatDto: CreateChatDto) {
    const { socketId, name } = createChatDto;
    const chat = new this.chatModel({
      socketId: socketId,
      username: name,
    });

    return await chat.save();
  }
  async getUserChatMessages(socketId: string) {
    const chat = await this.chatModel
      .findOne({ socketId })
      .populate('messages')
      .exec();
    return chat ? chat.messages : [];
  }

  async findAll() {
    return await this.chatModel.find().populate('messages').exec();
  }

  async findOne(socketId: string) {
    return await this.chatModel
      .findOne({
        socketId: socketId,
      })
      .exec();
  }
}
