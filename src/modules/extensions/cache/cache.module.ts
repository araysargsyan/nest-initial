import { CacheModule, Global, Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClientOptions } from 'redis';
import * as RedisStore from 'connect-redis';
import * as redisStore from 'cache-manager-redis-store';
import { REDIS } from '@/common/constants/global.const';
import * as session from 'express-session';
import * as passport from 'passport';

@Global()
@Module({
    imports: [
        CacheModule.registerAsync<RedisClientOptions>({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                isGlobal: true,
                store: redisStore,
                host: 'localhost',
                port: 6379,
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [CacheModule],
})
export class BaseCacheModule {}
