import { Module } from '@nestjs/common';
import { ApesController } from './ape.controller';
import { getConnectionToken, TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ApeEntity } from './ape.entity';
import { ApeService } from './ape.service';
import { DbConnectionsEnum } from '@common/enums/db-connections.enum';

@Module({
    controllers: [ApesController],
    imports: [TypeOrmModule.forFeature([ApeEntity], DbConnectionsEnum.MYSQL)],
    providers: [ApeService],
})
export class ApeModule {}
