import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { HttpCode, HttpException, HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { GlobalTransformerPipe } from './common/pipes/globalTransformerPipe';

async function start() {
    const app = await NestFactory.create(AppModule);
    const configService: ConfigService = app.get(ConfigService);
    const PORT = configService.get('PORT');

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new GlobalTransformerPipe());
    //app.useGlobalFilters(new HttpExceptionFilter())

    app.setGlobalPrefix('api');
    await app.listen(PORT);
    Logger.verbose(await app.getUrl(), 'NestAppUrl');
}

start();
