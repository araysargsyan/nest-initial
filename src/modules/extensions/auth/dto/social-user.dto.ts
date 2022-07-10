import { ValidationOptions } from '@/common/decorators/validation-options.decorator';
import { UserCreateDto } from '@/modules/user/dto/user.create.dto';
import { Exclude } from 'class-transformer';

@ValidationOptions({ skipNullProperties: true, skipMissingProperties: true })
export class SocialUser extends UserCreateDto {
    email: string = null;

    @Exclude()
    password: string;

    @Exclude()
    confirmPassword: string;
}
