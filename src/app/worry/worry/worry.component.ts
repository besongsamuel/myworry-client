import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Worry } from 'src/app/models/worry';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { WorryService } from 'src/app/worry/services/worry.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { UserService, VAPID_PUBLIC_KEY } from 'src/app/services/user.service';
import { Socket } from 'ngx-socket-io';
import { SocketEvent, SocketEventType } from 'src/app/models/socket-event';
import { Crud } from 'src/app/models/crud.enum';
import { Entity } from 'src/app/models/entity.enum';
import { Opinion } from 'src/app/models/opinion';
import * as moment from 'moment';
import { Gender } from 'src/app/models/profile';
import { WorryShareComponent } from '../worry-share/worry-share.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACKBAR_DURATION, SnackBarComponent } from 'src/app/dialogs/snack-bar/snack-bar.component';
import { HttpErrorResponse } from '@angular/common/http';
import { WorryStatsDialogComponent } from '../worry-stats-dialog/worry-stats-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { LoginDialogComponent } from 'src/app/account/login-dialog/login-dialog.component';
import { SwPush } from '@angular/service-worker';
import { DEFAULT_IMAGE } from 'src/app/home/home.component';
import { WorrySubscription } from 'src/app/worry-subscription';
import { HEADER_OFFSET } from 'src/app/app.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-worry',
  templateUrl: './worry.component.html',
  styleUrls: ['./worry.component.scss']
})
export class WorryComponent implements OnInit, OnDestroy {


  worry$: Observable<Worry>;
  worry: Worry;
  expired: boolean = false;
  unauthorized: string = '';

  stats: any[] = [];

  canPostOpinion: boolean = false;

  public imagePath: string;

  public userProfileImage : string = "";

  public startDate: string;
  public endDate: string;
  public subscribedTo: boolean = false;

  selectedOpinion: any;
  addingOpinion: boolean = false;
  editingOpinion?: Opinion;

  constructor(private route: ActivatedRoute, private router: Router, private worryService: WorryService,
    public dialog: MatDialog, public userService: UserService,
    private socket: Socket,
    private zone:NgZone, 
    private _snackBar: MatSnackBar,
    public authService: AuthService,
    private swPush: SwPush,
    private title: Title, 
    private meta: Meta)
  {

  }

  gotoLogin(){
    this.router.navigate(['/login']);
  }

  gotoSignup(){
    this.router.navigate(['/signup']);
  }

  disableNotifications(){

    this.swPush.subscription.subscribe((sub) => {

      if(sub){
        this.worryService.unsubscribeFromWorry(sub.endpoint).subscribe(() => {
          this.subscribedTo = false;
        });
      }
      else{
        this.subscribedTo = false;
      }
    });
  }

  enableNotifications(){
    this.swPush.requestSubscription({
      serverPublicKey: VAPID_PUBLIC_KEY
    }).then((sub) => {
      this.worryService.subscribeToWorry({ worryId: this.worry.id, subscription: sub }).subscribe(() => {
        this.subscribedTo = true;
      }, (err : any) => {
        console.error("Could not subscribe to notification", err);
        this._snackBar.openFromComponent(SnackBarComponent, { duration: SNACKBAR_DURATION, data: { message: 'A server error occured while saving subscription.', error: true } });
      });
    }).catch((err) => {
      console.error("Could not subscribe to notification", err);
      this._snackBar.openFromComponent(SnackBarComponent, { duration: SNACKBAR_DURATION, data: { message: 'Please enable notifications from browser settings.', error: true } });

    });   
  }

  

  getUserProfileImage()
  {
    return this.userService.getProfileImage(this.worry.user);
  }



  ngOnInit() {

    let id = this.route.snapshot.paramMap.get('id');

    this.worryService.getWorry(id).subscribe(async (worry : Worry) =>
    {
      this.worry$ = of(worry);

      this.swPush.subscription.subscribe((sub) => {

        if(sub){
          if(worry.subscriptions && worry.subscriptions.find((s: WorrySubscription) => s.subscription.endpoint == sub.endpoint)){
            this.subscribedTo = true;
          }
        }
        else{
          this.subscribedTo = false;
        }
      });

      this.meta.updateTag({ property: 'og:title', content: worry.name });
      this.meta.updateTag({ property: 'og:description', content: worry.description });
      this.meta.updateTag({ property: 'og:url', content: `https://www.myworry.ca/en/worry/${worry.id}` });
      this.meta.updateTag({ property: 'og:type', content: `website` });
      this.meta.updateTag({ property: 'og:image', content: worry.image });

      this.title.setTitle(worry.name);

      this.imagePath = `${environment.ApiUrl}${worry.image}`;
      this.userProfileImage = worry.user.userIdentity.profile.profileImage;
      this.worry = worry;
      if(!worry.image){
        worry.image = DEFAULT_IMAGE;
      }
      this.startDate = moment(this.worry.startDate, 'YYYY-MM-DD hh:mm:ss').format();
      this.endDate = moment(this.worry.endDate, 'YYYY-MM-DD hh:mm:ss').format();
      this.canPostOpinion = await this.worryService.canPostOpinion(worry.id).toPromise();
      this.expired = moment().isSameOrAfter(moment(this.worry.endDate, 'YYYY-MM-DD hh:mm:ss'));
      this.socket.emit(SocketEventType.JOIN_ROOM, worry.id);
      this.generateStatistics(worry);
      }, (httpErrorResponse: HttpErrorResponse) => { 

        this.unauthorized = 'UNAUTHORIZED_ACCESS';
       
        throw httpErrorResponse;
      });

    /* this.socket.fromEvent(SocketEventType.WORRY_EVENT).subscribe((jsonEvent: string) => {

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
    }); */
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
    if(worry.opinions)
    {
      let stats = [];

      for(var i = 0; i < 4; i++){

        stats[i] = {
          percentage : ((worry.opinions.filter(x => x.type == i + 1).length / worry.opinions.length) * 100).toFixed(2),
          percentageMale: ((worry.opinions.filter(x => x.type == i + 1 && this.userService.getProfile(x.user).gender == Gender.MALE).length / worry.opinions.length) * 100).toFixed(2),
          percentageFemale: ((worry.opinions.filter(x => x.type == i + 1 && this.userService.getProfile(x.user).gender == Gender.FEMALE).length / worry.opinions.length) * 100).toFixed(2),
          label: worry[`opinion${i + 1}Label`]
        }
      }

      this.stats = stats;
    }
    
  }

  ngOnDestroy(): void {
    if(this.worry){
      this.socket.emit(SocketEventType.LEAVE_ROOM, this.worry.id);
    }
    
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

  viewStats(){
    const dialogRef = this.dialog.open(WorryStatsDialogComponent, {
      width: '90%',
      height: '80%',
      data: this.worry
    });
  }

  cancelAddOpinion(added){

    this.addingOpinion = false;
    this.selectedOpinion = null;
    this.editingOpinion = null;

    if(added){
      setTimeout(() => {
        $([document.documentElement, document.body]).animate({
          scrollTop: HEADER_OFFSET
        }, 100);
      }, 10);
    }
    
  }

  addOpinion(type: number)
  {

    if(this.userService.authService.loggedIn){

      this.addingOpinion = true;

      this.selectedOpinion = type;

      setTimeout(() => {
        $([document.documentElement, document.body]).animate({
          scrollTop: $(".addOpinionContainer").offset().top - HEADER_OFFSET
        }, 500);
      }, 10);

      return;
    }
  }

  onOpinionEdit(id: string)
  {
    let opinion: Opinion = this.worry.opinions.find(x => x.id == id);

    this.editingOpinion = opinion;

    this.selectedOpinion = opinion.type;

    setTimeout(() => {
      $([document.documentElement, document.body]).animate({
        scrollTop: $(".addOpinionContainer").offset().top  - HEADER_OFFSET
      }, 500);
    }, 10);
    
  }

  share(){
    const dialogRef = this.dialog.open(WorryShareComponent, {
      width: '550px',
      data: {worry: this.worry}
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result)
      {
        this.worry.worryShares = result;
        this._snackBar.openFromComponent(SnackBarComponent, { duration: SNACKBAR_DURATION, data: { message: 'Worry Shared', error: false } });

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
