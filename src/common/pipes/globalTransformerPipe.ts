import { ArgumentMetadata, BadRequestException, HttpException, HttpStatus, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { classToClass, classToPlain, deserialize, plainToClass } from 'class-transformer';
import { validate, validateSync, ValidatorOptions } from 'class-validator';

export enum CustomConstraintsEnum {
    IS_UNIQUE = 'isUnique',
}

@Injectable()
export class GlobalTransformerPipe implements PipeTransform {
    async transform(value: any, metaData: ArgumentMetadata) {
        console.log(value, metaData.metatype);
        if (metaData.type !== 'custom') {
            const { object, errors } = await this.validate(metaData.metatype, value);

            if (errors.length) {
                throw new BadRequestException(this.createErrorsObj(errors));
            }

            return object;
        }

        return value;
    }

    private createErrorsObj(errors) {
        let errObj = {};
        const isUnique = CustomConstraintsEnum.IS_UNIQUE;

        for (const error of errors) {
            if (error.constraints && Object.keys(error.constraints).includes(isUnique)) {
                errObj = JSON.parse(error.constraints[isUnique]);
            } else {
                if (error.children?.length) {
                    errObj[error.property] = this.getChildErrors(error);
                } else {
                    errObj[error.property] = Object.values(error.constraints);
                }
            }
        }

        return errObj;
    }

    private getChildErrors(error) {
        let errObj = {};
        for (const errorChild of error.children) {
            if (errorChild.children?.length) {
                errObj[errorChild.property] = this.getChildErrors(errorChild);
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

    private async validate(currentClass, value) {
        const parentClass = Object.getPrototypeOf(currentClass);
        const isParentClassHaveConstraints = parentClass?.constraints?.includes(...Object.values(CustomConstraintsEnum)) || false;
        const object = plainToClass(isParentClassHaveConstraints ? parentClass : currentClass, value);

        const validatorOptions: ValidatorOptions = {
            skipMissingProperties: isParentClassHaveConstraints,
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
        };
        let errors = [];

        if (isParentClassHaveConstraints) {
            errors = await validate(plainToClass(parentClass, value), validatorOptions);
        }
        if (!errors.length) {
            errors = await validate(plainToClass(currentClass, value), validatorOptions);
        }

        return {
            object,
            errors,
        };
    }
}
