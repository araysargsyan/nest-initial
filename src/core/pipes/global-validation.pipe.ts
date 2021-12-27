import { ArgumentMetadata, BadRequestException, Inject, Injectable, Logger, PipeTransform, Scope } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';
import { CustomConstraintsEnum } from '@/common/enums/custom-constraints.enum';
import { UploadService } from '@/modules/extensions/upload/upload.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class GlobalValidationPipe implements PipeTransform {
    private validatorOptions: ValidatorOptions = {
        skipMissingProperties: false,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
    };

    constructor(readonly uploadService: UploadService, @Inject(REQUEST) readonly request: Request) {}

    public async transform(value: any, metadata: ArgumentMetadata & { metatype: { skipValidation?: boolean } }) {
        Logger.debug(metadata.type, 'GlobalValidationPipe');
        const skipValidation = metadata?.metatype?.skipValidation || value?.constructor?.skipValidation || metadata?.type === 'custom' || false;
        //console.log(value);
        if (!skipValidation) {
            const { object, errors } = await this.validate(metadata.metatype, value);

            if (errors.length) {
                await this.uploadService.removeFiles(this.request.files);
                throw new BadRequestException(this.createValidationErrors(errors));
            }

            return object;
        }

        return plainToClass(metadata.metatype, value) || null;
    }

    private async validate(currentClass, value) {
        const parentClass = Object.getPrototypeOf(currentClass);
        const isParentClassHaveConstraints = parentClass?.constraints?.includes(...Object.values(CustomConstraintsEnum)) || false;
        const object = plainToClass(isParentClassHaveConstraints ? parentClass : currentClass, value);

        let errors = [];

        if (isParentClassHaveConstraints) {
            errors = await validate(plainToClass(parentClass, value), this.validatorOptions);
        }

        if (!errors.length) {
            this.validatorOptions.skipMissingProperties = isParentClassHaveConstraints;
            errors = await validate(plainToClass(currentClass, value), this.validatorOptions);
        }

        return { object, errors };
    }

    private createValidationErrors(errors) {
        let errObj = {};
        const isUnique = CustomConstraintsEnum.IS_UNIQUE;

        for (const error of errors) {
            if (error.constraints && Object.keys(error.constraints).includes(isUnique)) {
                errObj = JSON.parse(error.constraints[isUnique]);
            } else {
                if (error.children?.length) {
                    errObj[error.property] = this.createChildErrors(error);
                } else {
                    errObj[error.property] = Object.values(error.constraints);
                }
            }
        }

        return errObj;
    }

    private createChildErrors(error) {
        let errObj = {};
        for (const errorChild of error.children) {
            if (errorChild.children?.length) {
                errObj[errorChild.property] = this.createChildErrors(errorChild);
            } else {
                if (errorChild.constraints?.nestedValidation) {
                    errObj = Object.values(errorChild.constraints);
                } else {
                    errObj[errorChild.property] = Object.values(errorChild.constraints);
                }
            }
        }

        return errObj;
    }
}
