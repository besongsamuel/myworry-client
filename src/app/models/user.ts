import { Worry } from './worry';
import { UserIdentity } from './profile';

export class User {

    id: string;

    username: string;

    email: string;

    emailVerified?: boolean;

    userIdentity: UserIdentity;

    worries: Worry[];

    roleId: string;

    constructor(){
        
    }
}

export class SignupUser {

    username: string;

    email: string;

    image: string;

    givenName: string;

    familyName: string;

    password: string;

    constructor(){
        
    }
}
