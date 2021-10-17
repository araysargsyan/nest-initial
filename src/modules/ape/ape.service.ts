import { Injectable } from '@nestjs/common';
import { ApeDto } from './ape.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApeEntity } from './ape.entity';
import { DbConsEnum } from '../../config/ormconfig';

@Injectable()
export class ApeService {
    constructor(
        @InjectRepository(ApeEntity, DbConsEnum.MYSQL)
        private repo: Repository<ApeEntity>,
    ) {}

    create(apeDto: ApeDto): any {
        const ape = this.repo.create(apeDto);
        return this.repo.save(ape);
    }
}
