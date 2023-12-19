import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

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

  async login(username: string, password: string): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign({ username: user.username, sub: user.id }, 'your_secret_key', {
      expiresIn: '1h',
    });

    return token;
  }
}
