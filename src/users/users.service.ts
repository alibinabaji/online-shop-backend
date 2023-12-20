import { Injectable,NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
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
