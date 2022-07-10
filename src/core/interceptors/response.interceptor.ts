import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, classToPlain, deserialize, plainToClass, serialize } from 'class-transformer';
import { ClassSerializerInterceptor, ClassSerializerInterceptorOptions } from '@nestjs/common/serializer/class-serializer.interceptor';

@Injectable()
export class ResponseInterceptor<T> extends ClassSerializerInterceptor {
    constructor(reflector: any, defaultOptions?: ClassSerializerInterceptorOptions) {
        super(reflector, defaultOptions);
    }

    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
        return next.handle().pipe(
            map((data): any => {
                Logger.debug('', 'ResponseInterceptor');
                //console.log(data && plainToClass(data.constructor as ClassConstructor<any>, data));
                return data ? classToPlain(data) : null;
            }),
        );
    }
}
