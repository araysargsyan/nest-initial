export function enumToObject<T>(en, reversKeyValue = false): T {
    const obj: T | any = {};
    if (reversKeyValue) {
        Object.keys(en).forEach((key) => (obj[en[key]] = key));
    } else {
        Object.keys(en).forEach((key) => (obj[key] = en[key]));
    }
    return obj;
}
