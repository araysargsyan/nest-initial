import { ExecutionContext, Injectable, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { deserialize } from 'class-transformer';
import { AuthService } from '@/modules/extensions/auth/auth.service';
import { isNull, isUndefined } from 'lodash';
import { TSocialAuthType, TSocialStrategy } from '@/common/types/core';
import { socialAuthStrategy } from '@/common/constants/auth.const';
import { SocialAuthStrategyEnum } from '@/common/enums/core';
import { SocialUser } from '@/modules/extensions/auth/dto/social-user.dto';

export class SocialAuthGuard {
    static readonly cashedGuards = {};

    static activate(): Array<MethodDecorator & ClassDecorator> {
        return Object.keys(this.cashedGuards).map((k) => UseGuards(this.cashedGuards[k]));
    }

    static create(strategy: TSocialStrategy): void {
        if (this.cashedGuards[strategy]) return this.cashedGuards[strategy];

        @Injectable()
        class BaseSocialAuthGuard extends AuthGuard(strategy) {
            private authType: TSocialAuthType = null;

            constructor(private authService: AuthService, private reflector: Reflector) {
                super();
            }

            async canActivate(context: ExecutionContext) {
                Logger.debug(context.getHandler().name, 'SocialAuthGuard');
                const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
                if (isPublic) return true;
                const request = context.switchToHttp().getRequest();
                console.log('canActivate', strategy, request.socialAuthStrategy, request.params);
                if (strategy !== request.params?.strategy) return true;

                if (socialAuthStrategy === SocialAuthStrategyEnum.SPLIT) {
                    const socialAuthType = request.params.type || this.authType;

                    if (isNull(this.authType)) {
                        this.authType = socialAuthType;
                    } else {
                        request.socialAuthType = socialAuthType;
                        this.authType = null;
                    }
                }

                await super.canActivate(context);

                request.user = deserialize(
                    SocialUser,
                    JSON.stringify(request.user, (key, value) => (isUndefined(value) ? null : value)),
                );

                return !!request.user;
            }
        }

        !this.cashedGuards[strategy] && (this.cashedGuards[strategy] = BaseSocialAuthGuard);
    }
}
