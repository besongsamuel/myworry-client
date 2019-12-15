import { Worry } from './worry';

export class User {
    
    id: string;
    
    username: string;
    
    email: string;

    firstName: string;

    lastName: string;
    
    emailVerified?: boolean;

    displayName?: string;

    profile?: string;

    worries: Worry[];
    
    roleId: string;
}
