import { Worry } from './worry';
import { Profile } from './profile';
import { SocialUser } from 'angularx-social-login';

export class User {

    id: string;

    username: string;

    email: string;

    firstName: string;

    lastName: string;

    emailVerified?: boolean;

    displayName?: string;

    profile?: Profile;

    worries: Worry[];

    roleId: string;

    socialUser?: SocialUser;

    tmpImage?: string;

}
