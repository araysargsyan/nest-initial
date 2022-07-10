import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbConnectionsConfig } from '../../config/orm.config';
import { UploadModule } from './upload/upload.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { resolve } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER } from '@/common/constants/upload.const';
import { BaseCacheModule } from '@/modules/extensions/cache/cache.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`,
            expandVariables: true,
            isGlobal: true,
            load: [dbConnectionsConfig],
        }),
        ServeStaticModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService) => [
                {
                    rootPath: resolve(configService.get(PUBLIC_FOLDER)),
                },
            ],
        }),
        //RedisModule,
        //BaseCacheModule,
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 30,
            ignoreUserAgents: [
                // Don't throttle request that have 'googlebot' defined in them.
                // Example user agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
                /googlebot/gi,

                // Don't throttle request that have 'bingbot' defined in them.
                // Example user agent: Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)
                new RegExp('bingbot', 'gi'),
            ],
        }),
        UploadModule,
        DatabaseModule,
        AuthModule,
    ],
    providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
    exports: [UploadModule],
})
export class ExtensionsModule {}
