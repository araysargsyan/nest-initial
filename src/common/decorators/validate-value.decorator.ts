export function ValidateValueOfProperty(property: string): (constructor: any) => void {
    return function (constructor: { new (): any } & { validateValueOfProperty: string }): void {
        constructor.validateValueOfProperty = property;
    };
}
