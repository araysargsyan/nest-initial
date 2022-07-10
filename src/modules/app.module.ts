import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TestModule } from './test/test.module';
import { ExtensionsModule } from './extensions/extension.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GlobalValidationPipe } from '@/core/pipes/global-validation.pipe';
import { HttpExceptionFilter } from '@/core/exceptions/http-exception.filter';

import { createClient } from 'redis';
//import * as Redis from 'redis';
import { REDIS } from '@/common/constants/global.const';
import * as session from 'express-session';
import * as RedisStore from 'connect-redis';
import * as passport from 'passport';

function log(type) {
    return function () {
        // eslint-disable-next-line prefer-rest-params
        console.log(type, arguments);
    };
}

const redisClient = createClient({
    //host: 'localhost',
    // port: 6379,
    url: 'redis://127.0.0.1:6379',
    // socket: {
    //     host: 'localhost',
    //     port: 6379,
    //     keepAlive: 10000,
    // },
    //url: 'redis://awesome.redis.server:6379',
    // password: '',
    legacyMode: true,
});
console.log(777, redisClient.options.socket);
redisClient.on('connect', log('connect'));
redisClient.on('ready', log('ready'));
redisClient.on('reconnecting', log('reconnecting'));
redisClient.on('error', log('error11'));
redisClient.on('end', log('end'));
//console.log(redisClient.options.socket);

@Module({
    imports: [ExtensionsModule, UserModule, TestModule],
    providers: [
        {
            provide: APP_PIPE,
            useClass: GlobalValidationPipe,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },

        {
            provide: REDIS,
            useValue: redisClient,
            //useValue: Redis.createClient({ port: 6379, host: 'localhost' }),
        },
    ],
    exports: [REDIS],
})
export class AppModule implements NestModule {
    constructor(@Inject(REDIS) private readonly redis: RedisStore.Client) {}
    configure(consumer: MiddlewareConsumer) {
        // this.redis.on('connect', () => 465465);
        console.log(this.redis.client, 444);

        consumer
            .apply(
                session({
                    //name: 'local',
                    //store: new (RedisStore(session))({ client: this.redis, logErrors: true }),
                    saveUninitialized: false,
                    secret: 'sup3rs3cr3t',
                    resave: false,
                    cookie: {
                        // sameSite: true,
                        // httpOnly: false,
                        maxAge: 14000,
                    },
                }),
                passport.initialize(),
                passport.session(),
            )
            .forRoutes('*');
        //console.log(this.redis, 44444);
    }
}
