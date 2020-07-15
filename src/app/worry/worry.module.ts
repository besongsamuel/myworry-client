import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditWorryComponent } from './edit-worry/edit-worry.component';
import { AddWorryComponent } from './add-worry/add-worry.component';
import { WorryComponent } from './worry/worry.component';
import { WorryItemComponent } from './worry-item/worry-item.component';
import { OpinionComponent } from './opinion/opinion.component';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { WorryService } from './services/worry.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { WorryShareComponent } from './worry-share/worry-share.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { WorryStatsDialogComponent } from './worry-stats-dialog/worry-stats-dialog.component';
import { SearchResultsComponent } from './search-results/search-results.component'
import { WorryWidgetsModule } from '../worry-widgets/worry-widgets.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AddWorryOpinionComponent } from './add-worry-opinion/add-worry-opinion.component';
import {MatDividerModule} from '@angular/material/divider';
import { AddEditReplyComponent } from './add-edit-reply/add-edit-reply.component';
import { ReplyComponent } from './reply/reply.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [EditWorryComponent, AddWorryComponent, WorryComponent, WorryItemComponent, OpinionComponent, WorryShareComponent, WorryStatsDialogComponent, SearchResultsComponent, AddWorryOpinionComponent, AddEditReplyComponent, ReplyComponent],
  exports: [
    EditWorryComponent,
    AddWorryComponent,
    WorryComponent,
    WorryItemComponent,
    OpinionComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgxFileDropModule,
    WorryWidgetsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTableModule,
    MatTooltipModule,
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
