import { Component, OnInit, Input } from '@angular/core';
import { Opinion } from 'src/app/models/opinion';
import { UserService } from 'src/app/services/user.service';
import { WorryService } from 'src/app/services/worry.service';

@Component({
  selector: 'app-opinion',
  templateUrl: './opinion.component.html',
  styleUrls: ['./opinion.component.css']
})
export class OpinionComponent implements OnInit {

  @Input() opinion: Opinion;

  constructor(private userService: UserService, private worryService: WorryService) { }

  ngOnInit() {

    console.log(this.opinion);
  }

  likedByUser()
  {
    this.opinion.opinionLikes.filter(x => x.userId == this.userService.user.id);
  }

  toggleLike()
  {
    this.worryService.toggleLike(this.opinion.id).subscribe((opinionLikes) =>
    {
      this.opinion.opinionLikes = opinionLikes;
    });
  }

}
