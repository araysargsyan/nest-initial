import { TDbConnectionsConfig, TDbConnectionsType } from '@/common/types/core';
import { DEFAULT_CONNECTION } from '@/common/constants/database.const';

export const getDbConnections = (dbConfig: TDbConnectionsConfig): TDbConnectionsType =>
    Object.keys(dbConfig).reduce(
        (accumulator, key: any) => (key === DEFAULT_CONNECTION ? (accumulator[key] = key.toLowerCase()) : (accumulator[key] = dbConfig[key].type), accumulator),
        {} as TDbConnectionsType,
    );
