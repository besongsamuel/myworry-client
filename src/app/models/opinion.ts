import { User } from './user';
import { OpinionLike } from './opinion-like';
import { Reply } from './reply'
 
export class Opinion {
  public type: number;
  public user: User;
  public worryId: string;
  public date_created: string;
  public id: string;
  public text: string;
  public userId: string;
  public replies: Reply[] = [];
  public opinionLikes: OpinionLike[] = [];
}
