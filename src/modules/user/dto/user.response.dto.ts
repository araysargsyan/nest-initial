import { UserEntity } from '@/modules/user/user.entity';
import { Exclude } from 'class-transformer';
import { SkipValidation } from '@/common/utils/skip-validation.util';

export class UserResponseDto extends SkipValidation implements Partial<UserEntity> {
    @Exclude()
    password: string;
}
