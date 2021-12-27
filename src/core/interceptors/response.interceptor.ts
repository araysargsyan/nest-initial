import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
    constructor(private readonly dtoType: any) {}

    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
        return next.handle().pipe(map((data) => plainToClass(this.dtoType, data)));
    }
}
