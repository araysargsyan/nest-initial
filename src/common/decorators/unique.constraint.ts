import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityTarget, Repository } from 'typeorm';
import { CustomConstraintsEnum } from '@/common/enums/custom-constraints.enum';
import { TablesEnum } from '@/common/enums/tables.enum';
import { dbConnections } from '@/common/constants/database.const';

@ValidatorConstraint({ name: CustomConstraintsEnum.IS_UNIQUE, async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
    private existingFields: string[] = [];
    protected repo: Repository<any>;

    constructor(@InjectConnection(dbConnections.DEFAULT) private readonly connection: Connection) {}

    private async getOneOrFail(operators): Promise<any> {
        const item = await this.repo.findOne({ where: operators });
        return item;
    }

    async validate(value: number, args: ValidationArguments) {
        Logger.debug('', 'UniqueConstraint');

        const arrayFromObjKeys = Object.keys(args.object);
        if (arrayFromObjKeys[arrayFromObjKeys.length - 1] === args.property) {
            const dto: any = args.object.constructor;

            console.log(dto);
            const table: TablesEnum | EntityTarget<any> = dto.table;
            const entity = typeof table === 'string' ? this.connection.getMetadata(table).tableMetadataArgs.target : table;
            this.repo = this.connection.getRepository(entity);

            const operators = arrayFromObjKeys.map((key) => ({ [key]: args.object[key] }));
            const item = await this.getOneOrFail(operators);

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

            existingFields.forEach((f) => (messages[f] = [`${f.charAt(0).toUpperCase() + f.slice(1)} already exist`]));
            return JSON.stringify(messages);
        }
    }
}

export function Unique(validationOptions?: ValidationOptions) {
    return function (target: any, propertyName: string) {
        registerDecorator({
            name: CustomConstraintsEnum.IS_UNIQUE,
            target: target.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: UniqueConstraint,
        });
    };
}

export function UseUnique(constructor: any) {
    constructor.constraints = constructor?.constraints ? constructor.constraints.push(CustomConstraintsEnum.IS_UNIQUE) : [CustomConstraintsEnum.IS_UNIQUE];
}
