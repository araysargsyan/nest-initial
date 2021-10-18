import { DynamicModule, Global, Module, Param } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbConsEnum, DbDefaultConnection } from '../config/ormconfig';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Module({
    providers: [ConfigService],
    imports: [
        TypeOrmModule.forRootAsync({
            name: DbConsEnum.DEFAULT,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): TypeOrmModuleOptions => configService.get('DB_CONFIG')[DbDefaultConnection],
            inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
            name: DbConsEnum.MYSQL,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): MysqlConnectionOptions => configService.get('DB_CONFIG')[DbConsEnum.MYSQL],
            inject: [ConfigService],
        }),
    ],
})
export class DbConnectionModule {}
