import { Component, OnInit, Input } from '@angular/core';
import { Worry } from 'src/app/models/worry';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { WorryService } from 'src/app/services/worry.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-worry-summary',
  templateUrl: './worry-summary.component.html',
  styleUrls: ['./worry-summary.component.css']
})
export class WorrySummaryComponent implements OnInit {

  @Input() worry: Worry;

  public currentUser: User;

  constructor(userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private worryService: WorryService) 
  {
    this.currentUser = userService.user;
  }

  ngOnInit() {

    
  }

}
