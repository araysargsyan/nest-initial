import { DatabaseType } from 'typeorm';
import { DbConnectionsEnum } from '@common/enums/db-connections.enum';

export const uploadsCoreDestination = './public/uploads/';
export const dbDefaultConnection: DatabaseType = DbConnectionsEnum.POSTGRES;
export const databaseRoot = 'database'; //? src/database
