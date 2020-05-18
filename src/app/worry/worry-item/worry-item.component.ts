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

  constructor(userService: UserService)
  {
    this.currentUser = userService.user;

    this.userProfile = userService.getProfile(this.currentUser, null);
  }

  ngOnInit() {


  }

}
