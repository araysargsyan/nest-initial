import { UnsupportedMediaTypeException } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterField, MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as _ from 'lodash';
import { extname } from 'path';
import { FileTypesEnum } from '@common/enums/file-types.enum';
import { v4 as uuidv4 } from 'uuid';
import { UploadFolderEnum } from '@common/enums/upload-folder.enum';
import { uploadsCoreDestination } from '@common/constants/global.const';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import * as FileType from 'file-type';

export const MultiFieldUploadInterceptor = (
    uploadFieldsOptions: Array<MulterField & { destination?: string; fileTypes?: FileTypesEnum[] }>,
    globalDestinations?: UploadFolderEnum,
    globalFileTypes?: FileTypesEnum[],
    localOptions?: MulterOptions,
) => {
    const { limits, ...options } = localOptions ? localOptions : { limits: {} };
    const uploadFields: MulterField[] = [];
    const destinations: Record<MulterField['name'], string> = {};
    const fileTypes: Record<MulterField['name'], FileTypesEnum[]> = {};
    for (const uploadFieldOptions of uploadFieldsOptions) {
        uploadFields.push({
            name: uploadFieldOptions.name,
            maxCount: uploadFieldOptions?.maxCount || 1,
        });
        destinations[uploadFieldOptions.name] = uploadFieldOptions.destination;
        fileTypes[uploadFieldOptions.name] = uploadFieldOptions.fileTypes;
    }

    return FileFieldsInterceptor(uploadFields, {
        storage: diskStorage({
            destination: fileDestinationGenerator(globalDestinations || destinations),
            filename: fileNameGenerator,
        }),
        fileFilter: fileTypeValidation(globalFileTypes || fileTypes),
        limits: {
            fileSize: 20000000,
            ...limits,
            files: _.sumBy(uploadFields, 'maxCount'), //! of end
        },
        ...options,
    });
};

export const UploadFileInterceptor = (fieldName: string, fileDestination: UploadFolderEnum, fileTypes: FileTypesEnum[], localOptions?: MulterOptions) => {
    return FileInterceptor(fieldName, {
        storage: diskStorage({
            destination: `${uploadsCoreDestination}${fileDestination}`,
            filename: fileNameGenerator,
        }),
        fileFilter: fileTypeValidation(fileTypes),
        ...localOptions,
    });
};

export const UploadFilesInterceptor = (
    fieldName: string,
    count = 1,
    fileDestination: UploadFolderEnum,
    fileTypes?: FileTypesEnum[],
    localOptions?: MulterOptions,
) => {
    return FilesInterceptor(fieldName, count, {
        storage: diskStorage({
            destination: `${uploadsCoreDestination}${fileDestination}`,
            filename: fileNameGenerator,
        }),
        fileFilter: fileTypeValidation(fileTypes),
        limits: {
            files: count,
            fileSize: 2000000,
        },
        ...localOptions,
    });
};

export const fileNameGenerator = (req: Request, file: Express.Multer.File, cb: (error: Error | null, fileName: string) => void): void =>
    cb(null, `${uuidv4()}${extname(file.originalname)}`);

const fileTypeValidation = (fileTypes: FileTypesEnum[] | Record<string, FileTypesEnum[]>) => {
    if (Array.isArray(fileTypes)) {
        return (req: Request, file: Express.Multer.File, cb: (error: Error | null, valid: boolean) => void): void => {
            const ext: any = extname(file.originalname).slice(1);

            if (fileTypes && !fileTypes.includes(ext)) {
                cb(new UnsupportedMediaTypeException(`Please upload only supported file formats (${fileTypes.toString()})`), false);
            }

            cb(null, true);
        };
    } else if (typeof fileTypes === 'object') {
        return (req: Request, file: Express.Multer.File, cb: (error: Error | null, valid: boolean) => void): void => {
            console.log(file, 'file');
            //isFileExtensionSafe(file);

            const ext: any = extname(file.originalname).slice(1);
            if (!fileTypes[file.fieldname].includes(ext)) {
                cb(
                    new UnsupportedMediaTypeException({ [file.fieldname]: `Please upload only supported file formats (${fileTypes[file.fieldname].toString()})` }),
                    false,
                );
            }
            cb(null, true);
        };
    }
};

const fileDestinationGenerator = (
    destinations: string | Record<MulterField['name'], string>,
): string | ((req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => void) => {
    if (typeof destinations === 'string') {
        return `${uploadsCoreDestination}${destinations}`;
    }

    return (req, file, cb) => {
        const destination = `${uploadsCoreDestination}${destinations[file.fieldname]}`;
        if (!existsSync(destination)) {
            mkdirSync(destination, { recursive: true });
        }
        cb(null, destination);
    };
};

const isFileExtensionSafe = (file: Express.Multer.File) => {
    //console.log(file, 9999);
    let isValid = true;
    const originalExt = '';
    let rejectedFileName = '';
    const ext: string = extname(file.originalname).slice(1);
    //originalExt = (await FileType.fromFile(file.originalname)).ext;

    if (ext !== originalExt) {
        rejectedFileName = file.originalname;
        isValid = false;
    }

    if (!isValid) {
        throw new UnsupportedMediaTypeException(`${rejectedFileName} is broken file.`);
    }
};
