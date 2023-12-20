import { Injectable, UnauthorizedException,NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async createUser(username: string, password: string): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { username } });

    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    const user = new User();
    user.username = username;
    user.password = hashedPassword;

    return this.usersRepository.save(user);
  }
  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  async login(username: string, password: string): Promise<string> {
    
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign({ username: user.username, sub: user.id }, 'your_secret_key', {
      expiresIn: '1h',
    });

    return token;
  }
  async generateResetToken(username: string): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    function generateRandomToken(length: number = 5): string {
      const bytes = randomBytes(Math.ceil(length / 2));
      return bytes.toString('hex').slice(0, length);
    }

    const resetToken = generateRandomToken();
    const resetTokenExpiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // Token expires in 24 hours

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;

    await this.usersRepository.save(user);

    return resetToken;
  }

  async resetPassword(username: string, newPassword: string, resetToken: string): Promise<void> {
    const user = await this.usersRepository.findOne({  where: { username, resetToken }, });

    if (!user || user.resetTokenExpiry < new Date()) {
      throw new NotFoundException('Invalid reset token or expired');
    }

    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await this.usersRepository.save(user);
  }
  async updateProfile(userId: number, updatedUser: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updatedUser.email) {
      const existingUserWithEmail = await this.usersRepository.findOne({ where : {email: updatedUser.email} });

      if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
        throw new BadRequestException('Email is already in use by another user');
      }

      user.email = updatedUser.email;
    }

    if (updatedUser.phone) {
      const existingUserWithPhone = await this.usersRepository.findOne({ where : {email: updatedUser.phone} });

      if (existingUserWithPhone && existingUserWithPhone.id !== userId) {
        throw new BadRequestException('Phone is already in use by another user');
      }

      user.phone = updatedUser.phone;
    }
    
    if (updatedUser.firstName) {
      user.firstName = updatedUser.firstName;
    }
    if (updatedUser.lastName) {
      user.lastName = updatedUser.lastName;
    }
  
    if (updatedUser.address) {
      user.address = updatedUser.address;
    }
  
    if (updatedUser.city) {
      user.city = updatedUser.city;
    }
  
    if (updatedUser.postalCode) {
      user.postalCode = updatedUser.postalCode;
    }

    // Update user fields as needed (e.g., firstName, lastName, email, phone, address, etc.)
    Object.assign(user, updatedUser);

    return this.usersRepository.save(user);
  }
}
