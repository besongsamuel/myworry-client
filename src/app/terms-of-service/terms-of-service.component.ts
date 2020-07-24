import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss']
})
export class TermsOfServiceComponent implements OnInit {

  constructor(private title: Title, meta: Meta) { 
    this.title.setTitle('Our Terms of Service');
    meta.updateTag({ name: 'description', content: `By accessing the website at https://www.myworry.ca, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.` });


  }

  ngOnInit(): void {
  }

}
