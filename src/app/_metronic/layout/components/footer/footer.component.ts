import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../core/layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  footerContainerCssClasses: string = '';
  currentDateStr: string = new Date().getFullYear().toString();
  constructor(private layout: LayoutService, private router: Router) { }

  ngOnInit(): void {
    this.footerContainerCssClasses =
      this.layout.getStringCSSClasses('footerContainer');
  }

  RedirectPrivacyPage() {
    this.router.navigate(['/footer/privacy-policy']);
  }

}
