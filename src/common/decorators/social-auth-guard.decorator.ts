import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { SocialAuthGuard } from '@/core/guards/soical-auth.guard';
import { SocialAuthEnum } from '../enums/auth.enum';

export function UseSocialAuthGuard() {
    for (const strategy of Object.values(SocialAuthEnum)) {
        SocialAuthGuard.create(strategy);
    }

    return applyDecorators(...SocialAuthGuard.activate());
}
