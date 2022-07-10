import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { socialAuthStrategy } from '@/common/constants/auth.const';
import { SocialAuthStrategyEnum } from '@/common/enums/core';

export const SocialAuthType = createParamDecorator((data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const socialAuthType = request.socialAuthType || '';
    if (socialAuthType) {
        delete request.socialAuthType;
    }

    Logger.verbose(socialAuthType, 'SocialAuthTypeDecorator');
    return socialAuthStrategy === SocialAuthStrategyEnum.SPLIT ? socialAuthType : null;
});
