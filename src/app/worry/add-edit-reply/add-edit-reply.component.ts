
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Opinion } from 'src/app/models/opinion';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { WorryService } from '../services/worry.service';
import { SocketEvent, SocketEventType } from 'src/app/models/socket-event';
import { Crud } from 'src/app/models/crud.enum';
import { Entity } from 'src/app/models/entity.enum';
import { Socket } from 'ngx-socket-io';
import { AuthService } from 'src/app/services/auth.service';
import { Reply } from 'src/app/models/reply';
import { User } from 'src/app/models/user';
import * as _ from "lodash";

@Component({
  selector: 'app-add-edit-reply',
  templateUrl: './add-edit-reply.component.html',
  styleUrls: ['./add-edit-reply.component.scss']
})
export class AddEditReplyComponent implements OnInit {


  @Output() onClose = new EventEmitter();

  @Output() onReplyAdded = new EventEmitter();

  /**
   * The opinion being repliedt
   */
  @Input() opinion: Opinion;

  /**
   * The reply being repliedt
   */
  @Input() parentReply: Reply;

  @Input() reply: Reply;

  replyElement: any;

  addReplyError?: string;

  owner: User;

  constructor(public userService: UserService,
  public dialog: MatDialog, 
  private socket: Socket,
  public authService: AuthService,
  private worryService: WorryService) { }

  ngOnInit(): void {


    if(this.opinion){
      this.owner = this.opinion.user;
    }

    if(this.parentReply){
      this.owner = this.parentReply.user;
    }

    if(!this.reply){
      this.reply = new Reply({ text: '', opinionId: this.opinion.id});
    }

    this.replyElement = (<any>$(".reply-area")).emojioneArea();

    if(this.reply){
      this.replyElement.data("emojioneArea").setText(this.reply.text);
    }
  }

  cancel(){
    this.onClose.emit();
  }

  submitReply(){

    this.reply.text = this.replyElement.data("emojioneArea").getText();

    this.worryService.createOrEditReply(_.omit(this.reply, 'user')).subscribe((newReply: Reply) =>
    {

      if(!this.opinion.replies)
      {
        this.opinion.replies = [];
      }

      if(this.reply.id)
      {
        let index = this.opinion.replies.findIndex(x => x.id == this.reply.id);
        this.opinion.replies[index] = newReply;

        let e: SocketEvent = { Action: Crud.UPDATE, Entity: Entity.REPLY, Id: newReply.id, roomId: this.opinion.worryId };
        this.socket.emit(SocketEventType.WORRY_EVENT, JSON.stringify(e));
      }
      else
      {
        this.opinion.replies.unshift(newReply);
        
        let e: SocketEvent = { Action: Crud.CREATE, Entity: Entity.REPLY, Id: newReply.id, roomId: this.opinion.worryId };
        this.socket.emit(SocketEventType.WORRY_EVENT, JSON.stringify(e));
      }

      this.onReplyAdded.emit(newReply);

    },
    err =>
    {
      this.addReplyError = err.error.error.message;
    })
  }

}
