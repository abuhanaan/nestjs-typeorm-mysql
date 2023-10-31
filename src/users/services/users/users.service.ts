import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import {
  CreateUserParams,
  CreateUserPostParams,
  CreateUserProfileParams,
  UpdateUserParams,
} from 'src/users/utils/CreateUserParams';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  findUsers() {
    return this.userRepository.find({ relations: ['profile'] });
  }

  async findUserById(id: number) {
    const user: User = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'posts'],
    });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    } else return user;
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

  async createUserProfile(
    id: number,
    userProfileDetails: CreateUserProfileParams,
  ) {
    const user: User = await this.userRepository.findOne({
      where: { id: id },
      relations: ['profile'],
    });

    if (!user) {
      throw new HttpException('User Does Not Exist', HttpStatus.NOT_FOUND);
    } else {
      if (user.profile) {
        throw new HttpException(
          'User Already Have A Profile',
          HttpStatus.CONFLICT,
        );
      } else {
        const newUserProfile: Profile = this.profileRepository.create({
          ...userProfileDetails,
          created_at: new Date(),
        });
        const savedProfile = await this.profileRepository.save(newUserProfile);

        user.profile = savedProfile;
        return this.userRepository.save(user);
      }
    }
  }

  async createUserPost(id: number, userPostDetails: CreateUserPostParams) {
    const user: User = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException('User Does Not Exist', HttpStatus.NOT_FOUND);
    } else {
      const newPost = this.postRepository.create({ ...userPostDetails, user });
      const savedPost = await this.postRepository.save(newPost);
      return savedPost;
    }
  }
}
