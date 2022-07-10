import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, PipeTransform, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { isNull } from 'lodash';
import { UploadService } from '@/modules/extensions/upload/upload.service';
import { CustomConstraintsEnum } from '@/common/enums/custom-constraints.enum';
import { TGlobalValidationMetadata, TRequest } from '@/common/types/core';
import { TUniqueConstraintDtoConstructor } from '@/common/types';

@Injectable({ scope: Scope.REQUEST })
export class GlobalValidationPipe implements PipeTransform {
    private validatorOptions: ValidatorOptions = {
        skipMissingProperties: false,
        skipUndefinedProperties: false,
        skipNullProperties: false,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
    };

    constructor(readonly uploadService: UploadService, @Inject(REQUEST) readonly request: TRequest) {}

    async transform(value: any, metadata: TGlobalValidationMetadata) {
        Logger.debug(metadata.type, 'GlobalValidationPipe');
        ///* metadata.type === 'query' && */ console.log({ metadata, value });
        const localValidationOptions = metadata.metatype?.validationOptions || value?.constructor?.validationOptions || {};
        const skipValidation = isNull(metadata.metatype?.validationOptions) || isNull(value?.constructor?.validationOptions);
        const object = plainToClass(metadata.metatype, value) || null;

        if (skipValidation) return object;

        const originalValue = this.getOriginalValue(value, metadata.data);

        if (metadata.type !== 'custom') {
            //! body (with files), query, param
            const { object, errors } = await this.validate(metadata.metatype, originalValue, localValidationOptions);

            if (errors.length) {
                this.request.files && (await this.uploadService.removeFiles(this.request.files)); //! if body have files
                throw new BadRequestException(this.createValidationErrors(errors));
            }

            return object;
        } else if (metadata.type === 'custom') {
            //! customs without files validation
            const errors = await validate(plainToClass(metadata.metatype, originalValue), { ...this.validatorOptions, ...localValidationOptions });

            if (errors.length) {
                Logger.error(errors, 'CustomValidationError');
                throw new InternalServerErrorException();
            }

            return plainToClass(metadata.metatype, value, { ignoreDecorators: true });
        }

        return object;
    }

    private async validate(CurrentClass, value, localValidationOptions): Promise<{ object: any; errors: Array<ValidationError> }> {
        const haveUniques = CurrentClass?.isUnique === CustomConstraintsEnum.IS_UNIQUE || false;
        const object: typeof CurrentClass = plainToClass(CurrentClass, value);
        let errors = await validate(object, { ...this.validatorOptions, ...localValidationOptions });

        if (!errors.length && haveUniques) {
            errors = await this.validateUniques(CurrentClass, value);
        }

        return { object, errors };
    }

    private async validateUniques(CurrentClass, originalValue): Promise<Array<ValidationError>> {
        const uniqueClassInstance = plainToClass(CurrentClass.UniquesClass, originalValue, { strategy: 'excludeAll' });
        CurrentClass.table && ((uniqueClassInstance.constructor as TUniqueConstraintDtoConstructor).table = CurrentClass.table);
        CurrentClass.getTable && ((uniqueClassInstance.constructor as TUniqueConstraintDtoConstructor).getTable = CurrentClass.getTable);
        return await validate(plainToClass(CurrentClass.UniquesClass, originalValue, { strategy: 'excludeAll' }), this.validatorOptions);
    }

    private getOriginalValue(value, validateValueOfProperty) {
        if (validateValueOfProperty) {
            return {
                [validateValueOfProperty]: value,
            };
        }

        return value;
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
