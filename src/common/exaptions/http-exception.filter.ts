import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Injectable, Scope, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { MulterConfigService } from '../../upload.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
