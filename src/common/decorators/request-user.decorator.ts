import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
        request.user[data].constructor.skipValidation = request.user.constructor.skipValidation;
    }
    return data ? request.user[data] : request.user;
});
