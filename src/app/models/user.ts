import { Worry } from './worry';
import { Profile as UserIdentity } from './profile';
import { AuthService } from '../services/auth.service';

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
