import { Component, OnInit } from '@angular/core';
import { AppCode } from 'src/app/app.code';
import { UserModel } from 'src/app/modules/auth';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';
  DisplayName: string= "";
  companyName: string="";
  RoleName: string="";

  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    this.headerLeft = this.layout.getProp('header.left') as string;
    let obj = AppCode.getUser();
    this.DisplayName = obj.DisplayName;
    this.companyName = obj.CompanyName;
    this.RoleName = obj.RoleName;
  }
}
