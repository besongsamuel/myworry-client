import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { WorryService } from 'src/app/services/worry.service';
import { Worry } from 'src/app/models/worry';
import { ThrowStmt } from '@angular/compiler';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-worry',
  templateUrl: './new-worry.component.html',
  styleUrls: ['./new-worry.component.css']
})
export class NewWorryComponent implements OnInit {


  newWorryForm : FormGroup;
  error: boolean = false;
  success: boolean = false;
  errorMessage: string = null;
  categories: Category[] = [];
  tags = [];

  constructor(private fb: FormBuilder, private worryService: WorryService)
  {

    this.initForm();

    worryService.getCategories().subscribe((categories: Category[]) =>
    {
      this.categories = categories;
    });

  }

  initForm()
  {
    this.newWorryForm = this.fb.group(
      {
        categoryId: '',
        name: '',
        description: '',
        locked: false,
        labelFor: 'Yes',
        labelAgainst: 'No',
        image: File,
        startDate: new Date(),
        endDate: new Date()
      });
  }

  ngOnInit() {
  }

  onSubmit()
  {
    let worry: Worry = this.newWorryForm.value;
    worry.tags = this.tags.map(x => x.value);
    this.worryService.createWorry(worry).subscribe(() =>
    {
      this.errorMessage = null;
      this.success = true;
      this.initForm();
    },
    (err) =>
    {
      this.success = false;
      this.errorMessage = err.error.error.message;
    });

  }

}
