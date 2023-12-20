import { Injectable, UnauthorizedException,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './auth.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private usersRepository: Repository<Auth>,
  ) {}
 
 async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async findOne(username: string): Promise<Auth | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findOneByUsername(username: string): Promise<Auth | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async createUser(userData: CreateUserDto): Promise<Auth> {
    const { username, password } = userData;

    const existingUser = await this.usersRepository.findOne({ where: { username } });

    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    const authUser = new Auth();
    authUser.username = username;
    authUser.password = hashedPassword;

    return this.usersRepository.save(authUser);

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
  async validateUser(username: string, password: string): Promise<Auth | null> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    return user;
  }
  
}
