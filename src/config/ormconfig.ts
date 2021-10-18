import { ConfigService, registerAs } from '@nestjs/config';
import { ApeEntity } from '../modules/ape/ape.entity';
import { UserEntity } from '../modules/user/user.entity';
import { dbDefaultConnection } from '@common/constants/global.const';
import { DbConnectionsEnum } from '@common/enums/db-connections.enum';
import { OrmConfigService } from '@common/utils/orm-config-service';

const config: ConfigService = new ConfigService();
const ormConfig = new OrmConfigService(config);

//* ADD CONNECTIONS
export const dbConnectionsConfig = registerAs('DB_CONFIG', () => ({
    [dbDefaultConnection]: ormConfig.get([UserEntity]),
    [DbConnectionsEnum.MYSQL]: ormConfig.get([ApeEntity], DbConnectionsEnum.MYSQL),
}));

//* CONFIG FOR MIGRATIONS AND SEEDS
//export default ormConfig.get(config);
export default ormConfig.get([ApeEntity], DbConnectionsEnum.MYSQL, true);
