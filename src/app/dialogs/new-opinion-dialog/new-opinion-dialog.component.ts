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

export const FOR_VALUE = 1;
export const AGAINST_VALUE = 0;

@Component({
  selector: 'app-new-opinion-dialog',
  templateUrl: './new-opinion-dialog.component.html',
  styleUrls: ['./new-opinion-dialog.component.css']
})
export class NewOpinionDialogComponent  {

  createOpinionForm: FormGroup;
  for_val: number = FOR_VALUE;
  against_val: number = AGAINST_VALUE;
  error: boolean = false;
  errorMessage: string = '';

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
    this.worryService.createOpinion(this.createOpinionForm.value).subscribe((newOpinion) => 
    {
      this.dialogRef.close(newOpinion);
    },
    err =>
    {
      this.error = true;
      this.errorMessage = err.error.error.message;

    })
  }

}
