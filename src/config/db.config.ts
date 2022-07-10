import { TDbConnectionsConfig } from '@/common/types/core';
import { TestEntity } from '@/modules/test/test.entity';
import { UserEntity } from '@/modules/user/user.entity';

export const dbConfig: TDbConnectionsConfig<'second' /* | 'third'*/> = {
    //* key is connection name to lower case
    DEFAULT: {
        type: 'postgres',
        prefix: 'DB',
        entities: true,
    },
    SECOND: {
        type: 'mysql',
        prefix: 'MYSQL',
        entities: [TestEntity, UserEntity],
    },
};
export const dbRoot = 'database'; //* src/database
