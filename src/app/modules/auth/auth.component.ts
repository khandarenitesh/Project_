import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  today: Date = new Date();

  constructor(private router: Router) {}

  ngOnInit(): void {
    document.body.classList.add('bg-white');
  }

  RedirectPrivacyPage(){
    this.router.navigate(['/footer/privacy-policy']);
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-white');
  }
}
