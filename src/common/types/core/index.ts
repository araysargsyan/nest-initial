import { NOTE_SAFE_FILES } from '@/common/constants/upload.const';
import { DatabaseType, EntityTarget } from 'typeorm';
import { DEFAULT_CONNECTION } from '@/common/constants/database.const';
import { dbConfig } from '@/config/db.config';
import { SocialAuthTypeEnum } from '@/common/interfaces/social-auth-type.enum';
import { AuthEnum, SocialAuthEnum } from '@/common/enums/auth.enum';
import { ArgumentMetadata } from '@nestjs/common';
import { ValidatorOptions } from 'class-validator';
import { Request } from 'express';

//! UPLOAD
export type TRequestFiles = Record<string, Array<Express.Multer.File & { publicPath?: string }>> & { constructor: any };
export type TSafeFileError = { message?: Record<string, Array<string>>; path?: string } | typeof NOTE_SAFE_FILES;

//! DATABASE
export type TEntities = EntityTarget<any>[] | string[] | boolean;
export type TDbConnectionConfig = { type: DatabaseType; prefix: string; entities?: TEntities };
export type TDbConnectionsConfig<T = typeof DEFAULT_CONNECTION> = Record<typeof DEFAULT_CONNECTION, TDbConnectionConfig> &
    Record<Uppercase<string & T>, TDbConnectionConfig>;
export type TDbConnectionsType = Record<keyof typeof dbConfig, DatabaseType>;

//! AUTH
export type TSocialAuthType = SocialAuthTypeEnum | null;
export type TSocialStrategy = Lowercase<SocialAuthEnum>;

//! CORE
export type TGlobalValidationMetadata = ArgumentMetadata & { metatype: { validationOptions?: ValidatorOptions /*validateValueOfProperty?: string*/ } };
export type TRequest = Request & { authType: string };
