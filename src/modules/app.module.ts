import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TestModule } from './test/test.module';
import { ExtensionsModule } from './extensions';
import { APP_PIPE } from '@nestjs/core';
import { GlobalValidationPipe } from '@/core/pipes/global-validation.pipe';

@Module({
    providers: [
        {
            provide: APP_PIPE,
            useClass: GlobalValidationPipe,
        },
    ],
    imports: [ExtensionsModule, UserModule, TestModule],
})
export class AppModule {}
