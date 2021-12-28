import { NOTE_SAFE_FILES } from '@/common/constants/upload.const';
import { DatabaseType, EntityTarget } from 'typeorm';
import { dbConnectionConfig, DEFAULT_CONNECTION } from '@/common/constants/database.const';

//! UPLOAD
export type TRequestFiles = Record<string, Array<Express.Multer.File & { publicPath?: string }>> & { constructor: any };
export type TSafeFileError = { message?: Record<string, Array<string>>; path?: string } | typeof NOTE_SAFE_FILES;

//! DATABASE
export type TEntities = EntityTarget<any>[] | string[] | boolean;
export type TDbConnectionConfig = { type: DatabaseType; prefix: string; entities?: TEntities };
export type TDbConnectionsConfig<T = typeof DEFAULT_CONNECTION> = Record<typeof DEFAULT_CONNECTION, TDbConnectionConfig> & Record<string & T, TDbConnectionConfig>;
export type TDbConnectionsType = Record<keyof typeof dbConnectionConfig, DatabaseType>;
