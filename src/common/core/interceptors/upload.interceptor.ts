import { UnsupportedMediaTypeException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileTypesEnum } from '../../enums/file-types.enum';
import { v4 as uuidv4 } from 'uuid';
import { UploadFolderEnum } from '@common/enums/upload-folder.enum';

const uploadsCoreDestination = './public/uploads/';

export const UploadFileInterceptor = (fieldName: string, fileDestination: UploadFolderEnum, fileTypes: string | [], localOptions?: MulterOptions) => {
    return FileInterceptor(fieldName, {
        storage: diskStorage({
            destination: `${uploadsCoreDestination}${fileDestination}`,
            filename: fileNameGenerate,
        }),
        fileFilter: fileTypeValidation(fileTypes),
        ...localOptions,
    });
};

export const UploadFilesInterceptor = (fieldName: string, count: number, fileDestination: UploadFolderEnum, fileTypes?: FileTypesEnum[], localOptions?: MulterOptions) => {
    return FilesInterceptor(fieldName, count, {
        storage: diskStorage({
            destination: `${uploadsCoreDestination}${fileDestination}`,
            filename: fileNameGenerate,
        }),
        fileFilter: fileTypeValidation(fileTypes),
        limits: {
            files: count || 3,
            fileSize: 2000000,
        },
        ...localOptions,
    });
};

const fileNameGenerate = (req, file, cb) => cb(null, `${uuidv4()}${extname(file.originalname)}`);

const fileTypeValidation = (fileTypes) => {
    return (req, file, cb) => {
        const ext: any = extname(file.originalname).slice(1);

        if (fileTypes && !fileTypes.includes(ext)) {
            cb(new UnsupportedMediaTypeException(`Please upload only supported file formats (${fileTypes.toString()})`), false);
        }

        cb(null, true);
    };
};
