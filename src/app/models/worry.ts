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
      
      labelFor: string;
      
      labelAgainst: string;
      
      startDate: Date;
      
      endDate: Date;
      
      date_created: Date;
      
      date_modified: Date;
}
