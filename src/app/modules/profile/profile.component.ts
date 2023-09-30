import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserModel } from '../auth';
import { ChangepasswordService } from './service/changepassword.service';
import { UserProfile } from './model/userProfile';
import { Router } from '@angular/router';
import { AppCode } from 'src/app/app.code';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {

  }

}
