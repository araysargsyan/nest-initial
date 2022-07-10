import { TSocialStrategy } from '@/common/types/core';
import { PassportStrategy } from '@nestjs/passport';
import { Profile as FProfile } from 'passport-facebook';
import { VerifyCallback, Profile as GProfile } from 'passport-google-oauth20';
import { Logger } from '@nestjs/common';
import { SocialUser } from '@/modules/extensions/auth/dto/social-user.dto';

export function socialStrategyGenerator(strategy: any, strategyName: TSocialStrategy): any {
    class BaseSocialStrategy extends PassportStrategy(strategy, strategyName) {
        constructor(options) {
            super(options /*, {passReqToCallback: true}*/);
        }

        async validate(
            /*request: Request & { aaa: any },*/
            accessToken: string,
            refreshToken: string,
            profile: FProfile | GProfile,
            done: VerifyCallback,
        ): Promise<any> {
            Logger.verbose(profile.provider, 'SocialAuthStrategy');

            const { name, emails, id, provider } = profile;
            const emailsArray = emails.map((email) => email.value);
            const user: Omit<SocialUser, 'email' | 'password' | 'confirmPassword'> = {
                firstName: name.givenName,
                lastName: name.familyName,
                providers: {
                    [provider]: {
                        id: id,
                        emails: emailsArray,
                    },
                },
            };

            done(null, user);
        }
    }

    return BaseSocialStrategy;
}
