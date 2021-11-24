import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

type LengthType = number | { min: number; max: number };

export function NumberLength(length: LengthType, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: {
                ...validationOptions,
                message: validationOptions?.message,
            },
            constraints: [length],
            validator: NumberLengthConstraint,
        });
    };
}

@ValidatorConstraint({ name: 'NumberLength' })
export class NumberLengthConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [length]: Array<LengthType> = args.constraints;
        const valueLength = `${value}`.length;

        if (typeof length === 'number') {
            return valueLength === length;
        } else if (typeof length === 'object') {
            return valueLength >= length.min && valueLength <= length.max;
        }
    }

    defaultMessage(args: ValidationArguments): string {
        const [length]: Array<LengthType> = args.constraints;
        const valueLength = `${args.value}`.length;

        if (typeof length === 'number') {
            if (valueLength > length) {
                return `The length of the number is greater than ${length}`;
            } else {
                return `The length of the number is less than ${length}`;
            }
        } else if (typeof length === 'object') {
            return `The length of the number is not in min=${length.min} and max=${length.max}`;
        }
    }
}
