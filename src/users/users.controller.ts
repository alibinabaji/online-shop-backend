import { Controller, Post, Body, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() { username, password }: { username: string; password: string }) {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = await this.usersService.login(username, password);
    return { message: 'Login successful', token };
  }

  @Post('register')
  async register(@Body() { username, password }: { username: string; password: string }) {
    try {
      const newUser = await this.usersService.createUser(username, password);
      return { message: 'User registration successful', user: newUser };
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
}