import { Module } from '@nestjs/common';
import { ApesController } from './ape.controller';
import { getConnectionToken, TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ApeEntity } from './ape.entity';
import { ApeService } from './ape.service';
import { DbConsEnum } from '../../config/ormconfig';

// console.log(111111111111111, ApeEntity);
// console.log('myau', TypeOrmModule.forFeature([ApeEntity],  'mysql').providers[0]);

@Module({
    controllers: [ApesController],
    imports: [TypeOrmModule.forFeature([ApeEntity], DbConsEnum.MYSQL)],
    providers: [ApeService],
})
export class ApeModule {}
