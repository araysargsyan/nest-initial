import { DatabaseType, EntityTarget } from 'typeorm';
import { dbConnectionConfig } from '@/common/constants/global.const';

export type TRequestFiles = Record<string, Array<Express.Multer.File>>;
export type TEntities = EntityTarget<any>[] | string[] | boolean;
export type TDbConnectionConfig = { type: DatabaseType; prefix: string; entities?: TEntities };
export type TDbConnectionsConfig<T = 'DEFAULT'> = Record<'DEFAULT', TDbConnectionConfig> & Record<string & T, TDbConnectionConfig>;
export type TDbConnectionsType = Record<keyof typeof dbConnectionConfig, DatabaseType>;
