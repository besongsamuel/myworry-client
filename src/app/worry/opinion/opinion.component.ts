import { Component, OnInit, Input } from '@angular/core';
import { Opinion } from 'src/app/models/opinion';
import { UserService } from 'src/app/services/user.service';
import { WorryService } from 'src/app/services/worry.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackBarComponent, SNACKBAR_DURATION } from 'src/app/dialogs/error-snack-bar/error-snack-bar.component';

@Component({
  selector: 'app-opinion',
  templateUrl: './opinion.component.html',
  styleUrls: ['./opinion.component.css']
})
export class OpinionComponent implements OnInit {

  @Input() opinion: Opinion;
  likedByUser: boolean = false;

  constructor(private userService: UserService, private worryService: WorryService, private _snackBar: MatSnackBar) { }

  ngOnInit() {

    console.log(this.opinion);

    this.likedByUser = this.opinion.opinionLikes ? this.opinion.opinionLikes.filter(x => x.userId == this.userService.user.id).length > 0 : false;

  }

  getImagePath(image)
  {
    return `${environment.ApiUrl}${image}`;
  }

  toggleLike()
  {
    this.worryService.toggleLike(this.opinion.id).subscribe((opinionLikes) =>
    {
      this.opinion.opinionLikes = opinionLikes;
      this.likedByUser = this.opinion.opinionLikes ? this.opinion.opinionLikes.filter(x => x.userId == this.userService.user.id).length > 0 : false;

    }, (err) => 
    {
      this._snackBar.openFromComponent(ErrorSnackBarComponent, { duration: SNACKBAR_DURATION, data: { message: err.error.error.message } })
    });
  }

}
