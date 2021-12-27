import { ConfigService } from '@nestjs/config';
import { DatabaseType } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseRoot, dbConnectionConfig, dbConnections, dbDefaultConnection } from '@/common/constants/global.const';
import { OrmSeedInterface } from '@/common/interfaces/orm-seed.interface';
import { TablesEnum } from '@/common/enums/tables.enum';
import { isBoolean, isString } from 'class-validator';
import { TEntities } from '@/common/types';

export class OrmConfigService {
    private databaseType: DatabaseType;
    constructor(private readonly config: ConfigService) {}

    public readonly get = (entities: TEntities = null, key = 'DEFAULT', registerAsDefault = false): OrmSeedInterface & TypeOrmModuleOptions => {
        this.databaseType = key === 'DEFAULT' ? dbDefaultConnection : dbConnectionConfig[key].type;
        const setupMigrationsAndSeeds = entities === null;

        let config = {
            name: dbConnections[key],
            ...this.getBaseConnectionConfig(key, setupMigrationsAndSeeds ? [] : entities),
        } as OrmSeedInterface & TypeOrmModuleOptions;

        if ((this.databaseType === dbDefaultConnection && setupMigrationsAndSeeds) || registerAsDefault) {
            config = {
                ...config,
                ...this.getMigrationsAndSeedsConfig(),
            };
        }

        return config;
    };

    private readonly getEnvNamesPrefix = (key: string) => {
        return dbConnectionConfig[key].prefix;
    };

    private readonly getBaseConnectionConfig = (key: string, entities: TEntities): TypeOrmModuleOptions => {
        const prefix = this.getEnvNamesPrefix(key);

        const baseConfig = {
            type: this.config.get<string>(`${prefix}_TYPE`, this.databaseType),

            host: this.config.get(`${prefix}_HOST`),
            port: this.config.get<number>(`${prefix}_PORT`),
            username: this.config.get(`${prefix}_USER`),
            password: this.config.get(`${prefix}_PASSWORD`),
            database: this.config.get(`${prefix}_DB`),

            entities: isBoolean(entities) && entities ? [] : isString(entities) ? [entities] : entities, //entities<string>: 'dist/**/*.entity{.ts,.js}',
            autoLoadEntities: isBoolean(entities) && entities,

            synchronize: true,

            // logging: true,
            // logger: new OrmLogger(),
        } as TypeOrmModuleOptions;

        return baseConfig;
    };

    private readonly getMigrationsAndSeedsConfig = () => ({
        migrations: [`${__dirname}/${databaseRoot}/migrations/**/*{.ts,.js}`],
        migrationsTableName: TablesEnum.MIGRATIONS,
        //migrationsRun: true,
        cli: {
            migrationsDir: `src/${databaseRoot}/migrations`,
        },
        seeds: [`src/${databaseRoot}/seeds/**/*{.ts,.js}`],
        factories: [`src/${databaseRoot}/factories/**/*{.ts,.js}`],
    });
}
