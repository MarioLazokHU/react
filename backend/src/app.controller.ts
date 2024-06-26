import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import e from './edgeql-js';
import { client } from './edgedb';
import { CreateTodoDto } from './dto/create-todo.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  @Get('/get-user/:id')
  async getUser(@Param('id') id: string): Promise<string> {
    const user = await e
      .select(e.User, () => ({
        filter_single: { id },
      }))
      .run(client);
    return JSON.stringify(user);
  }

  @Post('/login')
  async loginUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    const user = await e
      .select(e.User, () => ({
        id: true,
        username: true,
        filter_single: { username: createUserDto.username },
      }))
      .run(client);

    if (user) {
      return JSON.stringify(user);
    } else {
      return JSON.stringify({ error: 'User not found' });
    }
  }

  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto): Promise<string> {
    const { id } = await e
      .insert(e.User, {
        username: createUserDto.username,
      })
      .run(client);

    const user = await e
      .select(e.User, () => ({
        ...e.User['*'],
        filter_single: { id: id },
      }))
      .run(client);

    return JSON.stringify(user);
  }
}

@Controller('todos')
export class TodoController {
  @Get('/get-todo')
  async getTodo(): Promise<string> {
    const todos = await e
      .select(e.Todo, () => ({ ...e.Todo['*'] }))
      .run(client);
    return JSON.stringify(todos);
  }

  @Post('/create-todo/:id')
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @Param('id') userId: string,
  ): Promise<string> {
    const { id } = await e
      .insert(e.Todo, {
        title: createTodoDto.title,
        description: createTodoDto.description,
        hours: createTodoDto.hours,
        deadline: createTodoDto.deadline,
      })
      .run(client);

    await e
      .update(e.User, () => ({
        set: {
          todos: e.select(e.Todo, () => ({
            filter_single: { id: e.uuid(id) },
          })),
        },
        filter_single: { id: e.uuid(userId) },
      }))
      .run(client);

    return JSON.stringify({ success: true, id });
  }

  @Delete('/delete-todo')
  async remove(@Body() uuid: { id: string }): Promise<string> {
    await e
      .delete(e.Todo, () => ({
        filter_single: { id: e.uuid(uuid.id) },
      }))
      .run(client);
    return JSON.stringify({ success: true });
  }
}
