import { Component, OnInit, Input } from '@angular/core';
import { Worry } from 'src/app/models/worry';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Profile } from 'src/app/models/profile';

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

  constructor(private userService: UserService)
  {
    
  }

  ngOnInit() {

    if(this.worry)
    {
      this.currentUser = this.userService.user;
      this.userProfile = this.userService.getProfile(this.worry.user);
    }

    this.userProfileImage = this.worry.user.userIdentity.profile.profileImage;

    if(this.userProfileImage == "" || !this.userProfileImage){
      // Set the default one
    }
    
  }

}
