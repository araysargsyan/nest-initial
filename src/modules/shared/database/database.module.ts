import { DynamicModule, Global, Module, Param } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { dbDefaultConnection } from '@common/constants/global.const';
import { DbConnectionsEnum } from '@common/enums/db-connections.enum';

@Module({
    providers: [ConfigService],
    imports: [
        TypeOrmModule.forRootAsync({
            name: DbConnectionsEnum.DEFAULT, //? not required
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): TypeOrmModuleOptions => configService.get('DB_CONFIG')[dbDefaultConnection],
            inject: [ConfigService],
        }),
        TypeOrmModule.forRootAsync({
            name: DbConnectionsEnum.MYSQL,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): MysqlConnectionOptions => configService.get('DB_CONFIG')[DbConnectionsEnum.MYSQL],
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
