import { Module } from '@nestjs/common';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../user/user.module';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                secret: config.get('SALT_KEY'),
                signOptions: {
                    expiresIn: '1d',
                },
            }),
            inject: [ConfigService],
        }),
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, FacebookStrategy, JwtStrategy],
    exports: [JwtModule, PassportModule],
})
export class AuthModule {}
