import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class SingInDto {
    @Transform(({ value }) => value.toLowerCase())
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
