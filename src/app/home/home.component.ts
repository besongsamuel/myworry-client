import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { WorryService } from '../services/worry.service';
import { Worry } from '../models/worry';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment'

export const DEFAULT_IMAGE = 'assets/images/worry.png';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchForm = new FormGroup(
  {
    q: new FormControl('')
  });

  worries: Worry[] = [];

  constructor(private worryService: WorryService, public authService: AuthService) { }

  ngOnInit() {
    this.worryService.getWorries().subscribe((worries: Worry[]) => 
    {
      this.worries = worries;
      worries.map(x => 
      {
        if(x.image)
        {
          x.image = `${environment.ApiUrl}${x.image}`;
        }
        else
        {
          x.image = DEFAULT_IMAGE;
        }
        return x;
      });
    })
  }

  onSubmit()
  {

  }

}
