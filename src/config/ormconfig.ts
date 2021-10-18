import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService, registerAs } from '@nestjs/config';
import { DatabaseType, EntityTarget, QueryRunner } from 'typeorm';
import { ApeEntity } from '../modules/ape/ape.entity';
import { UserEntity } from '../modules/user/user.entity';
import { OrmLogger } from '@common/helpers/orm-logger';

interface seedsInterface {
    seeds: string[];
    factories: string[];
}
export enum DbConsEnum {
    DEFAULT = 'default',
    POSTGRES = 'postgres',
    MYSQL = 'mysql',
}
export const DbDefaultConnection: DatabaseType = DbConsEnum.POSTGRES;
const databaseRoot = 'database';

const getDbConfigNamesPrefix = (type: DatabaseType = null) => {
    switch (type) {
        case DbConsEnum.POSTGRES:
            return 'PG';
        case DbConsEnum.MYSQL:
            return 'MYSQL';
        default:
            return 'DB';
    }
};

const config: ConfigService = new ConfigService();
const getBaseConnectionConfig = (config: ConfigService, type: DatabaseType, entities: EntityTarget<any>[] | string[]): TypeOrmModuleOptions => {
    const prefix = getDbConfigNamesPrefix(type); //? if call without type parameter will return default prefix

    return {
        type: config.get<DatabaseType>(`${prefix}_TYPE`, type),

        host: config.get(`${prefix}_HOST`),
        port: config.get<number>(`${prefix}_PORT`),
        username: config.get(`${prefix}_USER`),
        password: config.get(`${prefix}_PASSWORD`),
        database: config.get(`${prefix}_DB`),

        entities,
        //autoLoadEntities: true,
        //entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,

        logging: true,
        logger: new OrmLogger(),
    } as TypeOrmModuleOptions;
};

const getOrmConfig = (configService: ConfigService, entities: EntityTarget<any>[] | string[] = [], type: DatabaseType = DbDefaultConnection, registerAsDefault = false): TypeOrmModuleOptions => {
    let config = {
        name: type === DbDefaultConnection || registerAsDefault ? DbConsEnum.DEFAULT : type,
        ...getBaseConnectionConfig(configService, type, entities),
    } as seedsInterface & TypeOrmModuleOptions;

    if (type === DbDefaultConnection || registerAsDefault) {
        config = {
            ...config,
            migrations: [`${__dirname}/${databaseRoot}/migrations/**/*{.ts,.js}`],
            migrationsTableName: 'migrations_history',
            //migrationsRun: true,
            cli: {
                migrationsDir: `src/${databaseRoot}/migrations`,
            },
            seeds: [`src/${databaseRoot}/seeds/**/*{.ts,.js}`],
            factories: [`src/${databaseRoot}/factories/**/*{.ts,.js}`],
        };
    }
    return config;
};

export const dbConnectionsConfig = registerAs('DB_CONFIG', () => ({
    [DbDefaultConnection]: getOrmConfig(config, [UserEntity]),
    [DbConsEnum.MYSQL]: getOrmConfig(config, [ApeEntity], DbConsEnum.MYSQL),
}));

//export default getOrmConfig(config);
export default getOrmConfig(config, [ApeEntity], DbConsEnum.MYSQL, true);
