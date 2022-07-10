import {
    ArrayNotEmpty,
    IsDefined,
    IsEmail,
    IsNotEmpty,
    IsNotEmptyObject,
    isNumber,
    IsOptional,
    IsString,
    Matches,
    ValidateIf,
    ValidateNested,
} from 'class-validator';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Unique, UseUnique } from '@/common/decorators/unique.constraint';
import { UserProviderInterface } from '@/common/interfaces/user-providers.interface';
import { Match } from '@/common/decorators/match.constraint';
import { UserEntity } from '../user.entity';
import { UserProvidersType } from '@/common/types/user-providers.type';
import { TBaseEntityFields } from '@/common/types';

class UserProvider implements UserProviderInterface {
    //* string or number
    @Matches(/^[a-zA-Z0-9_.-]*$/, { message: 'Id must be string or number' })
    @Transform(({ value }) => (isNumber(value) ? value.toString() : value))
    @IsDefined()
    id: UserProviderInterface['id'];

    @ArrayNotEmpty()
    @IsDefined()
    emails: UserProviderInterface['emails'];
}

export class UserProvidersDto implements UserProvidersType {
    //* Optional validate if defined (can,t be null | undefined)
    @ValidateNested()
    @Type(() => UserProvider)
    @IsNotEmptyObject()
    @IsDefined()
    @ValidateIf(({ facebook }) => facebook !== undefined)
    facebook?: UserProvider;

    //* Optional Validate if defined (can,t be null | undefined)
    @ValidateNested()
    @Type(() => UserProvider)
    @IsNotEmptyObject()
    @IsDefined()
    @ValidateIf(({ google }) => google !== undefined)
    google?: UserProvider;
}

class UniquesClass implements Pick<UserEntity, 'email'> {
    @Unique()
    @Expose()
    email: string;
}

@UseUnique(() => UserEntity, UniquesClass)
export class UserCreateDto implements Omit<UserEntity, TBaseEntityFields> {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @Match('password')
    confirmPassword: string;

    //* Validate enums array
    //@IsEnum(AuthEnum, { each: true })
    //@IsArray()
    //providers: AuthEnum[];

    //* Validate if defined (can be null)
    @ValidateNested()
    @Type(() => UserProvidersDto)
    @IsNotEmptyObject()
    @IsOptional()
    providers: UserProvidersDto;
}
