import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
    public async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const user = this.create(createUserDto);

        await this.save(user);

        return user;
    }
}
