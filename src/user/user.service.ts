import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { id, first_name, last_name, username, language_code, is_bot } =
      createUserDto;
    const existUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (existUser) {
      // throw new BadRequestException('This email already exist!');
      await this.userRepository.update(existUser.uuid, {
        id,
        is_bot,
        username,
        first_name,
        last_name,
        language_code,
      });
      return 'С возвращением ' + username + '!';
    }

    await this.userRepository.save({
      id,
      is_bot,
      username,
      first_name,
      last_name,
      language_code,
    });

    return 'Здравствуйте ' + username + '!';
  }

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  async update(user_uuid: string, updatePostDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        uuid: user_uuid,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepository.update(user_uuid, updatePostDto);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
