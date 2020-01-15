import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Worry } from 'src/app/models/worry';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Opinion } from 'src/app/models/opinion';
import { UserService } from 'src/app/services/user.service';
import { WorryService } from 'src/app/services/worry.service';

export interface DialogData {
  worry: Worry;
  initialValue: number;
}

@Component({
  selector: 'app-new-opinion-dialog',
  templateUrl: './new-opinion-dialog.component.html',
  styleUrls: ['./new-opinion-dialog.component.css']
})
export class NewOpinionDialogComponent  {

  createOpinionForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NewOpinionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private userService: UserService,
    private worryService: WorryService
    ) 
    {
      this.createOpinionForm = this.fb.group(
      {
        type: [data.initialValue, Validators.required],
        text: ['', [Validators.required, Validators.minLength(3)]],
        worryId: this.data.worry.id,
        userId: this.userService.user.id
      });

    }

  onSubmit()
  {
    var opinion: Opinion = new Opinion();
    Object.assign(opinion, this.createOpinionForm.value);
    this.worryService.createOpinion(opinion).subscribe((newOpinion) => 
    {
      console.log(newOpinion);
      this.dialogRef.close();
    })
  }

}
