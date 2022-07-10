import { Injectable } from '@nestjs/common';
import { PassportSerializer, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '@/modules/extensions/auth/auth.service';
import { UserService } from '@/modules/user/user.service';
import { CryptoService } from '@/modules/extensions/common/crypto.service';
import { isString } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private readonly userService: UserService) {
        super({
            usernameField: 'email',
            // passwordField: 'firstName',
            //session: true,
        });
    }

    async validate(email: string, password: string) {
        console.log(11333333333331221);
        //return this.userService.get({ email });
    }
}

@Injectable()
export class AuthSerializer extends PassportSerializer {
    constructor(private readonly userService: UserService, private readonly cryptoService: CryptoService) {
        super();
    }
    serializeUser(user: any, done: (err: Error, user: any) => void) {
        //console.log(11, this.getPassportInstance());
        console.log(11, user);
        const u = isString(user) ? this.cryptoService.decrypt(user) : user;
        //console.log(11, this.cryptoService.decrypt(user), 'serializeUser');
        done(null, user);
    }

    deserializeUser(payload: { id: number; role: string }, done: (err: Error, user: any) => void) {
        console.log(11, payload, 'deserializeUser');
        // const u = isString(payload) ? this.cryptoService.decrypt(payload) : payload;
        // console.log(11, u, 'deserializeUser');
        done(null, payload);
    }
}
