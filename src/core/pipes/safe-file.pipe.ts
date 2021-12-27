import { ArgumentMetadata, Injectable, PipeTransform, Logger } from '@nestjs/common';
import { UploadService } from '@/modules/extensions/upload/upload.service';
import { plainToClass } from 'class-transformer';
import { TRequestFiles } from '@/common/types';

@Injectable()
export class SafeFilePipe implements PipeTransform {
    constructor(private uploadService: UploadService) {}

    async transform(files: TRequestFiles, metadata: ArgumentMetadata): Promise<TRequestFiles> {
        Logger.debug('', 'SafeFilePipe');
        //await this.uploadService.isFileExtensionSafe(files);

        return plainToClass(metadata.metatype, files) || null;
    }
}
