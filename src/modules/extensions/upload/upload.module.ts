import { Global, Injectable, Module } from '@nestjs/common';
import { MulterModule, MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { uploadsCoreDestination } from '@common/constants/global.const';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
class MulterConfigService implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        if (!existsSync(uploadsCoreDestination)) {
            mkdirSync(uploadsCoreDestination, { recursive: true });
        }
        return {
            dest: uploadsCoreDestination,
        };
    }
}

@Global()
@Module({
    imports: [
        MulterModule.registerAsync({
            useClass: MulterConfigService,
        }),
    ],
    exports: [MulterModule, UploadService],
    providers: [UploadService],
})
export class UploadModule {}
