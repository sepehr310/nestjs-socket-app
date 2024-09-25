import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Message } from './message.entity';

@Schema()
export class Chat extends Document {
  @Prop()
  socketId: string;

  @Prop()
  username: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
  messages: Message[];

  @Prop({ default: Date.now })
  createdAt: Date;
e
}

export const chatSchema = SchemaFactory.createForClass(Chat);
