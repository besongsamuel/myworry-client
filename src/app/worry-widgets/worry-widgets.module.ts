import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSelectButtonComponent } from './image-select-button/image-select-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [ImageSelectButtonComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [ImageSelectButtonComponent]
})
export class WorryWidgetsModule { }
