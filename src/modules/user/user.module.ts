import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniqueConstraint } from '@common/decorators/unique.constraint';
import { UsersRepository } from './user.repository';

@Module({
    controllers: [UserController],
    providers: [UserService, UniqueConstraint],
    imports: [TypeOrmModule.forFeature([UsersRepository])],
    exports: [UserService],
})
export class UserModule {}
