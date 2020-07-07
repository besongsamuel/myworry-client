import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSelectButtonComponent } from './image-select-button/image-select-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EmojiDialogComponent } from './emoji-dialog/emoji-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PickerModule } from '@ctrl/ngx-emoji-mart';




@NgModule({
  declarations: [ImageSelectButtonComponent, EmojiDialogComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    PickerModule,
    MatDialogModule
  ],
  exports: [ImageSelectButtonComponent],
  entryComponents: [EmojiDialogComponent]
})
export class WorryWidgetsModule { }
