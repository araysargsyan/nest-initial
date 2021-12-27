import { IsDefined, IsEmail, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, Matches, ValidateIf, ValidateNested } from 'class-validator';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { Unique, UseUnique } from '@/common/decorators/unique.constraint';
import { UserProviderInterface, UserProvidersType } from '@/common/interfaces/user-providers.interface';
import { TablesEnum } from '@/common/enums/tables.enum';
import { EntityTarget } from 'typeorm';
import { Match } from '@/common/decorators/match.constraint';
import { UserEntity } from '../user.entity';

class UserProvider implements UserProviderInterface {
    //* string or number
    @Matches(/^[a-zA-Z0-9_.-]*$/, { message: 'providerId must be string or number' })
    @Transform(({ value }) => (typeof value === 'number' ? value.toString() : value))
    @IsDefined()
    providerId: string | number;
}

export class UserProvidersDto implements UserProvidersType {
    //* Optional validate if defined (can,t be null | undefined)
    @ValidateNested()
    @Type(() => UserProvider)
    @IsNotEmptyObject()
    @IsDefined()
    @ValidateIf(({ facebook }) => facebook !== undefined)
    facebook: UserProvider;

    //* Optional Validate if defined (can,t be null | undefined)
    @ValidateNested()
    @Type(() => UserProvider)
    @IsNotEmptyObject()
    @IsDefined()
    @ValidateIf(({ google }) => google !== undefined)
    google: UserProvider;
}

@UseUnique
export class CreateUserDtoClean implements Partial<UserEntity> {
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

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

@Exclude() //? only uniques
export class CreateUserDto extends CreateUserDtoClean {
    static table: TablesEnum | EntityTarget<any> = TablesEnum.USERS; //? tableName | entity

    @Expose()
    @Unique()
    email: string;

    // @Expose()
    // @Unique()
    // password: string;
}
