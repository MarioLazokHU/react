import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import e from './edgeql-js';
import { client } from './edgedb';
import { CreateTodoDto } from './dto/create-todo.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { createHash, randomUUID } from 'crypto';
import { User } from './edgeql-js/interfaces';

@Controller('users')
export class UserController {
  @Get('/get-user/:id')
  async getUser(@Param('id') id: string): Promise<string> {
    const user = await e
      .select(e.User, () => ({
        email: true,
        role: true,
        expired: true,
        token: true,
        filter_single: { id },
      }))
      .run(client);
    return JSON.stringify(user);
  }

  @Post('/login')
  async loginUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    const user: User = await e
      .select(e.User, (u) => ({
        ...e.User['*'],
        filter: e.op(u.email, '=', createUserDto.email),
      }))
      .run(client);
    console.log(user);

    const hashedPassword = createHash('sha512')
      .update(createUserDto.password)
      .digest('hex');

    if (!user || user.hashedPassword !== hashedPassword) {
      return JSON.stringify({ error: 'Invalid credentials' });
    }

    const token = randomUUID();
    const expired = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await e.update(e.User, () => ({ set: {
      token, expired
    } })).run(client);

    const userObj: User = await e
      .select(e.User, () => ({
        ...e.User['*'],
        filter_single: { id: user.id },
      }))
      .run(client);

    return JSON.stringify({
      email: userObj.email,
      role: userObj.role,
      username: userObj.username,
    });
  }

  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto): Promise<string> {
    console.log(createUserDto);
    const { id } = await e
      .insert(e.User, {
        username: createUserDto.username,
        email: createUserDto.email,
        hashedPassword: createHash('sha512')
          .update(createUserDto.password)
          .digest('hex'),
      })
      .run(client);

    const [user] = await e
      .select(e.User, () => ({
        ...e.User['*'],
        filter_single: { id: id },
      }))
      .run(client);

    return JSON.stringify({
      email: user.email,
      role: user.role,
      username: user.username,
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

    /*await e
      .update(e.User, () => ({
        set: {
          todos: e.select(e.Todo, () => ({
            filter_single: { id: e.uuid(id) },
          })),
        },
        filter_single: { id: e.uuid(userId) },
      }))
      .run(client);*/

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
