import { User } from './user';
import { OpinionLike } from './opinion-like';

export class Opinion {
  public type: number;
  public user: User;
  public worryId: string;
  public date_created: string;
  public id: string;
  public userId: string;
  public opinionLikes: OpinionLike[] = [];
}
