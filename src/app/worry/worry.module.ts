import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditWorryComponent } from './edit-worry/edit-worry.component';
import { AddWorryComponent } from './add-worry/add-worry.component';
import { WorryComponent } from './worry/worry.component';
import { WorryItemComponent } from './worry-item/worry-item.component';
import { OpinionComponent } from './opinion/opinion.component';
import { AddOpinionComponent } from './add-opinion/add-opinion.component';
import { EditOpinionComponent } from './edit-opinion/edit-opinion.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxFileDropModule } from 'ngx-file-drop';
import { TagInputModule } from 'ngx-chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { WorryService } from './services/worry.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { WorryShareComponent } from './worry-share/worry-share.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';





@NgModule({
  declarations: [EditWorryComponent, AddWorryComponent, WorryComponent, WorryItemComponent, OpinionComponent, AddOpinionComponent, EditOpinionComponent, WorryShareComponent],
  exports: [
    EditWorryComponent,
    AddWorryComponent,
    WorryComponent,
    WorryItemComponent,
    OpinionComponent,
    AddOpinionComponent,
    EditOpinionComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgxFileDropModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTableModule,
    MatTabsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatMenuModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCardModule,
    MatRadioModule,
    MatExpansionModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatToolbarModule,
    MatSlideToggleModule

  ],
  providers: [WorryService]
})
export class WorryModule { }
