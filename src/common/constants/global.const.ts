import { DatabaseType } from 'typeorm';

type DbConnectionsType = Partial<Record<keyof typeof DbPrefixesEnum, DatabaseType>>;

//! DATABASE
//? DbPrefixesEnum as [key: (DatabaseType.toUppercase) | keyof typeof DbConnections] = [value: string as PREFIX)]
export enum DbPrefixesEnum { //* .env db prefixes like DB_
    DEFAULT = 'DB',
    POSTGRES = 'PG',
    MYSQL = 'MYSQL',
}
//? NOT CHANGEABLE
export const DbConnections: DbConnectionsType = Object.keys(DbPrefixesEnum).reduce(
    (accumulator, key) => ((accumulator[key] = key.toLowerCase()), accumulator),
    {} as DbConnectionsType,
);
export const dbDefaultConnection: DatabaseType = DbConnections.POSTGRES;
export const databaseRoot = 'database'; //* src/database
export const DB_CONFIG = 'DB_CONFIG' as const;

//! UPLOAD
export const uploadsCoreDestination = './public/uploads/';
