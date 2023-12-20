import { Controller, Patch, Param, Body, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('update-profile/:userId')
  async updateProfile(@Param('userId') userId: number, @Body() body: Partial<User>): Promise<User> {
    const user = await this.usersService.updateProfile(userId, body);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
