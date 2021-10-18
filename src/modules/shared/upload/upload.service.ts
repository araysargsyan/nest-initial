import { Injectable, InternalServerErrorException, Logger, UnsupportedMediaTypeException } from '@nestjs/common';
import * as fs from 'fs';
import * as FileType from 'file-type';
import { extname } from 'path';

@Injectable()
export class UploadService {
    deleteFile(file: string | Array<string | { path: string }>) {
        if (typeof file === 'string') {
            fs.unlink(file, (err) => {
                if (err) throw new InternalServerErrorException(err);
            });
        } else if (file.length && typeof file[0] === 'string') {
            file.forEach((filePath: string) => {
                fs.unlink(filePath, (err) => {
                    if (err) throw new InternalServerErrorException(err);
                });
            });
        } else {
            file.forEach((fileObj: { path: string }) => {
                fs.unlink(fileObj.path, (err) => {
                    if (err) Logger.error(err);
                });
            });
        }
    }

    async isFileExtensionSafe(files: Array<{ path: string; originalname: string }>) {
        let isValid = true;
        let originalExt = '';
        let rejectedFileName = '';

        for (let i = 0; i < files.length; i++) {
            const fileObj = files[i];
            const ext: string = extname(fileObj.path).slice(1);
            originalExt = (await FileType.fromFile(fileObj.path)).ext;

            if (ext !== originalExt) {
                rejectedFileName = fileObj.originalname;
                isValid = false;
                break;
            }
        }

        if (!isValid) {
            this.deleteFile(files);
            throw new UnsupportedMediaTypeException(`${rejectedFileName} is broken file.`);
        }
    }
}
