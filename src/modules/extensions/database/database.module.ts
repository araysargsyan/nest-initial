import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DB_CONFIG, dbConnections, dbDefaultConnection } from '@/common/constants/global.const';

@Module({
    providers: [ConfigService],
    imports: [
        ...Object.values(dbConnections).map((connection) =>
            TypeOrmModule.forRootAsync({
                name: connection,
                imports: [ConfigModule],
                useFactory: (configService: ConfigService): TypeOrmModuleOptions => configService.get(DB_CONFIG)[connection],
                inject: [ConfigService],
            }),
        ),
    ],
})
export class DatabaseModule {}
