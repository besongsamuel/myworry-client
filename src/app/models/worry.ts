import { Opinion } from './opinion';

export class Worry {
    
      id: string;
      
      categoryId: string;
    
      userId: string;
      
      name: string;
    
      opinions: Opinion[];
     
      description?: string;
      
      locked?: boolean;
    
      tags?: string[];

      image: string;
      
      labelFor: string;
      
      labelAgainst: string;
      
      startDate: any;
      
      endDate: any;
      
      date_created: Date;
      
      date_modified: Date;
}
