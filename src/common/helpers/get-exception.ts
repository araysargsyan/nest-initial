import * as exceptions from '@/common/exceptions';
export function exception(exceptionRow: string, type: 'validation', params?: Array<string>) {
    console.log(exceptionRow, type, exceptions[type][exceptionRow]);
    return exceptions[type][exceptionRow];
}
