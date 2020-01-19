import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Worry } from 'src/app/models/worry';
import { switchMap, tap } from 'rxjs/operators';
import { WorryService } from 'src/app/services/worry.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { NewOpinionDialogComponent } from 'src/app/dialogs/new-opinion-dialog/new-opinion-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { Socket } from 'ngx-socket-io';
import { SocketEvent, SocketEventType } from 'src/app/models/socket-event';
import { Crud } from 'src/app/models/crud.enum';
import { Entity } from 'src/app/models/entity.enum';
import { Opinion } from 'src/app/models/opinion';

@Component({
  selector: 'app-worry',
  templateUrl: './worry.component.html',
  styleUrls: ['./worry.component.css']
})
export class WorryComponent implements OnInit, OnDestroy {

  worry$: Observable<Worry>;
  worry: Worry;

  public imagePath: string;

  constructor(private route: ActivatedRoute, private worryService: WorryService,
    public dialog: MatDialog, public userService: UserService,
    private socket: Socket) 
  {
    
  }

  getImagePath(image)
  {
    return `${environment.ApiUrl}${image}`;
  }

  ngOnInit() {

    this.worry$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.worryService.getWorry(params.get('id')).pipe(tap((worry) => 
        {
          this.imagePath = `${environment.ApiUrl}${worry.image}`; 
          this.worry = worry;
          this.socket.emit(SocketEventType.JOIN_ROOM, worry.id);

        })))

    );

    this.socket.fromEvent(SocketEventType.WORRY_EVENT).subscribe((jsonEvent: string) => {

      var event : SocketEvent = JSON.parse(jsonEvent);

      if(event.Entity == Entity.OPINION_LIKE)
      {
        this.handleLikeEvent(event);
      }

      if(event.Entity == Entity.OPINION)
      {
        this.handleOpinionEvent(event);
      }
    });
  }

  ngOnDestroy(): void {
    this.socket.emit(SocketEventType.LEAVE_ROOM, this.worry.id);
  }

  handleLikeEvent(event: SocketEvent)
  {
    if(event.Id)
    {
      if(event.Action == Crud.DELETE)
      {
        this.worry.opinions = this.worry.opinions.map((opinion) => 
        {
          if(!opinion.opinionLikes)
          {
            opinion.opinionLikes = [];
          }

          opinion.opinionLikes = opinion.opinionLikes.filter(x => x.id != event.Id);

          return opinion;
        });
        
      }
      else if(event.Action == Crud.CREATE)
      {
        this.worryService.getOpinionLike(event.Id).subscribe((like) => 
        {
          this.worry.opinions = this.worry.opinions.map((opinion) => 
          {

            if(!opinion.opinionLikes)
            {
              opinion.opinionLikes = [];
            }

            if(like.opinionId == opinion.id)
            {
              opinion.opinionLikes.unshift(like);
            }

            return opinion;
          });

        });
      }
    }
  }

  handleOpinionEvent(event: SocketEvent)
  {
    if(event.Id)
    {
      if(event.Action == Crud.DELETE)
      {
        this.worry.opinions = this.worry.opinions.filter(x => x.id != event.Id);
      }
      else
      {
        this.worryService.getOpinion(event.Id).subscribe((opinion) => 
        {
          this.worry.opinions = this.worry.opinions.filter(x => x.id != event.Id);
          this.worry.opinions.unshift(opinion);
        });
      }
    }
  }

  addOpinion(type: number)
  {
    const dialogRef = this.dialog.open(NewOpinionDialogComponent, {
      width: '450px',
      data: {worry: this.worry, initialValue: type}
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result)
      {
        if(!this.worry.opinions)
        {
          this.worry.opinions = [];
        }

        let e: SocketEvent = { Action: Crud.CREATE, Entity: Entity.OPINION, Id: result.id, roomId: this.worry.id };
        this.socket.emit(SocketEventType.WORRY_EVENT, JSON.stringify(e));

        // get the created opinion with it's relations
        this.worryService.getOpinion(result.id).subscribe((opinion) => 
        {
          this.worry.opinions.unshift(opinion);
        });
        
      }
    });
  }

  onOpinionEdit(id: string)
  {
    let opinion: Opinion = this.worry.opinions.find(x => x.id == id);

    const dialogRef = this.dialog.open(NewOpinionDialogComponent, {
      data: {worry: this.worry, initialValue: opinion.type, opinion: opinion}
    });

    dialogRef.afterClosed().subscribe(newOpinion => {

      if(newOpinion)
      {

        // get the created opinion with it's relations
        this.worryService.getOpinion(newOpinion.id).subscribe((opinion) => 
        {
          this.worry.opinions = this.worry.opinions.filter(x => x.id != opinion.id);
          this.worry.opinions.unshift(opinion);

          let e: SocketEvent = { Action: Crud.REPLACE, Entity: Entity.OPINION, Id: newOpinion.id, roomId: this.worry.id };
          this.socket.emit(SocketEventType.WORRY_EVENT, JSON.stringify(e));
        });
        
      }
    });
  }

  onOpinionRemoved(id: string)
  {
    if(!this.worry.opinions)
    {
      this.worry.opinions = [];
    }

    let e: SocketEvent = { Action: Crud.DELETE, Entity: Entity.OPINION, Id: id, roomId: this.worry.id };
    this.socket.emit(SocketEventType.WORRY_EVENT, JSON.stringify(e));

    this.worryService.deleteOpinion(id).subscribe(() => 
    {
      this.worry.opinions = this.worry.opinions.filter(x => x.id != id);
    });
  }
}
