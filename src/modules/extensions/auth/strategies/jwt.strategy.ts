import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadInterface } from '@common/interfaces/jwt-payload.interface';
import { UserEntity } from '@~/modules/user/user.entity';
import { UserService } from '@~/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private userService: UserService, private configService: ConfigService) {
        super({
            secretOrKey: configService.get('JWT_KEY'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayloadInterface): Promise<UserEntity> {
        const { id } = payload;
        const user = await this.userService.getUser({ id });

        return user;
    }
}
