import { Opinion } from './opinion';
import * as moment from 'moment';

export class Worry {

    id: string = null;

    categoryId: string;

    userId: string = null;

    name: string = '';

    opinions: Opinion[] = [];

    description?: string = '';

    locked?: boolean = false;

    tags?: string[] = [];

    image: string = '';

    labelFor: string = 'Yes';

    labelAgainst: string = 'No';

    startDate: any;

    endDate: any;

    date_created: Date;

    date_modified: Date;

    constructor()
    {
      this.startDate = moment().format('YYYY-MM-DD hh:mm:ss');
      this.endDate = moment().add(30, 'days').format('YYYY-MM-DD hh:mm:ss');

    }
}
