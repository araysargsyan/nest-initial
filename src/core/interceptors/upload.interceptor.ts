import { CallHandler, ExecutionContext, Inject, Logger, mixin, NestInterceptor, Type, UnsupportedMediaTypeException } from '@nestjs/common';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterField, MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as _ from 'lodash';
import { extname } from 'path';
import { FileTypesEnum } from '@/common/enums/file-types.enum';
import { v4 as uuidv4 } from 'uuid';
import { UploadFolderEnum } from '@/common/enums/upload-folder.enum';
import { PUBLIC_FOLDER, uploadsFolder } from '@/common/constants/global.const';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { UploadService } from '@/modules/extensions/upload/upload.service';
import { fileOption } from '@/common/interfaces/file-option';

export function UploadFilesInterceptor(
    fields: fileOption | fileOption[],
    globalDestinations?: UploadFolderEnum,
    globalFileTypes?: FileTypesEnum[],
    localOptions?: MulterOptions,
): Type<NestInterceptor> {
    class MixinInterceptor implements NestInterceptor {
        private readonly nestedKeyRegex: RegExp = /\[([^\]]+)]/g;
        private uncheckedFiles = [];
        private destinations = {};
        private safeFileError: { message?: Record<string, Array<string>>; path?: string } | 'NOT_VALID' = {};
        uploadsCoreDestination = '';

        constructor(@Inject(ConfigService) private configService: ConfigService, @Inject(UploadService) private uploadService: UploadService) {
            this.uploadsCoreDestination = `${configService.get(PUBLIC_FOLDER, 'public')}\\${uploadsFolder}`;
        }

        async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
            this.uncheckedFiles = [];
            this.destinations = {};
            this.safeFileError = {};
            Logger.debug(JSON.stringify(this.uncheckedFiles), 'UploadFilesInterceptor');
            const ctx = context.switchToHttp();
            const isMultiField = Array.isArray(fields);
            const maxCountsByFieldName = this.getMaxCountsByFieldName(fields);
            let newFields = fields;

            if (isMultiField) {
                newFields = fields.map((field) => this.createNestedFilesObject(field)).flat(1);
            } else if (fields.name.includes('[]')) {
                newFields = this.createNestedFilesObject(fields);
            }
            //console.log({ maxCountsByFieldName });

            let selectedInterceptor;
            if (isMultiField && Array.isArray(newFields) && newFields.length > 1) {
                selectedInterceptor = await this.uploadMultiFieldFiles(newFields, globalDestinations, globalFileTypes, localOptions);
            } else {
                selectedInterceptor = this.uploadFiles(newFields?.[0] || newFields);
            }

            //! Initialize request.files
            await new selectedInterceptor().intercept(context, next);
            console.log('Initialize request.files');

            if (this.uncheckedFiles.length) {
                if (!this.safeFileError.message) {
                    for (const uncheckedFile of this.uncheckedFiles) {
                        const error = await this.uploadService.isFileExtensionSafe(uncheckedFile);
                        if (error && error !== 'VALID') {
                            this.safeFileError = { message: error };
                            break;
                        }
                    }
                } else {
                    this.uploadService.remove(this.safeFileError.path);
                }
            }
            if (this.safeFileError.message) {
                await this.uploadService.removeFiles(this.uncheckedFiles);
                throw new UnsupportedMediaTypeException(this.safeFileError.message);
            }

            this.destructureRequestFiles(ctx, isMultiField && Array.isArray(newFields) && newFields.length > 1);

            const request = ctx.getRequest();
            //console.log(request.files, 'request.files');
            this.margeFilesIntoBody(request.files, request.body, maxCountsByFieldName);

            return next.handle();
        }

        private uploadMultiFieldFiles(
            uploadFieldsOptions: Array<MulterField & { destination?: string; types?: FileTypesEnum[] }>,
            globalDestinations?: UploadFolderEnum,
            globalFileTypes?: FileTypesEnum[],
            localOptions?: MulterOptions,
        ) {
            console.log('uploadMultiFieldFiles');
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
                fileTypes[uploadFieldOptions.name] = uploadFieldOptions.types;
            }

            return FileFieldsInterceptor(uploadFields, {
                storage: diskStorage({
                    destination: this.fileDestinationGenerator(globalDestinations || destinations),
                    filename: this.fileNameGenerator,
                }),
                fileFilter: this.fileTypeValidation(globalFileTypes || fileTypes),
                limits: {
                    fileSize: 2000088800,
                    ...limits,
                    files: _.sumBy(uploadFields, 'maxCount'), //! of end
                },
                ...options,
            });
        }

        private uploadFiles(options) {
            const { name, maxCount = 1, destination, types, localOptions } = options;

            return FilesInterceptor(name, maxCount, {
                storage: diskStorage({
                    destination: `${this.uploadsCoreDestination}\\${destination}`,
                    filename: this.fileNameGenerator,
                }),
                fileFilter: this.fileTypeValidation(types),
                limits: {
                    files: maxCount,
                    fileSize: 2000000,
                },
                ...localOptions,
            });
        }

        private fileNameGenerator = async (req: Request, file: Express.Multer.File, cb: (error: Error | null, fileName: string) => void): Promise<void> => {
            console.log('fileNameGenerator', file.fieldname + ' -> ' + file.originalname);
            //console.log( { file, previousCheckedFile: this.uncheckedFiles[this.currentCheckingQueueFileIndex] });
            const name = `${uuidv4()}${extname(file.originalname)}`;
            const path = `${this.uploadsCoreDestination}\\${this.destinations[file.fieldname]}\\${name}`;

            await cb(null, name); //! after this file starting creation

            if (this.safeFileError !== 'NOT_VALID') {
                const error = await this.uploadService.isFileExtensionSafe({ ...file, path });
                console.log(file.fieldname + ' -> ' + file.originalname, error);

                if (error && error !== 'VALID') {
                    this.safeFileError = { message: error, path };
                } else {
                    this.uncheckedFiles.push({ ...file, path });
                }
            }
        };

        private fileTypeValidation(fileTypes: FileTypesEnum[] | Record<string, FileTypesEnum[]>) {
            const filedIsArray = Array.isArray(fileTypes);

            return async (req: Request | any, file: Express.Multer.File, cb: (error: Error | null, valid: boolean) => void): Promise<void> => {
                console.log('fileTypeValidation');
                //console.log( { originalname: file.originalname, fieldname: file.fieldname });
                const thisFileTypes = filedIsArray ? fileTypes : fileTypes[file.fieldname];
                const ext: any = extname(file.originalname).slice(1);

                if (thisFileTypes && !thisFileTypes.includes(ext)) {
                    const errString = `Please upload only supported file formats (${thisFileTypes.toString()})`;
                    const error = filedIsArray ? errString : { [file.fieldname]: errString };

                    return cb(new UnsupportedMediaTypeException(error), false);
                }

                if (this.safeFileError !== 'NOT_VALID' && this.safeFileError.message) {
                    const error = this.safeFileError.message;
                    this.safeFileError = 'NOT_VALID';
                    return cb(new UnsupportedMediaTypeException(error), false);
                }

                return cb(null, this.safeFileError !== 'NOT_VALID');
            };
        }

        private fileDestinationGenerator(
            destinations: string | Record<MulterField['name'], string>,
        ): string | ((req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => void) {
            console.log('fileDestinationGenerator', destinations);
            this.destinations = destinations;
            if (typeof destinations === 'string') {
                return `${this.uploadsCoreDestination}\\${destinations}`;
            }

            return (req, file, cb) => {
                const destination = `${this.uploadsCoreDestination}\\${destinations[file.fieldname]}`;
                if (!existsSync(destination)) {
                    mkdirSync(destination, { recursive: true });
                }
                cb(null, destination);
            };
        }

        private destructureRequestFiles(ctx: HttpArgumentsHost, isManyFields: boolean): void {
            const req = ctx.getRequest();
            const files = req.files;

            if (!isManyFields && files[0]) {
                req.files = { [files?.[0].fieldname]: files };
            }

            this.changeFilesPath(req);
        }

        private changeFilesPath(req): void {
            req.files = _.mapValues(req.files, (files) => {
                return Array.isArray(files)
                    ? files.map((file) => ({ ...file, publicPath: file.path.replace(`${this.configService.get(PUBLIC_FOLDER, 'public')}/`, '') }))
                    : [{ ...files, publicPath: files.path.replace(`${this.configService.get(PUBLIC_FOLDER, 'public')}/`, '') }];
            });
        }

        private createNestedFilesObject(field: fileOption): fileOption | fileOption[] {
            const nestedFiles = [];
            const match = [...field.name.matchAll(this.nestedKeyRegex)];

            if (match.length) {
                const nestedMaxCount = +match[0][1] || 1;
                const names = field.name.split(match[0][0]);

                for (let i = 0; i < nestedMaxCount; i++) {
                    nestedFiles.push({
                        ...field,
                        name: `${names[0]}[${i}][${names[1]}]`,
                    });
                }
            }

            return nestedFiles.length ? nestedFiles : field;
        }

        private margeFilesIntoBody(requestFiles, body, maxCounts) {
            requestFiles.constructor.skipValidation = true;
            console.log('requestFiles');

            for (const key in requestFiles) {
                const regex = /\[([^\]]+)]/g;
                const match = [...key.matchAll(regex)];
                let value = maxCounts[key] > 1 ? requestFiles[key].map((fileObj) => fileObj.publicPath) : requestFiles[key][0].publicPath;

                if (match.length) {
                    const fieldName = key.slice(0, match[0].index);
                    const nestedKey = key.replace(regex, (matchValue: string, innerValue: string, index: number, ...args: any): string =>
                        !isNaN(+innerValue) && match[0].index === index ? '[]' : innerValue,
                    );

                    //console.log({ fieldName, nestedKey });

                    !requestFiles[fieldName] && (requestFiles[fieldName] = []);
                    value = maxCounts[nestedKey] > 1 ? requestFiles[key].map((fileObj) => fileObj.publicPath) : requestFiles[key][0].publicPath;

                    requestFiles[fieldName].push(...requestFiles[key]);
                    delete requestFiles[key];
                }

                //console.log('value', value, maxCounts);

                _.setWith(body, key, value, Object);
            }
        }

        private getMaxCountsByFieldName(fields: fileOption | fileOption[]) {
            const maxCountsByFieldName = {};

            if (Array.isArray(fields)) {
                fields.forEach((field) => {
                    const match = [...field.name.matchAll(this.nestedKeyRegex)];
                    if (match.length) {
                        const fieldName = field.name.replace(match[0][0], '[]');
                        maxCountsByFieldName[fieldName] = field.maxCount || 1;
                    } else {
                        maxCountsByFieldName[field.name] = field.maxCount || 1;
                    }
                });
            } else {
                maxCountsByFieldName[fields.name] = fields.maxCount || 1;
            }

            return maxCountsByFieldName;
        }
    }

    const Interceptor = mixin(MixinInterceptor);

    return Interceptor;
}
