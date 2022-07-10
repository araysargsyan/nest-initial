import { ConfigService, registerAs } from '@nestjs/config';
import { OrmConfigService } from '@/common/utils/orm-config-service';
import { TDbConnectionConfig } from '@/common/types/core';
import { DB_CONFIG, dbConnections } from '@/common/constants/database.const';
import { dbConfig } from '@/config/db.config';
import { transform } from 'lodash';

const config: ConfigService = new ConfigService();
const ormConfig = new OrmConfigService(config);

//* CONNECTIONS CONFIG
export const dbConnectionsConfig = registerAs(DB_CONFIG, () =>
    transform(dbConfig, (obj, value: TDbConnectionConfig, key: string) => {
        obj[dbConnections[key]] = ormConfig.get(value.entities ?? [], key);
    }),
);

//* CONFIG FOR MIGRATIONS AND SEEDS
//! MUST EXPORTED BY DEFAULT
export default ormConfig.get();
//export default ormConfig.get([TestEntity], dbConnections.MYSQL, true);
