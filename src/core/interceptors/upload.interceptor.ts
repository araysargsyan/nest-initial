import { CallHandler, ExecutionContext, Inject, Logger, mixin, NestInterceptor, Type, UnsupportedMediaTypeException } from '@nestjs/common';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterField, MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as _ from 'lodash';
import { extname } from 'path';
import { FileTypesEnum } from '@/common/enums/file-types.enum';
import { v4 as uuidv4 } from 'uuid';
import { UploadFolderEnum } from '@/common/enums/upload-folder.enum';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { UploadService } from '@/modules/extensions/upload/upload.service';
import { isString } from 'class-validator';
import { NOTE_SAFE_FILES, PUBLIC_FOLDER, SAFE_FILE, safeFileCheckingMode, uploadsFolder } from '@/common/constants/upload.const';
import { SafeFileCheckingModeEnum } from '@/common/enums/safe-file-checking-mode.enum';
import { fileOption } from '@/common/interfaces/core';
import { TRequestFiles, TSafeFileError } from '@/common/types/core';

export function UploadFilesInterceptor(
    fields: fileOption | fileOption[],
    globalDestinations?: UploadFolderEnum,
    globalFileTypes?: FileTypesEnum[],
    localOptions?: MulterOptions,
): Type<NestInterceptor> {
    class MixinInterceptor implements NestInterceptor {
        protected uploadsCoreDestination = '';
        private readonly nestedKeyRegex: RegExp = /\[([^\]]+)]/g;
        private uncheckedFiles = [];
        private destinations = {};
        private safeFileError: TSafeFileError = {};

        constructor(@Inject(ConfigService) private configService: ConfigService, @Inject(UploadService) private uploadService: UploadService) {
            this.uploadsCoreDestination = `${configService.get(PUBLIC_FOLDER, 'public')}\\${uploadsFolder}`;
        }

        async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
            this.uncheckedFiles = [];
            this.destinations = {};
            this.safeFileError = {};
            Logger.debug(JSON.stringify(this.uncheckedFiles), 'UploadFilesInterceptor');
            const ctx = context.switchToHttp();
            const newFields = this.getFields(fields);
            console.log(newFields);

            let selectedInterceptor;
            if (Array.isArray(newFields) && newFields.length > 1) {
                selectedInterceptor = this.uploadMultiFieldFiles(newFields, globalDestinations, globalFileTypes, localOptions);
            } else {
                selectedInterceptor = this.uploadFiles(newFields?.[0] || newFields);
            }

            //! Initialize request.files
            await new selectedInterceptor().intercept(context, next);
            console.log('Initialize request.files');

            const request = ctx.getRequest();

            if (safeFileCheckingMode === SafeFileCheckingModeEnum.EXPERIMENTAL) {
                await this.validateUncheckedFiles();
            } else if (safeFileCheckingMode === SafeFileCheckingModeEnum.ON_UPLOAD_INTERCEPTOR) {
                await this.validateUncheckedFiles(request.files);
            }

            this.destructureRequestFiles(request, Array.isArray(newFields) && newFields.length > 1);

            const maxCountsByFieldName = this.getMaxCountsByFieldName(fields);
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
                    fileSize: 2000000,
                    files: maxCount,
                },
                ...localOptions,
            });
        }

        private fileNameGenerator = async (req: Request, file: Express.Multer.File, cb: (error: Error | null, fileName: string) => void): Promise<void> => {
            console.log('fileNameGenerator', file.fieldname + ' -> ' + file.originalname);
            //console.log( { file, previousCheckedFile: this.uncheckedFiles[this.currentCheckingQueueFileIndex] });
            const name = `${uuidv4()}${extname(file.originalname)}`;
            await cb(null, name); //! after this line, the creation of the file begins

            if (safeFileCheckingMode === SafeFileCheckingModeEnum.EXPERIMENTAL && this.safeFileError !== NOTE_SAFE_FILES) {
                const path = `${this.uploadsCoreDestination}\\${this.destinations[file.fieldname]}\\${name}`;
                const result = await this.uploadService.checkFileExtension({ ...file, path });
                console.log(file.fieldname + ' -> ' + file.originalname, result);

                if (result && result !== SAFE_FILE) {
                    this.safeFileError = { message: result, path };
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

                if (safeFileCheckingMode === SafeFileCheckingModeEnum.EXPERIMENTAL && this.safeFileError !== NOTE_SAFE_FILES && this.safeFileError.message) {
                    const error = this.safeFileError.message;
                    this.safeFileError = NOTE_SAFE_FILES;
                    return cb(new UnsupportedMediaTypeException(error), false);
                }

                return cb(null, this.safeFileError !== NOTE_SAFE_FILES);
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

        private destructureRequestFiles(request: Request & { files: any }, isManyFields: boolean): void {
            if (!isManyFields && request.files[0]) {
                request.files = { [request.files?.[0].fieldname]: request.files };
            }

            this.changeFilesPath(request);
        }

        private changeFilesPath(request: Request & { files: any }): void {
            request.files = _.mapValues(request.files, (files) => {
                return Array.isArray(files)
                    ? files.map((file) => ({ ...file, publicPath: file.path.replace(`${this.configService.get(PUBLIC_FOLDER, 'public')}/`, '') }))
                    : [{ ...files, publicPath: files.path.replace(`${this.configService.get(PUBLIC_FOLDER, 'public')}/`, '') }];
            });
        }

        private getFields(fields: fileOption | fileOption[]): fileOption | fileOption[] {
            let newFields;
            if (Array.isArray(fields)) {
                newFields = fields.map((field) => this.createNestedFileField(field)).flat(1);
            } else if (fields.name.includes('[]')) {
                newFields = this.createNestedFileField(fields);
            }

            return newFields;
        }

        private createNestedFileField(field: fileOption): fileOption | fileOption[] {
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

        private margeFilesIntoBody(requestFiles: TRequestFiles, body: Body, maxCounts: Record<string, number>): void {
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

        private getMaxCountsByFieldName(fields: fileOption | fileOption[]): Record<string, number> {
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

        private async validateUncheckedFiles(requestFiles: TRequestFiles = null): Promise<void> {
            if (requestFiles) {
                const requestFilesArray = Object.values(requestFiles).flat(1);

                for (const uncheckedFile of requestFilesArray) {
                    const result = await this.uploadService.checkFileExtension(uncheckedFile);
                    if (result && result !== SAFE_FILE) {
                        this.safeFileError = { message: result };
                        break;
                    }
                }
                if (!isString(this.safeFileError) && this.safeFileError.message) {
                    await this.uploadService.removeFiles(requestFilesArray);
                    throw new UnsupportedMediaTypeException(this.safeFileError.message);
                }
            } else {
                if (!isString(this.safeFileError)) {
                    if (this.uncheckedFiles.length) {
                        if (!this.safeFileError.message) {
                            for (const uncheckedFile of this.uncheckedFiles) {
                                const result = await this.uploadService.checkFileExtension(uncheckedFile);
                                if (result && result !== SAFE_FILE) {
                                    this.safeFileError = { message: result };
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
                }
            }
        }
    }

    const Interceptor = mixin(MixinInterceptor);

    return Interceptor;
}
