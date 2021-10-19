import { DynamicModule, Global, Module, Param } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { DB_CONFIG, DbConnections, dbDefaultConnection } from '@common/constants/global.const';

@Module({
    providers: [ConfigService],
    imports: [
        TypeOrmModule.forRootAsync({
            name: DbConnections.DEFAULT, //? not required
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): TypeOrmModuleOptions => configService.get(DB_CONFIG)[dbDefaultConnection],
            inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
            name: DbConnections.MYSQL,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): MysqlConnectionOptions => configService.get(DB_CONFIG)[DbConnections.MYSQL],
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
