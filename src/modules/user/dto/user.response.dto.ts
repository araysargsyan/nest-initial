import { UserEntity } from '@/modules/user/user.entity';
import { Exclude } from 'class-transformer';
import { ValidationOptions } from '@/common/decorators/validation-options.decorator';

export class UserResponseDto implements Partial<UserEntity> {
    @Exclude()
    password: string;
}
