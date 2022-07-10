import { ValidationOptions } from '@/common/decorators/validation-options.decorator';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SocialUser } from '@/modules/extensions/auth/dto/social-user.dto';
import { DecryptValue } from '@/common/decorators/decrypt-value.constraint';

//@ValidateValueOfProperty('userToken') //* incoming data contain just string from query and in validation pipe we need to tell what property of DTO class must assign the value and starting validate
@ValidationOptions({ skipNullProperties: true })
export class UserFromToken {
    @ValidateNested()
    @Type(() => SocialUser)
    user: SocialUser;

    @DecryptValue(SocialUser, 'user') //* assign decrypted(using cryptoService) value to property(property should have declared like user)
    @IsNotEmpty()
    'user-token': string;
}
