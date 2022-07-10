import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthEnum } from '@/common/enums/auth.enum';
import { EndPointsEnum } from '@/common/enums/end-points.enum';
import { APP_URL } from '@/common/constants/global.const';
import { AuthStrategies, GOOGLE_APP_ID, GOOGLE_APP_SECRET } from '@/common/constants/auth.const';
import { socialStrategyGenerator } from '@/modules/extensions/auth/strategies/base.social.strategy';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends socialStrategyGenerator(Strategy, AuthStrategies.SOCIAL.GOOGLE) {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get(GOOGLE_APP_ID),
            clientSecret: configService.get(GOOGLE_APP_SECRET),
            callbackURL: `${configService.get(APP_URL)}/${EndPointsEnum.AUTH}/google/redirect/`,
            scope: ['email', 'profile'],
            //passReqToCallback: true,
        });
    }

    // async validate(/*request: Request & { aaa: any },*/ accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    //     console.log('GoogleStrategy');
    //
    //     const { name, emails, id } = profile;
    //     const emailsArray = emails.map((email) => email.value);
    //
    //     const user: Omit<SocialUser, 'email' | 'password' | 'confirmPassword'> = {
    //         firstName: name.givenName,
    //         lastName: name.familyName,
    //         providers: {
    //             google: {
    //                 id: id,
    //                 emails: emailsArray,
    //             },
    //         },
    //     };
    //
    //     done(null, user);
    // }
}
