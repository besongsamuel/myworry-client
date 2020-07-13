import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Worry } from 'src/app/models/worry';
import { AuthService } from 'src/app/services/auth.service';
import { WorryService } from '../services/worry.service';
import { SocketEvent, SocketEventType } from 'src/app/models/socket-event';
import { Crud } from 'src/app/models/crud.enum';
import { Socket } from 'ngx-socket-io';
import { Entity } from 'src/app/models/entity.enum';
import { Opinion } from 'src/app/models/opinion';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-worry-opinion',
  templateUrl: './add-worry-opinion.component.html',
  styleUrls: ['./add-worry-opinion.component.scss']
})
export class AddWorryOpinionComponent implements OnInit {

  @Input() worry : Worry;

  opinions: any[] = [];
  @Input() selectedOpinion: any;
  @Input() opinion?: Opinion;
  opinionBorder : string;
  addOpinionError: string;
  
  @Output() onOpinionAdded  = new EventEmitter();
  @Output() onClose = new EventEmitter();
  commentElement : any;

  constructor(public authService: AuthService, 
    private worryService: WorryService, 
    private socket: Socket,
    public dialog: MatDialog) { }

  ngOnInit(): void {

    this.commentElement = (<any>$(".opinion-reply-area")).emojioneArea();

    if(this.opinion){
      this.commentElement.data("emojioneArea").setText(this.opinion.text);
    }

    this.opinionBorder = `opinion${this.selectedOpinion}-border`;

    this.opinions = [];

    for(var i = 1; i < 5; i++){

      if(this.worry[`opinion${i}Label`]){
        this.opinions.push({
          value: i,
          display: this.worry[`opinion${i}Label`]
        });
      }
      
    }

    this.opinionSelectionChanged({
      value: this.selectedOpinion
    });
  } 

  opinionSelectionChanged(event){

    this.opinionBorder = `opinion${this.selectedOpinion}-border`;

    for(var i = 1; i < 5; i++){

      $('.select-opinion .mat-form-field-underline').removeClass(`opinion${i}-button-background`);
      $('.select-opinion .mat-form-field-ripple').removeClass(`opinion${i}-button-background`);
    }

    $('.select-opinion .mat-form-field-underline').addClass(`opinion${event.value}-button-background`);
    $('.select-opinion .mat-form-field-ripple').addClass(`opinion${event.value}-button-background`);
  }

  cancel(){
    this.onClose.emit();
  }

  submitOpinion(){

    let opinion : any = {
      text: this.commentElement.data("emojioneArea").getText(),
      type: this.selectedOpinion,
      worryId: this.worry.id,
      userId: this.authService.user.id

    };

    if(this.opinion){
      opinion.id = this.opinion.id;
    }

    this.worryService.createOrEditOpinion(opinion).subscribe((newOpinion) =>
    {
      if(!this.worry.opinions)
      {
        this.worry.opinions = [];
      }

      // get the created opinion with it's relations
      this.worryService.getOpinion(newOpinion.id).subscribe((opinion) =>
      {
        
        if(this.opinion)
        {
          let index = this.worry.opinions.findIndex(x => x.id == this.opinion.id);
          this.worry.opinions[index] = opinion;

          let e: SocketEvent = { Action: Crud.UPDATE, Entity: Entity.OPINION, Id: newOpinion.id, roomId: this.worry.id };
          this.socket.emit(SocketEventType.WORRY_EVENT, JSON.stringify(e));
        }
        else
        {
          this.worry.opinions.unshift(opinion);
          
          let e: SocketEvent = { Action: Crud.CREATE, Entity: Entity.OPINION, Id: newOpinion.id, roomId: this.worry.id };
          this.socket.emit(SocketEventType.WORRY_EVENT, JSON.stringify(e));
        }

        this.onOpinionAdded.emit(opinion);

      });

    },
    err =>
    {
      this.addOpinionError = err.error.error.message;
    })
  }

}
