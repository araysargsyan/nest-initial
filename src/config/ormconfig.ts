import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService, registerAs } from '@nestjs/config';
import { DatabaseType, EntityTarget, QueryRunner } from 'typeorm';
import { ApeEntity } from '../modules/ape/ape.entity';
import { UserEntity } from '../modules/user/user.entity';
import { OrmLogger } from '@common/helpers/orm-logger';
import { databaseRoot, dbDefaultConnection } from '@common/constants/global.const';
import { DbConnectionsEnum } from '@common/enums/db-connections.enum';
import { OrmSeedInterface } from '@common/interfaces/orm-seed.interface';

class OrmConfigService {
    constructor(private readonly config: ConfigService) {}

    private readonly getEnvNamesPrefix = (type: DatabaseType = null) => {
        switch (type) {
            case DbConnectionsEnum.POSTGRES:
                return 'PG';
            case DbConnectionsEnum.MYSQL:
                return 'MYSQL';
            default:
                return 'DB';
        }
    };

    private readonly getBaseConnectionConfig = (type: DatabaseType, entities: EntityTarget<any>[] | string[]): TypeOrmModuleOptions => {
        const prefix = this.getEnvNamesPrefix(type); //? if call without type parameter will return default prefix

        return {
            type: this.config.get<DatabaseType>(`${prefix}_TYPE`, type),

            host: this.config.get(`${prefix}_HOST`),
            port: this.config.get<number>(`${prefix}_PORT`),
            username: this.config.get(`${prefix}_USER`),
            password: this.config.get(`${prefix}_PASSWORD`),
            database: this.config.get(`${prefix}_DB`),

            entities,
            //autoLoadEntities: true,
            //entities: ['dist/**/*.entity{.ts,.js}'],
            synchronize: true,

            // logging: true,
            // logger: new OrmLogger(),
        } as TypeOrmModuleOptions;
    };

    private readonly getMigrationsAndSeedsConfig = () => ({
        migrations: [`${__dirname}/${databaseRoot}/migrations/**/*{.ts,.js}`],
        migrationsTableName: 'migrations_history',
        //migrationsRun: true,
        cli: {
            migrationsDir: `src/${databaseRoot}/migrations`,
        },
        seeds: [`src/${databaseRoot}/seeds/**/*{.ts,.js}`],
        factories: [`src/${databaseRoot}/factories/**/*{.ts,.js}`],
    });

    public readonly get = (entities: EntityTarget<any>[] | string[] = [], type: DatabaseType = dbDefaultConnection, registerAsDefault = false): OrmSeedInterface & TypeOrmModuleOptions => {
        let config = {
            name: type === dbDefaultConnection || registerAsDefault ? DbConnectionsEnum.DEFAULT : type,
            ...this.getBaseConnectionConfig(type, entities),
        } as OrmSeedInterface & TypeOrmModuleOptions;

        if (type === dbDefaultConnection || registerAsDefault) {
            config = {
                ...config,
                ...this.getMigrationsAndSeedsConfig(),
            };
        }
        return config;
    };
}
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
