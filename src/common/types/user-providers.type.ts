import { AuthEnum } from '@/common/enums/auth.enum';
import { UserProviderInterface } from '@/common/interfaces/user-providers.interface';

export type UserProvidersType = {
    [key in AuthEnum]: UserProviderInterface | null;
};
