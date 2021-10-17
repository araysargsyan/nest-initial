import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { Global, Module, OnModuleInit } from '@nestjs/common';
import { MulterConfigService } from './upload.service';
import { DbConnectionModule } from './db.module';
import { UserModule } from './modules/user/user.module';
import { ModulesContainer } from '@nestjs/core';

@Global()
@Module({
    imports: [
        MulterModule.register(),
        // MulterModule.register({
        //     dest: './upload',
        // })
    ],
    providers: [MulterConfigService],
    exports: [MulterModule, MulterConfigService],
})
export class UploadModule {}
