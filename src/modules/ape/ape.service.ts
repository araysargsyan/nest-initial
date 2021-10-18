import { Injectable } from '@nestjs/common';
import { ApeDto } from './ape.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApeEntity } from './ape.entity';
import { DbConnectionsEnum } from '@common/enums/db-connections.enum';

@Injectable()
export class ApeService {
    constructor(
        @InjectRepository(ApeEntity, DbConnectionsEnum.MYSQL)
        private repo: Repository<ApeEntity>,
    ) {}

    create(apeDto: ApeDto): any {
        const ape = this.repo.create(apeDto);
        return this.repo.save(ape);
    }
}
