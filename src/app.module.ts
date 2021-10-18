import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/core/database/database.module';
import { ApeModule } from './modules/ape/ape.module';
import { dbConnectionsConfig } from './config/ormconfig';
import { AuthModule } from './modules/core/auth/auth.module';
import { UploadModule } from './modules/core/upload/upload.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`,
            expandVariables: true,
            isGlobal: true,
            load: [dbConnectionsConfig],
        }),
        UploadModule,
        DatabaseModule,
        UserModule,
        ApeModule,
        AuthModule,
    ],
    exports: [UploadModule],
})
export class AppModule {}
