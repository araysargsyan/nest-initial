import { Module } from '@nestjs/common';
import { ApesController } from './ape.controller';
import { getConnectionToken, TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ApeEntity } from './ape.entity';
import { ApeService } from './ape.service';
import { DbConnections } from '@common/constants/global.const';

@Module({
    controllers: [ApesController],
    imports: [TypeOrmModule.forFeature([ApeEntity], DbConnections.MYSQL)],
    providers: [ApeService],
})
export class ApeModule {}
