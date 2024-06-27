import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import e from './edgeql-js';
import { client } from './edgedb';
import { CreateTodoDto } from './dto/create-todo.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { createHash, randomUUID } from 'crypto';
import { User } from './edgeql-js/interfaces';

@Controller('users')
export class UserController {
  @Get('/get-user/:token')
  async getUser(@Param('token') token: string): Promise<string> {
    const user = await e
      .select(e.User, (u) => ({
        token: true,
        expired: true,
        filter: e.op(u.token, '=', token),
      }))
      .run(client);
    const selectedUser = user[0];
    return JSON.stringify(selectedUser);
  }

  @Post('/login')
  async loginUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    const user = await e
      .select(e.User, () => ({
        ...e.User['*'],
        filter_single: { email: createUserDto.email },
      }))
      .run(client);

    const selectedUser = user as unknown as User;

    const hashedPassword = createHash('sha512')
      .update(createUserDto.password)
      .digest('hex');

    if (selectedUser.hashedPassword !== hashedPassword) {
      return JSON.stringify({ error: 'Invalid credentials' });
    }

    const token = randomUUID();
    const expired = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await e
      .update(e.User, () => ({
        set: {
          token,
          expired,
        },
        filter_single: { id: selectedUser.id },
      }))
      .run(client);

    const userObj = await e
      .select(e.User, () => ({
        ...e.User['*'],
        filter_single: { id: selectedUser.id },
      }))
      .run(client);

    const selectedUObj = userObj as unknown as User;

    return JSON.stringify({
      email: selectedUObj.email,
      role: selectedUObj.role,
      username: selectedUObj.username,
      token: selectedUObj.token,
      expired: selectedUObj.expired,
    });
  }

  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto): Promise<string> {
    const { id } = await e
      .insert(e.User, {
        username: createUserDto.username,
        email: createUserDto.email,
        hashedPassword: createHash('sha512')
          .update(createUserDto.password)
          .digest('hex'),
      })
      .run(client);

    const user = await e
      .select(e.User, () => ({
        ...e.User['*'],
        filter_single: { id: id },
      }))
      .run(client);

    const selectedUser = user as unknown as User;

    return JSON.stringify({
      email: selectedUser.email,
      role: selectedUser.role,
      username: selectedUser.username,
      token: selectedUser.token,
      expired: selectedUser.expired,
    });
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

  @Get('/get-todo/:token')
  async getUserTodo(@Param('token') token: string): Promise<string> {
    const todos = await e
      .select(e.Todo, (t) => ({ ...e.Todo['*'], filter: e.op(t['<tudos[is User]'].token, "=", token) }))
      .run(client);
    return JSON.stringify(todos);
  }

  @Post('/create-todo/:token/:username')
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @Param('token') token: string,
    @Param('username') username: string,
  ): Promise<string> {
    const todo = await e
      .insert(e.Todo, {
        creator: username,
        title: createTodoDto.title,
        description: createTodoDto.description,
        hours: createTodoDto.hours,
        deadline: createTodoDto.deadline,
      })
      .run(client);

    await e
      .update(e.User, (u) => ({
        set: {
          tudos: e.select(e.Todo, () => ({
            filter_single: { id: e.uuid(todo.id) },
          })),
        },
        filter: e.op(u.token, '=', token),
      }))
      .run(client);

    return JSON.stringify({ success: true, id: todo.id });
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

  @Patch('/change-todo-status')
  async changeStatus(
    @Body() data: { id: string; status: 'pending' | 'done' | 'deferred' },
  ): Promise<string> {
    await e
      .update(e.Todo, () => ({
        set: {
          status: data.status,
        },
        filter_single: { id: data.id },
      }))
      .run(client);
    return JSON.stringify({ success: true });
  }
}
