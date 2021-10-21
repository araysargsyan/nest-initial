import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
    ) {}

    public getUser(params: { id?: number; email?: string }): Promise<UserEntity> {
        const user = this.usersRepository.findOne(params);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async createUser(dto: CreateUserDto) {
        return await this.usersRepository.createUser(dto);
    }

    async findAll(): Promise<UserEntity[] | any> {
        const users = await this.usersRepository.find();
        //console.log(user)
        return users;
    }

    // findOneByEmail(op): Promise<UserEntity> {
    //   return this.usersRepository.findOne(op);
    // }
    //
    // findOne(id: string): Promise<UserEntity> {
    //   return this.usersRepository.findOne(id);
    // }

    remove(id: string): Promise<void | DeleteResult> {
        return this.usersRepository.delete(id);
    }
}
