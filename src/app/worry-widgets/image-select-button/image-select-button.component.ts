import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-select-button',
  templateUrl: './image-select-button.component.html',
  styleUrls: ['./image-select-button.component.scss']
})
export class ImageSelectButtonComponent implements OnInit {

  @Input() label: string = 'Browse';

  @Output() onImageSelected = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onFileSelect(event){

    this.onImageSelected.emit(event.target.files);
    
  }

}
