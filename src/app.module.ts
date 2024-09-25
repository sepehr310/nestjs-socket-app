import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      serveRoot: '/public',
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(
      process.env.DATABASE_URI,
      {
        dbName: process.env.DATABASE_NAME,
        auth: {
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASS,
        },
      },
      //'mongodb+srv://w3sepehr79:hbv4hCmMeoJb9wSW@chat.wds8y.mongodb.net/?retryWrites=true&w=majority&appName=chat',
    ),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
