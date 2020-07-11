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


@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {

  @Input() reply: Reply;
  @Input() worry: Worry;
  @Output() removeReply = new EventEmitter<string>();
  @Output() editReply = new EventEmitter<string>();
  public userProfile: Profile;
  public userProfileImage: string = "";
  public Reply?: Reply;

  constructor(public userService: UserService, 
    private worryService: WorryService, 
    private _snackBar: MatSnackBar,
    private socket: Socket,
    public dialog: MatDialog, 
    public authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.userProfile = this.userService.getProfile(this.reply.user);
    this.userProfileImage = this.reply.user.userIdentity.profile.profileImage;
  }

  replyAdded(reply){
    this.Reply = null;
  }

  replyClosed(){
    this.Reply = null;
  }

  addReply(){
    this.Reply = new Reply({ 
      text: "", 
      type: 1,
      replyId: this.reply.id, 
      userId: this.authService.user.id })
  }


  editReplyClicked(reply)
  {
    this.editReply.emit(reply.id);
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
        this.removeReply.emit(reply.id);
      }
    });
  }

}
