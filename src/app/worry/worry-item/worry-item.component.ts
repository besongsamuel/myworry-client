import { Component, OnInit, Input } from '@angular/core';
import { Worry } from 'src/app/models/worry';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';
import * as moment from 'moment'

@Component({
  selector: 'app-worry-item',
  templateUrl: './worry-item.component.html',
  styleUrls: ['./worry-item.component.scss']
})
export class WorryItemComponent implements OnInit {

  @Input() worry: Worry;

  public currentUser: User;

  public userProfile: Profile;

  public userProfileImage: string  = "";

  public startDate: string;

  public endDate: string;

  constructor(public userService: UserService)
  {
    
  }

  ngOnInit() {

    if(this.worry)
    {
      this.userProfile = this.userService.getProfile(this.worry.user);
    }

    this.userProfileImage = this.worry.user.userIdentity.profile.profileImage;

    this.startDate = moment(this.worry.startDate, 'YYYY-MM-DD hh:mm:ss').format();
    this.endDate = moment(this.worry.endDate, 'YYYY-MM-DD hh:mm:ss').format();
    
  }

}
