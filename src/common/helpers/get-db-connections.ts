import { TDbConnectionsType } from '@/common/types';

export const getDbConnections = (dbConfig): TDbConnectionsType =>
    Object.keys(dbConfig).reduce(
        (accumulator, key: any) => (key === 'DEFAULT' ? (accumulator[key] = key.toLowerCase()) : (accumulator[key] = dbConfig[key].type), accumulator),
        {} as TDbConnectionsType,
    );
