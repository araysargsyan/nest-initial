import { TablesEnum } from '@/common/enums/tables.enum';

export interface IUniqueConstraintDtoConstructor<T = any> {
    new (): any;
    table: TablesEnum | { new (): T };
}
