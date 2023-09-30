import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MastersServiceService } from './../../../../../modules/master-forms/Services/masters-service.service';
import { AppCode } from './../../../../../app.code';
import { Observable, Subscription } from 'rxjs';
import { LayoutService } from '../../../core/layout.service';
import { PageInfoService, PageLink } from '../../../core/page-info.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { StockistModel } from 'src/app/modules/master-forms/Models/stockist-master';
import { SharedService } from 'src/app/SharedServices/shared.service';


@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
})
export class PageTitleComponent implements OnInit, OnDestroy {

  private unsubscribe: Subscription[] = [];
  showTitle: boolean = false;
  showBC: boolean = true;
  title$: Observable<string>;
  description$: Observable<string>;
  bc$: Observable<Array<PageLink>>;
  pageTitleCssClass: string = '';
  pageTitleDirection: string = 'row';
  Title1: string = "";
  isLoading: boolean = false;
  BranchId: number;
  CompId: number;
  TotalExpiry: number;
  ExpiryTotal: any;
  NotificationDataList: any;
  NewArray: any;

  constructor(private pageInfo: PageInfoService, private layout: LayoutService, private modalService: NgbModal, private chRef: ChangeDetectorRef,
    private _serviceMaster: MastersServiceService, private router: Router, private authService: AuthService,
     private _SharedService: SharedService, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    let obj = AppCode.getUser();
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.title$ = this.pageInfo.title.asObservable();
    console.log('title', this.title$)
    this.description$ = this.pageInfo.description.asObservable();
    this.bc$ = this.pageInfo.breadcrumbs.asObservable();
    // this.showTitle = this.layout.getProp('pageTitle.display') as boolean;
    this.showBC = this.layout.getProp('pageTitle.breadCrumbs') as boolean;
    this.pageTitleCssClass = this.layout.getStringCSSClasses('pageTitle');
    this.pageTitleDirection = this.layout.getProp(
      'pageTitle.direction'
    ) as string;
    this.bc$.subscribe(bd => {
      if (bd.length == 0) {
        this.showTitle = true;
      }
      else {
        this.showTitle = false;
      }
    })

    // this.ExpiryStockistNotifiCount();
    // this.GetNotiFicationList();
    // this.REfreshData();
  }


  // // Stockist Expiry Notification
  // ExpiryStockistNotifiCount() {
  //   this.isLoading = true;
  //   this._serviceMaster.GetExpiryStockistNotiCnt_Service(this.BranchId, this.CompId)
  //     .subscribe((data: any) => {
  //       if (data !== null && data !== undefined && data !== "") {
  //         this.afterCount(data);
  //         this.chRef.detectChanges();
  //         this.authService.SendToDashboardNotification(data);
  //       }
  //     }, (error: any) => {
  //       console.error("Error:  " + JSON.stringify(error));
  //       this.isLoading = false;
  //       this.chRef.detectChanges();
  //     });
  // }

  // Stockist Expiry Notification
  afterCount(data: any) {
    this.ExpiryTotal = 0;
    this.TotalExpiry = data[0].DLFoodNotiCnt;
    this.chRef.detectChanges();
  }

  GetNotiFicationList() {
    this.isLoading = true;
    this._serviceMaster.GetExpiryStockistNotiFilList_Service(this.BranchId, this.CompId)
      .subscribe((data: any) => {
        this.NotificationDataList = data;
        this.NewArray = this.NotificationDataList.filter((x: any) => x.DLExpDateCount === 1 || x.FoodLicExpDateCount === 1);
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  NotificationModel: any;
  //open modal for clickable counts
  OpenModalModalForFilterCount(content: any) {
    this.NotificationModel = this.modalService.open(content, {
      // centered: true,
      scrollable: true,
      // backdrop: 'static'
    });
  }

  //close the popup
  ClosePopup() {
    this.modalService.dismissAll();
  }

  redirect() {
    this.router.navigate(['/modules/masters/stockist-master']);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
