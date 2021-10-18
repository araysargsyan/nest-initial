import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/shared/database/database.module';
import { ApeModule } from './modules/ape/ape.module';
import { dbConnectionsConfig } from './config/ormconfig';
import { AuthModule } from './modules/shared/auth/auth.module';
import { UploadModule } from './modules/shared/upload/upload.module';

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
