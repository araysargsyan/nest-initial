import { Logger as LoggerI } from 'typeorm/logger/Logger';
import { QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class OrmLogger implements LoggerI {
    /**
     * Logs query and parameters used in it.
     */
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        Logger.verbose(query, 'QUERY');
        parameters && Logger.debug(parameters, 'PARAMETERS');
    }
    /**
     * Logs query that is failed.
     */
    logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        //Logger.error(error, 'DataBaseError')
    }
    /**
     * Logs query that is slow.
     */
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        //Logger.debug()
    }
    /**
     * Logs events from the schema build process.
     */
    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        //Logger.debug()
    }
    /**
     * Logs events from the migrations run process.
     */
    logMigration(message: string, queryRunner?: QueryRunner): any {
        //Logger.debug()
    }
    /**
     * Perform logging using given logger, or by default to the console.
     * Log has its own level and message.
     */
    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
        //Logger.debug(queryRunner, 'message')
    }
}
