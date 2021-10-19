import { Injectable } from '@nestjs/common';
import { ApeDto } from './ape.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApeEntity } from './ape.entity';
import { DbConnections } from '@common/constants/global.const';

@Injectable()
export class ApeService {
    constructor(
        @InjectRepository(ApeEntity, DbConnections.MYSQL)
        private repo: Repository<ApeEntity>,
    ) {}

    create(apeDto: ApeDto): any {
        const ape = this.repo.create(apeDto);
        return this.repo.save(ape);
    }
}
