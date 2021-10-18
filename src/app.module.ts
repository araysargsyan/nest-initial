import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { DbConnectionModule } from './database/database.module';
import { ApeModule } from './modules/ape/ape.module';
import { dbConnectionsConfig } from './config/ormconfig';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';

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
        DbConnectionModule,
        UserModule,
        ApeModule,
        AuthModule,
    ],
    exports: [UploadModule],
})
export class AppModule {}
