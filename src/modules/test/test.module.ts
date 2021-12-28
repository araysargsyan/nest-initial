import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestEntity } from './test.entity';
import { TestService } from './test.service';
import { TypeOrmModuleMultiForFeature } from '@/common/utils/type-orm-module.util';
import { dbConnections } from '@/common/constants/database.const';

@Module({
    controllers: [TestController],
    imports: [
        ...TypeOrmModuleMultiForFeature([TestEntity], Object.values(dbConnections)),
        // TypeOrmModule.forFeature([TestEntity], dbConnections.MYSQL),
        // TypeOrmModule.forFeature([TestEntity])
    ],
    providers: [TestService],
})
export class TestModule {}
