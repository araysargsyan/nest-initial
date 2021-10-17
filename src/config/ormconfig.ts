import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService, registerAs } from '@nestjs/config';
import { Logger as LoggerI } from 'typeorm/logger/Logger';
import { DatabaseType, EntityTarget, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ApeEntity } from '../modules/ape/ape.entity';
import { UserEntity } from '../modules/user/user.entity';

export enum DbConsEnum {
    DEFAULT = 'default',
    POSTGRES = 'postgres',
    MYSQL = 'mysql',
}
export const DbDefaultConnection: DatabaseType = DbConsEnum.POSTGRES;

class CustomLogger implements LoggerI {
    /**
     * Logs query and parameters used in it.
     */
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        Logger.verbose(query, 'QUERY');
        Logger.debug(parameters, 'PARAMETERS');
    }
    /**
     * Logs query that is failed.
     */
    logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        //Logger.error(error, 'DataBaseError')
    }
    /**
     * Logs query that is slow.
     */
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        //Logger.debug()
    }
    /**
     * Logs events from the schema build process.
     */
    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        //Logger.debug()
    }
    /**
     * Logs events from the migrations run process.
     */
    logMigration(message: string, queryRunner?: QueryRunner): any {
        //Logger.debug()
    }
    /**
     * Perform logging using given logger, or by default to the console.
     * Log has its own level and message.
     */
    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
        //Logger.debug(queryRunner, 'message')
    }
}

const getDbConfigNamesPrefix = (type: DatabaseType) => {
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
const getBaseConnectionConfig = (config: ConfigService, prefix: string, type: DatabaseType, entities: EntityTarget<any>[]): TypeOrmModuleOptions =>
    ({
        host: config.get(`${prefix}_HOST`),
        port: config.get<number>(`${prefix}_PORT`),
        username: config.get(`${prefix}_USER`),
        password: config.get(`${prefix}_PASSWORD`),
        database: config.get(`${prefix}_DB`),

        entities,
        //autoLoadEntities: true,
        //entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,

        // logging: true,
        // logger: new CustomLogger(),
    } as TypeOrmModuleOptions);

const getOrmConfig = (config: ConfigService, entities: EntityTarget<any>[] = [], type: DatabaseType = DbDefaultConnection): TypeOrmModuleOptions => {
    const prefix = getDbConfigNamesPrefix(type);
    let conf = {
        name: type === DbDefaultConnection ? DbConsEnum.DEFAULT : type,
        type: config.get<DatabaseType>(`${prefix}_TYPE`, type),
        ...getBaseConnectionConfig(config, prefix, type, entities),
    } as TypeOrmModuleOptions;

    if (type === DbDefaultConnection) {
        conf = {
            ...conf,
            migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
            migrationsTableName: 'migrations_history',
            //migrationsRun: true,
            cli: {
                migrationsDir: 'src/migrations',
            },
        };
    }
    //console.log(entities);
    return conf;
};

export const dbConnectionsConfig = registerAs('DB_CONFIG', () => ({
    [DbDefaultConnection]: getOrmConfig(config, [UserEntity]),
    [DbConsEnum.MYSQL]: getOrmConfig(config, [ApeEntity], DbConsEnum.MYSQL),
}));

export default getOrmConfig(config);
