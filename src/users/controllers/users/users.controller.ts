import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/users/dtos/CreateUser.dto';
import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  getUsers() {
    return this.userService.findUsers();
  }

  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  @Post()
  createUser(@Body() userData: CreateUserDto) {
    const { confirmPassword, ...userDetails } = userData;
    if (userDetails.password !== confirmPassword) {
      throw new HttpException('Password mismatch', HttpStatus.BAD_REQUEST);
    } else {
      return this.userService.createUser(userDetails);
    }
  }

  @Post('/:id')
  updateUserById(
    @Body() userUpdateData: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.updateUser(userUpdateData, id);
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Post(':id/profile')
  createUserProfile(
    @Body() userProfileData: CreateUserProfileDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const { ...userProfileDetails } = userProfileData;

    return this.userService.createUserProfile(id, userProfileDetails);
  }

  @Post(':id/post')
  createUserPost(
    @Body() userPostData: CreateUserPostDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.createUserPost(id, userPostData);
  }
}
