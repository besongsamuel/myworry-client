import { User } from './user';

export class Opinion {
  public type: number;
  public user: User;
  public worryId: string;
  public date_created: string;
}
