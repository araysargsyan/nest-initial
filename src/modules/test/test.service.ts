import { Injectable } from '@nestjs/common';
import { TestDto } from './dto/test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from './test.entity';
import { dbConnections } from '@/common/constants/global.const';
import { UserEntity } from '@/modules/user/user.entity';

@Injectable()
export class TestService {
    constructor(
        @InjectRepository(TestEntity, dbConnections.MYSQL)
        @InjectRepository(TestEntity, dbConnections.DEFAULT)
        private repo: Repository<TestEntity & UserEntity>,
    ) {}

    create(apeDto: TestDto): any {
        const ape = this.repo.create(apeDto);
        return this.repo.save(ape);
    }
}
