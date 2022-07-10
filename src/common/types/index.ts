import { IUniqueDtoConstructor } from '@/common/interfaces';

//! CORE
export type TClass = { new (): any };

export type TBaseEntityFields = 'id' | 'createdAt' | 'updatedAt';

export type TUniqueConstraintDtoConstructor = Pick<IUniqueDtoConstructor, 'table' | 'getTable'>;
export type TUniqueConstraintEntity = TUniqueConstraintDtoConstructor[keyof TUniqueConstraintDtoConstructor];
