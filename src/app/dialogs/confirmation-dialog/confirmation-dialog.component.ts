import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationDialogData {

  title: string;
  message: string;
  yesLabel: string;
  noLabel: string;
  type: ConfirmationIconType
}

export enum ConfirmationIconType
{
  INFO = "Info",
  WARNING = "Warning"
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {
     
      if(!data.noLabel)
      {
        data.noLabel = "No";
      }

      if(!data.yesLabel)
      {
        data.yesLabel = "Yes";
      }

      if(!data.type)
      {
        data.type = ConfirmationIconType.WARNING;
      }
      
     }

  ngOnInit() {
  }

  yesClicked(){
    this.dialogRef.close(true);
  }

}
