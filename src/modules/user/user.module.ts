import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { DbConsEnum } from '../../config/ormconfig';
import { UniqueConstraint } from '../../common/decorators/unique.constraint';

@Module({
    controllers: [UserController],
    providers: [UserService, UniqueConstraint],
    imports: [TypeOrmModule.forFeature([UsersRepository])],
})
export class UserModule {}
