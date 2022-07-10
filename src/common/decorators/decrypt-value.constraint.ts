import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { CryptoService } from '@/modules/extensions/common/crypto.service';
import { plainToClass } from 'class-transformer';

export function DecryptValue(Class, property, withoutCurrentProperty = false, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: { ...validationOptions, message: `alooo` },
            constraints: [Class, property, withoutCurrentProperty],
            validator: DecryptValueConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'DecryptValue' })
export class DecryptValueConstraint implements ValidatorConstraintInterface {
    constructor(private cryptoService: CryptoService) {}

    validate(value: any, args: ValidationArguments) {
        const [Class, property, withoutCurrentProperty] = args.constraints;

        console.log('args.object', args.object, 1);

        args.object[property] = plainToClass(Class, this.cryptoService.decrypt(value, true));

        if (withoutCurrentProperty) {
            delete args.object[args.property];
        }

        console.log('args.object', args.object, 2);
        return true;
    }
}
