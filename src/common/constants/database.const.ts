import { TestEntity } from '@/modules/test/test.entity';
import { UserEntity } from '@/modules/user/user.entity';
import { getDbConnections } from '@/common/helpers/get-db-connections';
import { TDbConnectionsConfig } from '@/common/types/core';

export const dbConnectionConfig: TDbConnectionsConfig<'MYSQL' /* | 'POSTGRES'*/> = {
    //* key is connection name to lower case
    DEFAULT: {
        type: 'postgres',
        prefix: 'DB',
        entities: true,
    },
    MYSQL: {
        type: 'mysql',
        prefix: 'MYSQL',
        entities: [TestEntity, UserEntity],
    },
};
export const databaseRoot = 'database'; //* src/database

//! CORE
export const DEFAULT_CONNECTION = 'DEFAULT' as const;
export const DB_CONFIG = 'DB_CONFIG' as const;

//! NOT CHANGEABLE
export const dbConnections = getDbConnections(dbConnectionConfig);

//! ENV
export const DB_TYPE = '_TYPE' as const;
export const DB_HOST = '_HOST' as const;
export const DB_PORT = '_PORT' as const;
export const DB_USER = '_USER' as const;
export const DB_PASSWORD = '_PASSWORD' as const;
export const DB_DB = '_DB' as const;
