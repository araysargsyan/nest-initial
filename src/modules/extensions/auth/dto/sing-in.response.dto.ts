import { Type } from 'class-transformer';
import { UserResponseDto } from '@/modules/user/dto/user.response.dto';

export class SingInResponseDto {
    accessToken: string;

    @Type(() => UserResponseDto)
    user: UserResponseDto;
}
