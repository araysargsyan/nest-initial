import { Injectable, Logger, UnsupportedMediaTypeException } from '@nestjs/common';
import * as fs from 'fs';
import * as FileType from 'file-type';
import { extname } from 'path';
import { TRequestFiles } from '@/common/types';

@Injectable()
export class UploadService {
    public async isFileExtensionSafe(options: Express.Multer.File): Promise<'VALID' | null | Record<string, Array<string>>> {
        const { path, originalname, fieldname } = options;
        const ext = extname(path).slice(1);
        const originalExt = await FileType.fromFile(path)
            .then((data) => data.ext)
            .catch(() => null);

        if (ext !== originalExt) {
            return originalExt !== null ? { [fieldname]: [`${originalname} is broken file.`] } : null;
        }

        return 'VALID';
    }

    public async removeFiles(files: TRequestFiles | Array<Express.Multer.File>): Promise<void> {
        const uploadedFiles = Array.isArray(files) ? files : this.getFilesArray(files);
        uploadedFiles.forEach((file) => {
            file.path &&
                fs.unlink(file.path, (err) => {
                    if (!err) {
                        Logger.verbose(file.path, 'removeFile');
                    } else {
                        Logger.error(err);
                    }
                });
        });
    }

    public remove(filePath: string): void {
        fs.unlink(filePath, (err) => {
            if (!err) {
                Logger.verbose(filePath, 'removeFile');
            } else {
                Logger.error(err);
            }
        });
    }

    private getFilesArray(files: TRequestFiles): Array<Express.Multer.File> {
        const objectValues = (files && Object.values(files)) || [];
        return Array.isArray(objectValues) && objectValues.flat(1);
    }
}
