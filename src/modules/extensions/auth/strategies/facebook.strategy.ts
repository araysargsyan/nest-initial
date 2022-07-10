import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { EndPointsEnum } from '@/common/enums/end-points.enum';
import { AuthStrategies, FB_APP_ID, FB_APP_SECRET } from '@/common/constants/auth.const';
import { APP_URL } from '@/common/constants/global.const';
import { socialStrategyGenerator } from '@/modules/extensions/auth/strategies/base.social.strategy';

@Injectable()
export class FacebookStrategy extends socialStrategyGenerator(Strategy, AuthStrategies.SOCIAL.FACEBOOK) {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get(FB_APP_ID),
            clientSecret: configService.get(FB_APP_SECRET),
            callbackURL: `${configService.get(APP_URL)}/${EndPointsEnum.AUTH}/facebook/redirect/`,
            scope: 'email',
            profileFields: ['emails', 'name'],
        });
    }
}
