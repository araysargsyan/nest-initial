import { isString, registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { CustomConstraintsEnum } from '@/common/enums/custom-constraints.enum';
import { dbConnections } from '@/common/constants/database.const';
import { IUniqueDtoConstructor } from '@/common/interfaces';
import { capitalize } from 'lodash';
import { TClass, TUniqueConstraintDtoConstructor, TUniqueConstraintEntity } from '@/common/types';
import { exception } from '@/common/helpers/get-exception';

@ValidatorConstraint({ name: CustomConstraintsEnum.IS_UNIQUE, async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
    private existingFields: string[] = [];

    constructor(@InjectConnection(dbConnections.DEFAULT) private readonly connection: Connection) {}

    async validate(value: number, args: ValidationArguments) {
        Logger.debug('', 'UniqueConstraint');

        const arrayFromObjKeys = Object.keys(args.object);
        if (arrayFromObjKeys[arrayFromObjKeys.length - 1] === args.property) {
            const dtoClass = args.object.constructor as TUniqueConstraintDtoConstructor;
            const entity = this.getEntity(dtoClass);
            const operators = arrayFromObjKeys.map((key) => ({ [key]: args.object[key] }));
            const item = await this.getOneOrFail(operators, entity);

            item && Object.keys(item).forEach((key) => arrayFromObjKeys.includes(key) && item[key] === args.object[key] && this.existingFields.push(key));

            return !item;
        } else {
            return true;
        }
    }

    defaultMessage(args: ValidationArguments): string {
        if (args.targetName) {
            const existingFields = this.existingFields;
            this.existingFields = [];
            const messages = {};

            existingFields.forEach((field) => (messages[field] = [exception('isUnique', 'validation') /*`${capitalize(field)} already exist`*/]));
            return JSON.stringify(messages);
        }
    }

    private async getOneOrFail(operators, entity): Promise<any> {
        const repository = this.connection.getRepository(entity);
        return repository.findOne({ where: operators });
    }

    private getEntity(dtoClass: TUniqueConstraintDtoConstructor) {
        return dtoClass.table ? this.connection.getMetadata(dtoClass.table).tableMetadataArgs.target : dtoClass.getTable ? dtoClass.getTable() : null;
    }
}

export function Unique(tableName: string = null, validationOptions?: ValidationOptions) {
    return function (target: any, propertyName: string) {
        tableName && !target.constructor.table && (target.constructor.table = tableName);
        registerDecorator({
            name: CustomConstraintsEnum.IS_UNIQUE,
            target: target.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: UniqueConstraint,
        });
    };
}

export function UseUnique(entity: TUniqueConstraintEntity, UniquesClass: TClass): (constructor: any) => void {
    return function (constructor: IUniqueDtoConstructor): void {
        constructor.UniquesClass = UniquesClass;
        constructor.isUnique = CustomConstraintsEnum.IS_UNIQUE;

        if (isString(entity)) {
            constructor.table = entity;
        } else {
            constructor.getTable = entity;
        }
    };
}
