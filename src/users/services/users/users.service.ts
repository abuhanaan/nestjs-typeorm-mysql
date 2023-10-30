import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import {
  CreateUserParams,
  UpdateUserParams,
} from 'src/users/utils/CreateUserParams';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  findUsers() {
    return this.userRepository.find();
  }

  async createUser(userDetails: CreateUserParams) {
    const existingUser: User = await this.userRepository.findOneBy({
      username: userDetails.username,
    });
    if (existingUser) {
      throw new HttpException('User Already Exist', HttpStatus.CONFLICT);
    } else {
      const newUser = this.userRepository.create({
        ...userDetails,
        created_at: new Date(),
      });
      return this.userRepository.save(newUser);
    }
  }

  async updateUser(userData: UpdateUserParams, id: number) {
    const user: User = await this.userRepository.findOneBy({
      id: id,
    });
    if (!user) {
      throw new HttpException('User Does Not Exist', HttpStatus.NOT_FOUND);
    } else {
      await this.userRepository.update({ id }, { ...userData });
      return 'User Updated Successfully';
    }
  }

  async deleteUser(id: number) {
    await this.userRepository.delete(id);
    return 'User Deleted Successfully';
  }
}
