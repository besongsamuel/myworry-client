import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Worry } from 'src/app/models/worry';
import { switchMap, tap } from 'rxjs/operators';
import { WorryService } from 'src/app/worry/services/worry.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AddOpinionComponent } from 'src/app/worry/add-opinion/add-opinion.component';
import { UserService } from 'src/app/services/user.service';
import { Socket } from 'ngx-socket-io';
import { SocketEvent, SocketEventType } from 'src/app/models/socket-event';
import { Crud } from 'src/app/models/crud.enum';
import { Entity } from 'src/app/models/entity.enum';
import { Opinion } from 'src/app/models/opinion';
import * as moment from 'moment';
import { Gender } from 'src/app/models/profile';

@Component({
  selector: 'app-worry',
  templateUrl: './worry.component.html',
  styleUrls: ['./worry.component.scss']
})
export class WorryComponent implements OnInit, OnDestroy {

  worry$: Observable<Worry>;
  worry: Worry;
  expired: boolean = false;

  perLeft;
  perRight;
  perLeftMale;
  perRightMale;
  perLeftFemale;
  perRightFemale;

  canPostOpinion: boolean = false;

  public imagePath: string;

  constructor(private route: ActivatedRoute, private worryService: WorryService,
    public dialog: MatDialog, public userService: UserService,
    private socket: Socket,
    private zone:NgZone)
  {

  }

  getUserProfileImage()
  {
    if(this.worry.user.socialUser)
    {
      return this.worry.user.socialUser.photoUrl;
    }
    else if(this.worry.user.profile && this.worry.user.profile.image)
    {
      return this.worry.user.profile.image;
    }
    else
    {
      return '';
    }

  }



  ngOnInit() {

    this.worry$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.worryService.getWorry(params.get('id')).pipe(tap(async (worry) =>
        {
          this.imagePath = `${environment.ApiUrl}${worry.image}`;
          this.worry = worry;
          this.canPostOpinion = await this.worryService.canPostOpinion(worry.id).toPromise();
          this.expired = moment().isSameOrAfter(moment(this.worry.endDate));
          this.socket.emit(SocketEventType.JOIN_ROOM, worry.id);
          this.generateStatistics(worry);
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

      if(event.Entity == Entity.WORRY)
      {
        this.handleWorryEvent(event);
      }
    });
  }

  toggleLock()
  {
    this.worryService.patchWorry({ id: this.worry.id, locked: !this.worry.locked  }).subscribe(() =>
    {
      this.worry.locked = !this.worry.locked;
      let e: SocketEvent = { Action: Crud.UPDATE, Entity: Entity.WORRY, Id: this.worry.id, roomId: this.worry.id };
      this.socket.emit(SocketEventType.WORRY_EVENT, JSON.stringify(e));

    });
  }

  generateStatistics(worry: Worry)
  {
    this.perLeft = ((worry.opinions.filter(x => x.type == 0).length / worry.opinions.length) * 100).toFixed(2);
    this.perRight = ((worry.opinions.filter(x => x.type == 1).length / worry.opinions.length) * 100).toFixed(2);

    this.perLeftMale = ((worry.opinions.filter(x => x.type == 0 && x.user.profile.gender == Gender.MALE).length / worry.opinions.length) * 100).toFixed(2)
    this.perRightMale = ((worry.opinions.filter(x => x.type == 1 && x.user.profile.gender == Gender.MALE).length / worry.opinions.length) * 100).toFixed(2);

    this.perLeftFemale = ((worry.opinions.filter(x => x.type == 0 && x.user.profile.gender == Gender.FEMALE).length / worry.opinions.length) * 100).toFixed(2)
    this.perRightFemale = ((worry.opinions.filter(x => x.type == 1 && x.user.profile.gender == Gender.FEMALE).length / worry.opinions.length) * 100).toFixed(2);
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

  handleWorryEvent(event: SocketEvent)
  {
    if(event.Id)
    {
      if(event.Action == Crud.UPDATE)
      {
        this.zone.run(() => {
          this.worry$ = this.worryService.getWorry(event.Id).pipe(tap((worry) =>
          {
            this.imagePath = `${environment.ApiUrl}${worry.image}`;
            this.worry = worry;
            this.expired = moment().isSameOrAfter(moment(this.worry.endDate));

          }));
        });
      }
    }
  }

  addOpinion(type: number)
  {
    const dialogRef = this.dialog.open(AddOpinionComponent, {
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

    const dialogRef = this.dialog.open(AddOpinionComponent, {
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
