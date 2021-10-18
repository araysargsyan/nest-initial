import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Global()
@Module({
    imports: [MulterModule.register()],
    exports: [MulterModule, UploadService],
    providers: [UploadService],
})
export class UploadModule {}
