import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';

(async function start() {
    const app = await NestFactory.create(AppModule);
    const configService: ConfigService = app.get(ConfigService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    //app.useGlobalPipes(new GlobalTransformerPipe());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    //app.useGlobalFilters(new HttpExceptionFilter())
    app.setGlobalPrefix(configService.get('APP_PREFIX'));

    await app.listen(configService.get('APP_PORT'));
    Logger.verbose(await app.getUrl(), 'NestAppUrl');
})();
