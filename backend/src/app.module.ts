import { Module } from '@nestjs/common';
import { TodoController, UserController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [TodoController, UserController],
  providers: [AppService],
})
export class AppModule {}
