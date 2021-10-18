import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ApeModule } from './ape/ape.module';
import { ExtensionsModule } from './extensions';

@Module({
    imports: [ExtensionsModule, UserModule, ApeModule],
})
export class AppModule {}
