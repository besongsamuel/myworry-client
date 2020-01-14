import { Worry } from './worry';
import { Profile } from './profile';

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
}
