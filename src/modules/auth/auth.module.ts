import { Module } from '@nestjs/common';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { AuthController } from './auth.controller';

@Module({
    controllers: [AuthController],
    providers: [FacebookStrategy],
})
export class AuthModule {}
