import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { deserialize } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { SkipValidation } from '@/common/utils/skip-validation.util';
import { JwtPayloadInterface } from '@/common/interfaces/jwt-payload.interface';

class User extends SkipValidation implements Partial<JwtPayloadInterface> {}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService, private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true;
        }

        try {
            //const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException();
            }

            const user = this.jwtService.verify(token);

            req.user = deserialize(User, JSON.stringify(user));
            return !!user;

            //return !requiredRoles || requiredRoles.includes(user.role);
        } catch (e) {
            Logger.error(`Auth global guard ---> ${e}`);
            throw new UnauthorizedException(`Auth global guard ---> ${e}`);
        }
        return super.canActivate(context);
    }
}
