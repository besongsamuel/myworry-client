import { User } from './user';

export class Reply {

    id?: string;

    text: string;

    /**
     * The user that replied
     */
    userId: string;

    /**
     * The user that replied
     */
    user: User;

    /**
     * The opinion
     */
    opinionId: string;

    /**
     * The type of reply 
     * 0: This is a reply to an opinion
     * 1: This is a reply to a user. If the type is 1, replyId must be set
     */
    type: number;

    /**
     * The Id of the opinion reply the user replied to
     */
    replyId: string;
    
    /**
     * The reply that was responded to. 
     * This is only when the type is 1
     */
    reply: Reply;

    /**
     * Replies made to this reply
     */
    replies: Reply[];

    /**
     * The date the opinion was created
     */
    date_created: Date;

    /**
     * The date the opinion was modified
     */
    date_modified: Date;

    constructor(reply: Partial<Reply>){

        for(var x in reply){
            this[x] = reply[x];
        }
        
    }
}
