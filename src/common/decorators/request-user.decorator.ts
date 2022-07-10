import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    Logger.verbose(JSON.stringify(request.user), 'UserDecorator');
    if (data) {
        request.user[data].constructor.validationOptions = request.user.constructor.validationOptions;
    }

    return data ? request.user[data] : request.user;
});
