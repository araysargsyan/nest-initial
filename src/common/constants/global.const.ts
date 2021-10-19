import { DatabaseType } from 'typeorm';

type DbConnectionsType = Partial<Record<keyof typeof DbPrefixesEnum, DatabaseType>>;

//* DATABASE
export enum DbPrefixesEnum { //* env db prefixes
    DEFAULT = 'DB', //* [(DatabaseType.toUppercase) | keyof typeof DbConnections] = [string(PREFIXES)]
    POSTGRES = 'PG',
    MYSQL = 'MYSQL',
}
export const DbConnections: DbConnectionsType = Object.keys(DbPrefixesEnum).reduce((ac, key) => ((ac[key] = key.toLowerCase()), ac), {}); //! NOT CHANGEABLE
export const dbDefaultConnection: DatabaseType = DbConnections.POSTGRES;
export const databaseRoot = 'database'; //* src/database
export const DB_CONFIG = 'DB_CONFIG' as const;

export const uploadsCoreDestination = './public/uploads/';
