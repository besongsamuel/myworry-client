import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSelectButtonComponent } from './image-select-button/image-select-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TagifyComponent } from './tagify/angular-tagify.component';
import { TagifyService } from './tagify/angular-tagify.service';




@NgModule({
  declarations: [ImageSelectButtonComponent, TagifyComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [TagifyService],
  exports: [ImageSelectButtonComponent, TagifyComponent]
})
export class WorryWidgetsModule { }
