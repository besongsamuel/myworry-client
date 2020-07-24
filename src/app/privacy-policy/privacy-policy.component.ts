import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private title: Title, meta: Meta) { 
    this.title.setTitle('Our Privacy Policy');
    meta.updateTag({ name: 'description', content: `Your privacy is important to us. It is MyWorry's policy to respect your privacy regarding any information we may collect from you across our website, https://www.myworry.ca, and other sites we own and operate.` });
  }

  ngOnInit(): void {
  }

}
