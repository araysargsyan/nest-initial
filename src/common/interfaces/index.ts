import { TablesEnum } from '@/common/enums/tables.enum';
import { CustomConstraintsEnum } from '@/common/enums/custom-constraints.enum';

export interface IUniqueDtoConstructor<T = any> {
    table?: TablesEnum;
    getTable?(): { new (): T };
    UniquesClass: { new (): any };
    isUnique: CustomConstraintsEnum.IS_UNIQUE;
}
