import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { dbConnectionsConfig } from '../../config/ormconfig';
import { UploadModule } from './upload/upload.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`,
            expandVariables: true,
            isGlobal: true,
            load: [dbConnectionsConfig],
        }),
        UploadModule,
        DatabaseModule,
        AuthModule,
    ],
    exports: [UploadModule], //!
})
export class ExtensionsModule {}
