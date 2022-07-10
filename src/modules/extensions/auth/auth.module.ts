import { Global, Module } from '@nestjs/common';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRES_IN, JWT_KEY } from '@/common/constants/auth.const';
import { GoogleStrategy } from '@/modules/extensions/auth/strategies/google.strategy';
import { CryptoService } from '@/modules/extensions/common/crypto.service';
import { DecryptValueConstraint } from '@/common/decorators/decrypt-value.constraint';
import { AuthSerializer, LocalStrategy } from '@/modules/extensions/auth/strategies/local.strategy';

@Global()
@Module({
    imports: [
        PassportModule.register({
            session: true,
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get(JWT_KEY),
                signOptions: {
                    expiresIn: config.get(JWT_EXPIRES_IN),
                },
            }),
            inject: [ConfigService],
        }),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, CryptoService, DecryptValueConstraint, FacebookStrategy, GoogleStrategy, JwtStrategy, LocalStrategy, AuthSerializer],
    exports: [JwtModule, PassportModule],
})
export class AuthModule /*implements NestModule*/ {
    // private readonly strategyPath = getPathFromEnum(SocialAuthEnum);
    // private readonly socialAuthTypePath = getPathFromEnum(SocialAuthTypeEnum);
    //
    // configure(consumer: MiddlewareConsumer) {
    //     consumer
    //         .apply(SocialAuthMiddleware)
    //         .forRoutes(`auth/:strategy(${this.strategyPath})/redirect`, `auth/:type(${this.socialAuthTypePath})/:strategy(${this.strategyPath})`);
    // }
}
