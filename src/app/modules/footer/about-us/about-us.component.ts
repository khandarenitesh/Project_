import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  RedirectPrivacyPage(){
    this.router.navigate(['/footer/privacy-policy']);
  }

  RedirectAboutusPage(){
    this.router.navigate(['/footer/about-us']);
  }

}
