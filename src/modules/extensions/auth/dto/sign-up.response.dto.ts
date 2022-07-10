import { Type } from 'class-transformer';
import { UserResponseDto } from '@/modules/user/dto/user.response.dto';

export class SignUpResponseDto {
    accessToken: string;

    @Type(() => UserResponseDto)
    user: UserResponseDto;
}
