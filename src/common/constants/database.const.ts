import { getDbConnections } from '@/common/helpers/get-db-connections';
import { dbConfig } from '@/config/db.config';

//! CORE
export const DEFAULT_CONNECTION = 'DEFAULT' as const;
export const DB_CONFIG = 'DB_CONFIG' as const;
export const dbConnections = getDbConnections(dbConfig); //* NOT CHANGEABLE

//! ENV
export const DB_TYPE = '_TYPE' as const;
export const DB_HOST = '_HOST' as const;
export const DB_PORT = '_PORT' as const;
export const DB_USER = '_USER' as const;
export const DB_PASSWORD = '_PASSWORD' as const;
export const DB_DB = '_DB' as const;
