import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Worry } from 'src/app/models/worry';
import { switchMap } from 'rxjs/operators';
import { WorryService } from 'src/app/services/worry.service';

@Component({
  selector: 'app-worry',
  templateUrl: './worry.component.html',
  styleUrls: ['./worry.component.css']
})
export class WorryComponent implements OnInit {

  worry$: Observable<Worry>;

  constructor(private route: ActivatedRoute, private worryService: WorryService) { }

  ngOnInit() {

    this.worry$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.worryService.getWorry(params.get('id')))
    );
  }

}
