import { DatabaseType } from 'typeorm';
import { TestEntity } from '@/modules/test/test.entity';
import { UserEntity } from '@/modules/user/user.entity';
import { TDbConnectionsConfig } from '@/common/types';
import { getDbConnections } from '@/common/helpers/get-db-connections';

//! DATABASE
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
export const dbConnections = getDbConnections(dbConnectionConfig); //* NOT CHANGEABLE
export const dbDefaultConnection: DatabaseType = dbConnectionConfig.DEFAULT.type;
export const databaseRoot = 'database' as const; //* src/database
export const DB_CONFIG = 'DB_CONFIG' as const;

//! UPLOAD
export const PUBLIC_FOLDER = 'PUBLIC_FOLDER' as const;
export const uploadsFolder = 'uploads' as const;
