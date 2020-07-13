import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Worry } from 'src/app/models/worry';
import { Profile } from 'src/app/models/profile';
import { UserService } from 'src/app/services/user.service';
import { WorryService } from '../services/worry.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent, ConfirmationIconType } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Reply } from 'src/app/models/reply';
import { Opinion } from 'src/app/models/opinion';


@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {

  @Input() reply: Reply;
  @Input() parent: Reply;
  @Input() opinion: Opinion;
  @Input() worry: Worry;
  @Output() removeReply = new EventEmitter<string>();
  @Output() editReply = new EventEmitter<string>();
  public userProfile: Profile;
  public userProfileImage: string = "";
  public userReply?: Reply;

  constructor(public userService: UserService, 
    public dialog: MatDialog, 
    public authService: AuthService,
    private worryService: WorryService) { }

  ngOnInit() {
    this.userProfile = this.userService.getProfile(this.reply.user);
    this.userProfileImage = this.reply.user.userIdentity.profile.profileImage;
  }

  replyAdded(reply){
    this.userReply = null;
  }

  replyClosed(){
    this.userReply = null;
  }

  addReply(){
    this.userReply = new Reply({ 
      text: "", 
      type: 1,
      replyId: this.reply.id, 
      opinionId: this.opinion.id,
      userId: this.authService.user.id });
  }


  editReplyClicked(reply)
  {
    this.editReply.emit(reply);
  }

  removeReplyClicked(reply: Reply)
  {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        message: 'Are you sure you want to delete this reply?',
        title: 'Delete Reply',
        type: ConfirmationIconType.WARNING
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result)
      {

        this.worryService.deleteReply(reply.id).subscribe(() => {
          this.removeReply.emit(reply.id);
        });

      }
    });
  }

}
