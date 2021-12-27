import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, FindConditions, FindOneOptions } from 'typeorm';
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

    async get(params?: FindConditions<UserEntity>, options?: FindOneOptions<UserEntity>): Promise<UserEntity> {
        const user = await this.usersRepository.findOne(params, options);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        const user = await this.usersRepository.createUser(createUserDto);
        await this.createAndSendVerificationCode(user, false);

        return user;
    }

    private async createAndSendVerificationCode(user: UserEntity, canUpdate = true): Promise<void> {
        // let code = this.createVerificationCode();
        // let verification = this.accountVerificationRepository.create({ user, code });
        //
        // if (canUpdate) {
        //     //@ts-ignore
        //     verification = (await this.accountVerificationRepository.findOne({ user })) || verification;
        //
        //     if (verification.id) {
        //         if (moment().diff(moment(verification.updatedAt), 'minutes') > 10) {
        //             verification.code = code;
        //         } else {
        //             code = verification.code;
        //         }
        //     }
        // }
        //
        // await this.accountVerificationRepository.save(verification);
        //
        // this.mailService.sendUserConfirmation(user.email, `${user.firstName} ${user.lastName}`, code);
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
