import { ConfigService, registerAs } from '@nestjs/config';
import { ApeEntity } from '../modules/ape/ape.entity';
import { UserEntity } from '../modules/user/user.entity';
import { DB_CONFIG, DbConnections, dbDefaultConnection } from '@common/constants/global.const';
import { OrmConfigService } from '@common/utils/orm-config-service';

const config: ConfigService = new ConfigService();
const ormConfig = new OrmConfigService(config);

//* CONNECTIONS CONFIG
export const dbConnectionsConfig = registerAs(DB_CONFIG, () => ({
    [dbDefaultConnection]: ormConfig.get([UserEntity]),
    [DbConnections.MYSQL]: ormConfig.get([ApeEntity], DbConnections.MYSQL),
}));

//* CONFIG FOR MIGRATIONS AND SEEDS
//! MUST EXPORTED BY DEFAULT
//export default ormConfig.get(config);
export default ormConfig.get([ApeEntity], DbConnections.MYSQL, true);
