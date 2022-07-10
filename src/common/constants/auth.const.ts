import { SocialAuthStrategyEnum } from '@/common/enums/core';
import { AuthEnum, SocialAuthEnum } from '../enums/auth.enum';

//! ENV
export const JWT_KEY = 'JWT_KEY' as const;
export const JWT_EXPIRES_IN = 'JWT_EXPIRES_IN' as const;
export const FB_APP_SECRET = 'FB_APP_SECRET' as const;
export const FB_APP_ID = 'FB_APP_ID' as const;
export const GOOGLE_APP_SECRET = 'GOOGLE_APP_SECRET' as const;
export const GOOGLE_APP_ID = 'GOOGLE_APP_ID' as const;

//! CORE
export const socialAuthStrategy: SocialAuthStrategyEnum = SocialAuthStrategyEnum.SPLIT;
export const CACHE_SOCIAL_USER = 'CACHE_SOCIAL_USER' as const;
export const AuthStrategies = { SOCIAL: { ...SocialAuthEnum } as const, ...AuthEnum } as const;
