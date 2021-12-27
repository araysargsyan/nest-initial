import { Global, Injectable, Module } from '@nestjs/common';
import { MulterModule, MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { existsSync, mkdirSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { PUBLIC_FOLDER, uploadsFolder } from '@/common/constants/global.const';

@Injectable()
class MulterConfigService implements MulterOptionsFactory {
    uploadsCoreDestination = '';

    constructor(private configService: ConfigService) {
        this.uploadsCoreDestination = `${configService.get(PUBLIC_FOLDER, 'public')}\\${uploadsFolder}`;
    }

    createMulterOptions(): MulterModuleOptions {
        if (!existsSync(this.uploadsCoreDestination)) {
            mkdirSync(this.uploadsCoreDestination, { recursive: true });
        }
        return {
            dest: this.uploadsCoreDestination,
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
    providers: [UploadService],
    exports: [MulterModule, UploadService],
})
export class UploadModule {}
