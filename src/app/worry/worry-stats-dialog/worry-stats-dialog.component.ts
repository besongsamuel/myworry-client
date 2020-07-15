import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Worry } from 'src/app/models/worry';

import { Opinion } from 'src/app/models/opinion';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Gender } from 'src/app/models/profile';
import { UserService } from 'src/app/services/user.service';

export const OPINION_COLORS = ['#338bcc', '#de4a1f', '#00bfa5', '#ffab00'];

export type ChartOptions = {
  view: number[];
  scheme: any;
  results: any[];
  gradient: boolean;
  legend: boolean;
  legendPosition: string;
  labels: boolean;
  doughnut: boolean;
  legendTitle: string;
};

@Component({
  selector: 'app-worry-stats-dialog',
  templateUrl: './worry-stats-dialog.component.html',
  styleUrls: ['./worry-stats-dialog.component.scss']
})
export class WorryStatsDialogComponent implements OnInit {

  public generalStatsOptions: ChartOptions;
  public maleStatsOptions: ChartOptions;
  public femaleStatsOptions: ChartOptions;

  femaleOpinions: Opinion[] = [];
  maleOpinions: Opinion[] = [];

  constructor(public dialogRef: MatDialogRef<WorryStatsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public worry: Worry,private userService: UserService) { }

  getSeries(opinions: Opinion[], opinionIndex : number){

    return opinions.reduce((acc : number, cv : Opinion) => {

      if(cv.type == opinionIndex){

        acc += 1;

        if(cv.opinionLikes){
          acc += cv.opinionLikes.length;
        }
      }

      return acc;
    }, 0);

  }

  generateChartOptions(opinions : Opinion[], title : string) : ChartOptions {

    let results : object[] = [];

    results.push({
      name: this.worry.opinion1Label,
      value: this.getSeries(opinions, 1)
    });

    results.push({
      name: this.worry.opinion2Label,
      value: this.getSeries(opinions, 2)
    });

    if(this.worry.opinion3Label){

      results.push({
        name: this.worry.opinion3Label,
        value: this.getSeries(opinions, 3)
      });

    }
    if(this.worry.opinion4Label){

      results.push({
        name: this.worry.opinion4Label,
        value: this.getSeries(opinions, 4)
      });
    }

    return  {

      view: [400, 250],
      results : results,
      scheme : {
        domain: OPINION_COLORS
      },
      legendPosition: 'below',
      doughnut: false,
      legend: true,
      labels: false,
      gradient: true,
      legendTitle: title
    };

  }

  ngOnInit(): void {

    if(this.worry.opinions && this.worry.opinions.length > 0){

      
      this.maleOpinions = this.worry.opinions.filter(x => this.userService.getProfile(x.user).gender == Gender.MALE);
      this.femaleOpinions = this.worry.opinions.filter(x => this.userService.getProfile(x.user).gender == Gender.FEMALE);

      this.generalStatsOptions = this.generateChartOptions(this.worry.opinions, "General Statistics");
      this.maleStatsOptions = this.generateChartOptions(this.maleOpinions, "Male Statistics");
      this.femaleStatsOptions = this.generateChartOptions(this.femaleOpinions, "Female Statistics");

    }

  }

}
