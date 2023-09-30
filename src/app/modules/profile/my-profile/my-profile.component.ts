import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppCode } from 'src/app/app.code';
import { UserProfile } from '../model/userProfile';
import { ChangepasswordService } from '../service/changepassword.service';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  UserId: number = 0;
  RoleId: string = '';
  userdetails: UserProfile = new UserProfile();

  constructor(private _service: ChangepasswordService,
    private router: Router,
    private chnge: ChangeDetectorRef) { }

  ngOnInit(): void {
    let obj = AppCode.getUser()
    this.UserId = obj.UserId;
    this.getUserProfile();
  }

  getUserProfile() {
    this._service.getuserProfile(this.UserId).subscribe({
      next: (res: UserProfile) => {
        this.userdetails = res;
        // console.log(res);
        this.chnge.detectChanges();
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }


}
