import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserCreateDto } from './dto/user.create.dto';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
    public async createUser(createUserDto: UserCreateDto): Promise<UserEntity> {
        const user = this.create(createUserDto);

        await this.save(user);

        return user;
    }
}
