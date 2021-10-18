import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './extensions/database/database.module';
import { ApeModule } from './ape/ape.module';
import { dbConnectionsConfig } from '../config/ormconfig';
import { AuthModule } from './extensions/auth/auth.module';
import { UploadModule } from './extensions/upload/upload.module';

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
