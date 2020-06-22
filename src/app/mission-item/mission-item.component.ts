import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mission-item',
  templateUrl: './mission-item.component.html',
  styleUrls: ['./mission-item.component.scss']
})
export class MissionItemComponent implements OnInit {


  @Input() icon: string = '';

  @Input() title: string = '';

  @Input() statement: string = '';

  @Input() color: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
