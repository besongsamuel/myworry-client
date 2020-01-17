import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Worry } from 'src/app/models/worry';
import { switchMap, tap } from 'rxjs/operators';
import { WorryService } from 'src/app/services/worry.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { NewOpinionDialogComponent } from 'src/app/dialogs/new-opinion-dialog/new-opinion-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-worry',
  templateUrl: './worry.component.html',
  styleUrls: ['./worry.component.css']
})
export class WorryComponent implements OnInit {

  worry$: Observable<Worry>;
  worry: Worry;

  public imagePath: string;

  constructor(private route: ActivatedRoute, private worryService: WorryService,
    public dialog: MatDialog, public userService: UserService) 
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
        })))

    );


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

        // get the created opinion with it's relations
        this.worryService.getOpinion(result.id).subscribe((opinion) => 
        {
          this.worry.opinions.unshift(opinion);
        });
        
      }
    });
  }

}
