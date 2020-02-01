import { Component, Input, HostListener, ElementRef } from '@angular/core'
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as $ from 'jquery'

@Component(
{
  selector: 'app-file-input',
  templateUrl: `./file-input.component.html`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileInputComponent,
      multi: true
    }
  ]
})
export class FileInputComponent implements ControlValueAccessor
{

  @Input() progress;
  @Input() title: string;
  onChange: Function;
  public file: File | null = null;

  writeValue(obj: any): void {

    if(obj)
    {
      this.host.nativeElement.value = obj.name;
      this.file = obj;
      this.readURL(this.file);
    }
    else
    {
      this.host.nativeElement.value = '';
      this.file = null;
    }
    
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {

  }

  @HostListener('change', ['$event.target.files'])
  emitFiles( event: FileList )
  {
    const file = event && event.item(0);
    this.onChange(file);
    this.file = file;
    this.readURL(this.file);
  }

  readURL(file: File) {
    if (file) {
        var reader = new FileReader();

        reader.onload = function (e : any) {
            $('.preview')
                .attr('src', e.target.result)
                .attr('value', file.name);
        };

        reader.readAsDataURL(file);
    }
  }

  remove()
  {
    this.file = null;
    this.host.nativeElement.value = '';
    let fileInputElement: any = $('app-file-input input')[0];
    fileInputElement.value = '';
    this.onChange(null);
    $('.preview')
                .attr('src', null);

  }

  constructor(private host: ElementRef<HTMLInputElement>){}
}
