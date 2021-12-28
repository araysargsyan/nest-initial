import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as FileType from 'file-type';
import { extname } from 'path';
import { SAFE_FILE } from '@/common/constants/upload.const';
import { TRequestFiles } from '@/common/types/core';

@Injectable()
export class UploadService {
    public async checkFileExtension(options: Express.Multer.File): Promise<typeof SAFE_FILE | null | Record<string, Array<string>>> {
        const { path, originalname, fieldname } = options;
        const ext = extname(path).slice(1);
        const originalExt = await FileType.fromFile(path)
            .then((data) => data?.ext)
            .catch((e) => {
                Logger.error(e);
                return null;
            });

        console.log(3333, fieldname + ' -> ' + String(originalExt));

        if (ext !== originalExt) {
            return originalExt !== null ? { [fieldname]: [`${originalname} is broken file.`] } : null;
        }

        return SAFE_FILE;
    }

    public async checkSafeFiles(files: TRequestFiles) {
        const filesArray = this.getFilesArray(files);
        let error;

        for (const file of filesArray) {
            const result = await this.checkFileExtension(file);

            if (result && result !== SAFE_FILE) {
                error = result;
                break;
            }
        }

        if (error) {
            await this.removeFiles(filesArray);
            return error;
        }
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
