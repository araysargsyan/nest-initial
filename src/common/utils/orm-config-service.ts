import { ConfigService } from '@nestjs/config';
import { DatabaseType } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TablesEnum } from '@/common/enums/tables.enum';
import { isBoolean, isString } from 'class-validator';
import { dbConnections, DEFAULT_CONNECTION, DB_DB, DB_HOST, DB_PASSWORD, DB_PORT, DB_TYPE, DB_USER } from '@/common/constants/database.const';
import { OrmSeedInterface } from '@/common/interfaces/core';
import { TEntities } from '@/common/types/core';
import { Injectable } from '@nestjs/common';
import { dbRoot, dbConfig } from '@/config/db.config';

@Injectable()
export class OrmConfigService {
    private databaseType: DatabaseType;
    private readonly dbDefaultConnectionType = dbConfig.DEFAULT.type;

    constructor(private readonly config: ConfigService) {}

    public readonly get = (entities: TEntities = null, key: string = DEFAULT_CONNECTION, registerAsDefault = false): OrmSeedInterface & TypeOrmModuleOptions => {
        this.databaseType = key === DEFAULT_CONNECTION ? this.dbDefaultConnectionType : dbConfig[key].type;
        const setupMigrationsAndSeeds = entities === null;

        let config = {
            name: dbConnections[key],
            ...this.getBaseConnectionConfig(key, setupMigrationsAndSeeds ? [] : entities),
        } as OrmSeedInterface & TypeOrmModuleOptions;

        if ((this.databaseType === this.dbDefaultConnectionType && setupMigrationsAndSeeds) || registerAsDefault) {
            config = {
                ...config,
                ...this.getMigrationsAndSeedsConfig(),
            };
        }

        return config;
    };

    private getEnvNamesPrefix = (key: string) => {
        return dbConfig[key].prefix;
    };

    private getBaseConnectionConfig = (key: string, entities: TEntities): TypeOrmModuleOptions => {
        const prefix = this.getEnvNamesPrefix(key);

        const baseConfig = {
            type: this.config.get<string>(`${prefix}${DB_TYPE}`, this.databaseType),

            host: this.config.get(`${prefix}${DB_HOST}`),
            port: this.config.get<number>(`${prefix}${DB_PORT}`),
            username: this.config.get(`${prefix}${DB_USER}`),
            password: this.config.get(`${prefix}${DB_PASSWORD}`),
            database: this.config.get(`${prefix}${DB_DB}`),

            entities: isBoolean(entities) && entities ? [] : isString(entities) ? [entities] : entities, //? entities<string>: 'dist/**/*.entity{.ts,.js}',
            autoLoadEntities: isBoolean(entities) && entities,

            synchronize: true,

            // logging: true,
            // logger: new OrmLogger(),
        } as TypeOrmModuleOptions;

        return baseConfig;
    };

    private getMigrationsAndSeedsConfig = () => ({
        migrations: [`${__dirname}/${dbRoot}/migrations/**/*{.ts,.js}`],
        migrationsTableName: TablesEnum.MIGRATIONS,
        //migrationsRun: true,
        cli: {
            migrationsDir: `src/${dbRoot}/migrations`,
        },
        seeds: [`src/${dbRoot}/seeds/**/*{.ts,.js}`],
        factories: [`src/${dbRoot}/factories/**/*{.ts,.js}`],
    });
}
