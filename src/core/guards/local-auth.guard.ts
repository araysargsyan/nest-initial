import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CryptoService } from '@/modules/extensions/common/crypto.service';
import { isString } from 'class-validator';

@Injectable()
export class LoginLocalGuard extends AuthGuard('local') {
    constructor(private readonly cryptoService: CryptoService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest();
        console.log(1111, req.query['user-token'], req.user, req.isAuthenticated(), req.session, 'LocalGuard');

        !req.user && (req.user = req.query['user-token']);
        console.log(req.user, req.isAuthenticated(), 111);
        const result = isString(req.user) && (await super.logIn(req));
        //const r = (await super.canActivate(context)) as boolean;

        console.log('result', { isAuthenticated: req.isAuthenticated(), user: req.user });
        return req.isAuthenticated();
    }
}

@Injectable()
export class LoggedInGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        console.log(1111, 'LoggedInGuard', req.isAuthenticated(), req.user);
        return req.isAuthenticated();
    }
}

@Injectable()
export class LocalGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log(context.switchToHttp().getRequest().user, 55555);
        const result = (await super.canActivate(context)) as boolean;
        console.log(result, 55555);
        await super.logIn(context.switchToHttp().getRequest());
        return result;
    }
}
