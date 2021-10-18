import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { HttpCode, HttpException, HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { GlobalTransformerPipe } from './core/pipes/globalTransformerPipe';

async function start() {
    const app = await NestFactory.create(AppModule);
    const configService: ConfigService = app.get(ConfigService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new GlobalTransformerPipe());
    //app.useGlobalFilters(new HttpExceptionFilter())

    app.setGlobalPrefix(configService.get('APP_PREFIX'));
    await app.listen(configService.get('APP_PORT'));
    Logger.verbose(await app.getUrl(), 'NestAppUrl');
}

start();
