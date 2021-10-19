import { ConfigService } from '@nestjs/config';
import { DatabaseType, EntityTarget } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { databaseRoot, DbConnections, dbDefaultConnection, DbPrefixesEnum } from '@common/constants/global.const';
import { OrmSeedInterface } from '@common/interfaces/orm-seed.interface';
import { TablesEnum } from '@common/enums/tables.enum';
import { enumToObject } from '@common/helpers/enum-to-object';

export class OrmConfigService {
    constructor(private readonly config: ConfigService) {}

    public readonly get = (
        entities: EntityTarget<any>[] | string[] = [],
        type: DatabaseType = dbDefaultConnection,
        registerAsDefault = false,
    ): OrmSeedInterface & TypeOrmModuleOptions => {
        let config = {
            name: type === dbDefaultConnection || registerAsDefault ? DbConnections.DEFAULT : type,
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

    private readonly getEnvNamesPrefix = (type: DatabaseType) => {
        const connections = enumToObject<Record<DatabaseType, string>>(DbConnections, true);
        return DbPrefixesEnum[connections[type]];
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
        migrationsTableName: TablesEnum.MIGRATIONS,
        //migrationsRun: true,
        cli: {
            migrationsDir: `src/${databaseRoot}/migrations`,
        },
        seeds: [`src/${databaseRoot}/seeds/**/*{.ts,.js}`],
        factories: [`src/${databaseRoot}/factories/**/*{.ts,.js}`],
    });
}
