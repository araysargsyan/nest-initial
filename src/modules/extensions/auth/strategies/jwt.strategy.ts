import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadInterface } from '@/common/interfaces/jwt-payload.interface';
import { UserEntity } from '@/modules/user/user.entity';
import { UserService } from '@/modules/user/user.service';
import { AuthStrategies, JWT_KEY } from '@/common/constants/auth.const';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategies.JWT) {
    constructor(private userService: UserService, private configService: ConfigService) {
        super({
            secretOrKey: configService.get(JWT_KEY),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayloadInterface): Promise<UserEntity> {
        Logger.verbose(6666666, 'JwtStrategy');
        console.log(payload);

        const { id } = payload;
        const user = await this.userService.get({ id });

        return user;
    }
}
