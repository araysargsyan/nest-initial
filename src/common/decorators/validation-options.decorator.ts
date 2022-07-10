import { ValidatorOptions } from 'class-validator/types/validation/ValidatorOptions';

export function ValidationOptions(validationOptions: ValidatorOptions | null = {}): (constructor: any) => void {
    return function (constructor: { new (): any } & { validationOptions: ValidatorOptions | null }): void {
        constructor.validationOptions = validationOptions;
    };
}
