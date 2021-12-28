import { ConfigService, registerAs } from '@nestjs/config';
import * as _ from 'lodash';
import { OrmConfigService } from '@/common/utils/orm-config-service';
import { TDbConnectionConfig } from '@/common/types/core';
import { DB_CONFIG, dbConnectionConfig, dbConnections } from '@/common/constants/database.const';

const config: ConfigService = new ConfigService();
const ormConfig = new OrmConfigService(config);

//* CONNECTIONS CONFIG
export const dbConnectionsConfig = registerAs(DB_CONFIG, () =>
    _.transform(dbConnectionConfig, (newObject, value: TDbConnectionConfig, key: string) => {
        newObject[dbConnections[key]] = ormConfig.get(value.entities ?? [], key);
    }),
);

//* CONFIG FOR MIGRATIONS AND SEEDS
//! MUST EXPORTED BY DEFAULT
export default ormConfig.get();
//export default ormConfig.get([TestEntity], dbConnections.MYSQL, true);
