import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup(
  {
    email: new FormControl(''),
    password: new FormControl('')
  });

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit()
  {
    this.http.post('login', { email: this.loginForm.value }, this.httpOptions).subscribe((result) =>
    {
      console.log(result);
    })
  }

}
