import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Opinion } from 'src/app/models/opinion';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent as SnackBarComponent, SNACKBAR_DURATION } from 'src/app/dialogs/snack-bar/snack-bar.component';
import { Socket } from 'ngx-socket-io';
import { SocketEvent, SocketEventType } from 'src/app/models/socket-event';
import { Crud } from 'src/app/models/crud.enum';
import { ConfirmationDialogComponent, ConfirmationIconType } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Worry } from 'src/app/models/worry';
import { WorryService } from '../services/worry.service';
import { Profile } from 'src/app/models/profile';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-opinion',
  templateUrl: './opinion.component.html',
  styleUrls: ['./opinion.component.scss']
})
export class OpinionComponent implements OnInit {


  @Input() opinion: Opinion;
  @Input() worry: Worry;
  @Output() removeOpinion = new EventEmitter<string>();
  @Output() editOpinion = new EventEmitter<string>();
  likedByUser: boolean = false;
  public userProfile: Profile;
  opinionBorder : string = '';
  public userProfileImage: string = "";

  constructor(public userService: UserService, private worryService: WorryService, private _snackBar: MatSnackBar,
    private socket: Socket,
    public dialog: MatDialog, 
    public authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.likedByUser = this.opinion.opinionLikes ? this.opinion.opinionLikes.filter(x => this.userService.user && x.userId == this.userService.user.id).length > 0 : false;
    this.userProfile = this.userService.getProfile(this.opinion.user);
    this.opinionBorder = `opinion${this.opinion.type}-border`;
    this.userProfileImage = this.opinion.user.userIdentity.profile.profileImage;
  }

  reply(){}

  toggleLike()
  {

    if(this.authService.loggedIn){
      this.worryService.toggleLike(this.opinion.id).subscribe((response) =>
      {
  
        if(!this.opinion.opinionLikes)
        {
          this.opinion.opinionLikes = [];
        }
  
        if(response.Action == Crud.CREATE)
        {
          this.opinion.opinionLikes.unshift(response.Entity);
          let e: SocketEvent = { Action: Crud.CREATE, Entity: 'OpinionLike', Id: response.Entity.id, roomId: this.opinion.worryId }
          this.socket.emit(SocketEventType.WORRY_EVENT, JSON.stringify(e));
        }
        if(response.Action == Crud.DELETE)
        {
          this.opinion.opinionLikes = this.opinion.opinionLikes.filter(x => x.id != response.Entity.id);
          let e: SocketEvent = { Action: Crud.DELETE, Entity: 'OpinionLike', Id: response.Entity.id, roomId: this.opinion.worryId}
          this.socket.emit(SocketEventType.WORRY_EVENT, JSON.stringify(e));
        }
        this.likedByUser = this.opinion.opinionLikes ? this.opinion.opinionLikes.filter(x => x.userId == this.userService.user.id).length > 0 : false;
  
      }, (err) =>
      {
        this._snackBar.openFromComponent(SnackBarComponent, { duration: SNACKBAR_DURATION, data: { message: err.error.error.message, error: true } })
      });
    }
    else{

      this.authService.requestLogin(this.router.url)

    }

    
  }

  editOpinionClicked(opinion)
  {
    this.editOpinion.emit(opinion.id);
  }

  removeOpinionClicked(opinion: Opinion)
  {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        message: 'Are you sure you want to delete this opinion?',
        title: 'Delete Opinion',
        type: ConfirmationIconType.WARNING
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result)
      {
        this.removeOpinion.emit(opinion.id);
      }
    });
  }

}
