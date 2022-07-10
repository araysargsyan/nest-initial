import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
import { deserialize, Exclude, Expose } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from '@/common/interfaces/jwt-payload.interface';
import { AuthEnum } from '@/common/enums/auth.enum';
import { ValidationOptions } from '@/common/decorators/validation-options.decorator';
import { UserCreateDto } from '@/modules/user/dto/user.create.dto';

//@Exclude()
@ValidationOptions({ skipMissingProperties: true })
class User extends UserCreateDto implements JwtPayloadInterface {
    @Expose()
    id: number;
    @Expose()
    email: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthEnum.JWT) {
    constructor(private jwtService: JwtService, private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        console.log('JwtAuthGuard');
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true;
        }
        // const a = await super.canActivate(context)
        // console.log(a, 7777);

        // try {
        //     //const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
        //     const req = context.switchToHttp().getRequest();
        //     const authHeader = req.headers.authorization;
        //     const bearer = authHeader.split(' ')[0];
        //     const token = authHeader.split(' ')[1];
        //     if (bearer !== 'Bearer' || !token) {
        //         throw new UnauthorizedException();
        //     }
        //
        //     const user = this.jwtService.verify(token);
        //     console.log(user, 777);
        //
        //     req.user = deserialize(User, JSON.stringify(user));
        //     return !!user;
        //
        //     //return !requiredRoles || requiredRoles.includes(user.role);
        // } catch (e) {
        //     Logger.error(`Auth global guard ---> ${e}`);
        //     throw new UnauthorizedException(`Auth global guard ---> ${e}`);
        // }

        return super.canActivate(context);
    }
}
