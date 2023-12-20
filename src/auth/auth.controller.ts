import { Controller, Post, Body, NotFoundException, UnauthorizedException, ConflictException, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
      private readonly AuthService: AuthService,
      private readonly UsersService: UsersService
      ) {}

  @Post('login')
  async login(@Body() { username, password }: { username: string; password: string }) {
    const user = await this.AuthService.findOne(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const passwordMatch = await this.AuthService.comparePasswords(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = await this.AuthService.login(username, password);
    return { message: 'Login successful', token };
  }

  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    try {
      const existingUser = await this.AuthService.findOneByUsername(userData.username);
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
      // Create user in Auth table
      const newAuthUser = await this.UsersService.createUser(userData);
      
      // Create user in User table
      await this.AuthService.createUser(userData);
    return { message: 'User registration successful', user: newAuthUser  };
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  @Post('reset-password/:username')
  async requestPasswordReset(@Param('username') username: string): Promise<{ message: string }> {
    const resetToken = await this.AuthService.generateResetToken(username);
    // Send the resetToken to the user through email or other means
    return { message: 'Password reset token generated' };
  }

  @Patch('reset-password-token/:username/:resetToken')
  async resetPassword(
    @Param('username') username: string,
    @Param('resetToken') resetToken: string,
    @Body() body: { newPassword: string },
  ): Promise<{ message: string }> {
    await this.AuthService.resetPassword(username, body.newPassword, resetToken);
    return { message: 'Password reset successful' };
  }
}