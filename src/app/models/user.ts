import { Worry } from './worry';
import { UserIdentity } from './profile';

export class User {

    id: string;

    username: string;

    email: string;

    emailVerified?: boolean;

    userIdentities?: UserIdentity[];

    worries: Worry[];

    roleId: string;

    image?: string;

    constructor(){
        
    }
}
