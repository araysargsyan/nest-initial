import { AuthEnum } from '@common/enums/auth.enum';

export interface UserProviderInterface {
    providerId: string | number;
}
export type UserProvidersType = {
    [key in AuthEnum]: UserProviderInterface | null;
};
