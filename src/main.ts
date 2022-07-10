import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { APP_PORT, APP_PREFIX } from '@/common/constants/global.const';
import { ResponseInterceptor } from '@/core/interceptors/response.interceptor';

import * as session from 'express-session';
import * as passport from 'passport';
import * as createRedisStore from 'connect-redis';
import { createClient } from 'redis';

(async function start() {
    const app = await NestFactory.create(AppModule);
    const configService: ConfigService = app.get(ConfigService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    //app.useGlobalPipes(new GlobalTransformerPipe());
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
    //app.useGlobalFilters(new HttpExceptionFilter());
    app.setGlobalPrefix(configService.get(APP_PREFIX, ''));

    const RedisStore = createRedisStore(session);

    const redisClient = createClient({ url: 'redis://alice:foobared@awesome.redis.server:6380' });

    // app.use(
    //     session({
    //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //         // @ts-ignore
    //         //store: new (RedisStore(session))({ client: createClient({ port: 6379, host: 'localhost' }), logErrors: true }),
    //         //store: new RedisStore({ client: redisClient }),
    //         name: 'local',
    //         saveUninitialized: true,
    //         secret: 'sup3rs3cr3t',
    //         resave: false,
    //         cookie: {
    //             sameSite: true,
    //             httpOnly: false,
    //             maxAge: 60000,
    //         },
    //     }),
    // );
    //
    // app.use(passport.initialize());
    // app.use(passport.session());

    await app.listen(configService.get(APP_PORT));
    Logger.verbose(await app.getUrl(), 'NestAppUrl');
})();
