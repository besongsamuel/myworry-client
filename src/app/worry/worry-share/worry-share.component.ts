import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/models/user';
import { Observable, of, pipe } from 'rxjs';
import { startWith, map, flatMap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { Worry } from 'src/app/models/worry';
import { UserIdentity } from 'src/app/models/profile';
import { WorryService } from '../services/worry.service';

export interface ShareWorryData {
  worry: Worry;
}

@Component({
  selector: 'app-worry-share',
  templateUrl: './worry-share.component.html',
  styleUrls: ['./worry-share.component.scss']
})
export class WorryShareComponent implements OnInit {

  userCtrl = new FormControl();
  filteredUsers: Observable<User[]>;
  selectedUsers: User[] = [];
  allUsers: User[] = [];
  worry: Worry;
  getUsers$ : Observable<User[]>;
  loading : boolean = false;
  constructor(
    public dialogRef: MatDialogRef<WorryShareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShareWorryData,
    private userService: UserService, private worryService: WorryService) { 

      this.worry = data.worry;
      this.filteredUsers = this.userCtrl.valueChanges
      .pipe(
        startWith(''),
        flatMap(name =>  this.getUsers$.pipe(map((users: User[]) => {

          users = users.reduce((acc: User[], user: User) => {

            if(!this.selectedUsers.map(x => x.id).includes(user.id) 
            && user.id != this.userService.user.id)
            {
              if (user.email.toLowerCase().includes(name.toLowerCase())) {
                acc.push(user);
              }
              else {
        
                if (user.userIdentity) {
        
        
                    if (user.userIdentity.profile.name.givenName
                      && user.userIdentity.profile.name.givenName.toLowerCase().includes(name.toLowerCase())) {
                        acc.push(user);
                    }
        
                    if (user.userIdentity.profile.name.middleName
                      && user.userIdentity.profile.name.middleName.toLowerCase().includes(name.toLowerCase())) {
                        acc.push(user);
                    }
        
                    if (user.userIdentity.profile.name.familyName
                      && user.userIdentity.profile.name.familyName.toLowerCase().includes(name.toLowerCase())) {
                        acc.push(user);
                    }
                }
        
              }
            }
            return acc;
          }, []);

          return users;
        })))
      );
    }

  ngOnInit(): void {

    this.getUsers$ = this.userService.getUsers(null);

    this.getUsers$.subscribe((users: User[]) => {
       this.allUsers = users;
       if(this.worry.worryShares){
        this.selectedUsers = users.filter(x =>  this.worry.worryShares.map(x => x.userId).includes(x.id));
       }
     });
  }

  private _filterUsers(value: any): Observable<User[]> {

      let filterValue = '';

      if(typeof value == 'string'){
        filterValue = value.toLowerCase();
      }
  
      return this.userService.getUsers(filterValue).pipe(map(results => results.filter(r => !this.selectedUsers.map(y => y.id).includes(r.id)) ));
    
  }

  getProfilePicture(user: User){

    return this.userService.getProfileImage(user);
  }

  getUserName(user : User){
    
    if(!user){
      return '';
    }
    return `${user.userIdentity.profile.name.givenName} ${user.userIdentity.profile.name.familyName}`;
  }

  remove(user){
    this.selectedUsers = this.selectedUsers.filter(x => x.id != user.id);
  }

  add(){
    let user: User = this.userCtrl.value;

    if(user){
      this.selectedUsers.push(user);
      this.userCtrl.reset();
    }
    
  }

  okClicked(){

    this.loading = true;
    this.worryService.shareWorry(this.worry, this.selectedUsers).subscribe((result) => {
      this.loading = false;
      this.dialogRef.close(result);
    }, (error: any) => {
      console.error(error);
      this.loading = false;
    });
  }

}
