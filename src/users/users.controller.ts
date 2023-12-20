import { Controller, Post, Body, NotFoundException, UnauthorizedException, ConflictException, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() { username, password }: { username: string; password: string }) {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const passwordMatch = await this.usersService.comparePasswords(password, user.password);

    if (!passwordMatch) {
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

  @Patch('update-profile/:userId')
  async updateProfile(@Param('userId') userId: number, @Body() body: Partial<User>): Promise<User> {
    return this.usersService.updateProfile(userId, body);
  }
  
  @Post('reset-password/:username')
  async requestPasswordReset(@Param('username') username: string): Promise<{ message: string }> {
    const resetToken = await this.usersService.generateResetToken(username);
    // Send the resetToken to the user through email or other means
    return { message: 'Password reset token generated' };
  }

  @Patch('reset-password/:username/:resetToken')
  async resetPassword(
    @Param('username') username: string,
    @Param('resetToken') resetToken: string,
    @Body() body: { newPassword: string },
  ): Promise<{ message: string }> {
    await this.usersService.resetPassword(username, body.newPassword, resetToken);
    return { message: 'Password reset successful' };
  }
}