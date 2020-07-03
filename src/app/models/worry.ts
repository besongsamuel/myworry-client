import { Opinion } from './opinion';
import * as moment from 'moment';
import { User } from './user';
import { WorryShare } from './worry-share';
import { WorrySubscription } from '../worry-subscription';

export class Worry {

    id: string;

    userId: string = null;

    user: User;

    isPrivate: boolean;

    subscriptions: WorrySubscription[];

    isAnonymous: boolean;

    name: string = '';

    opinions: Opinion[];

    description?: string = '';

    locked?: boolean = false;

    tags?: string[] = [];

    image: string = '';

    opinion1Label: string = 'Yes';

    opinion2Label: string = 'No';

    opinion3Label?: string = 'Maybe';

    opinion4Label?: string = 'Neutral';

    startDate: any;

    endDate: any;

    date_created: Date;

    date_modified: Date;

    worryShares: WorryShare[];

    constructor()
    {
      this.startDate = moment().format('YYYY-MM-DD hh:mm:ss');
      this.endDate = moment().add(30, 'days').format('YYYY-MM-DD hh:mm:ss');

    }
}
