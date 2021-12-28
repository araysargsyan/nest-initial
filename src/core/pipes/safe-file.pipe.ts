import { ArgumentMetadata, Injectable, PipeTransform, Logger, UnsupportedMediaTypeException } from '@nestjs/common';
import { UploadService } from '@/modules/extensions/upload/upload.service';
import { plainToClass } from 'class-transformer';
import { safeFileCheckingMode } from '@/common/constants/upload.const';
import { SafeFileCheckingModeEnum } from '@/common/enums/safe-file-checking-mode.enum';
import { TRequestFiles } from '@/common/types/core';

@Injectable()
export class SafeFilePipe implements PipeTransform {
    constructor(private uploadService: UploadService) {}

    async transform(files: TRequestFiles, metadata: ArgumentMetadata): Promise<TRequestFiles> {
        Logger.debug('', 'SafeFilePipe');

        if (safeFileCheckingMode === SafeFileCheckingModeEnum.ON_SAFE_FILE_PIPE) {
            const error = await this.uploadService.checkSafeFiles(files);
            if (error) throw new UnsupportedMediaTypeException(error);
        }

        return plainToClass(metadata.metatype, files) || null;
    }
}
