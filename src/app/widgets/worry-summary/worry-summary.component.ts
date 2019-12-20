import { Component, OnInit, Input } from '@angular/core';
import { Worry } from 'src/app/models/worry';

@Component({
  selector: 'app-worry-summary',
  templateUrl: './worry-summary.component.html',
  styleUrls: ['./worry-summary.component.css']
})
export class WorrySummaryComponent implements OnInit {

  @Input() worry: Worry;

  constructor() { }

  ngOnInit() {
  }

}
