//* https://stackoverflow.com/questions/53786383/validate-nested-objects-using-class-validator-and-nestjs

import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNonPrimitiveArray(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'IsNonPrimitiveArray',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    console.log(Array.isArray(value));
                    return Array.isArray(value) && value.reduce((a, b) => a && typeof b === 'object' && !Array.isArray(b), true);
                },
            },
        });
    };
}
