import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LayoutService } from '../../core/layout.service';
import { Observable } from 'rxjs';
import { PageInfoService, PageLink } from '../../core/page-info.service';
import { AppCode } from 'src/app/app.code';
import { SharedService } from 'src/app/SharedServices/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/modules/auth';
import { MastersServiceService } from 'src/app/modules/master-forms/Services/masters-service.service';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { OrderDispatchService } from 'src/app/modules/order-dispatch/Services/order-dispatch.service';
import { PicklistCountModel } from 'src/app/modules/order-dispatch/Models/picklistcount-model';
import { AllInvCnt } from 'src/app/modules/order-dispatch/Models/all-inv-cnt.model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @ViewChild('ktPageTitle', { static: true }) ktPageTitle: ElementRef;
  pageTitleAttributes: {
    [attrName: string]: string | boolean;
  };
  toolbarContainerCssClasses: string = '';
  pageTitleCssClasses: string = '';
  private unsubscribe: PushSubscription[] = [];
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
  PicklistArray: any;
  PicklistRejected: any;
  InvoiceListArray: any;
  DLFoodNotiCnt: any;
  UserId: number = 0;
  RoleId: number = 0;
  Flag: string = '';
  isCollapsed1 = true;
  isCollapsed2 = true;
  isCollapsed3 = true;
  isCollapsed4 = true;
  picklistcount: PicklistCountModel;
  DataModel: any;
  currentDate = new Date();
  RejectbyOperator: number = 0;
  ConcernRaised: number = 0;
  TotalCntPLRejCon: number = 0;
  PicklistData: any[] = [];
  TotalPickListExpiryCnt: any;
  allinvCount: AllInvCnt;
  PackerConcern: number = 0;
  InvDataList: any[] = [];
  DataModelCount: any;




  constructor(private layout: LayoutService, private pageInfo: PageInfoService, private modalService: NgbModal, private chRef: ChangeDetectorRef,
    private _serviceMaster: MastersServiceService, private router: Router, private authService: AuthService, private _orderDispatchService: OrderDispatchService,
    private _SharedService: SharedService, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.toolbarContainerCssClasses =
      this.layout.getStringCSSClasses('toolbarContainer');
    this.pageTitleCssClasses = this.layout.getStringCSSClasses('pageTitle');
    this.pageTitleAttributes = this.layout.getHTMLAttributes('pageTitle');
    let obj = AppCode.getUser();
    this.BranchId = obj.BranchId;
    this.CompId = obj.CompanyId;
    this.UserId = obj.UserId;
    this.RoleId = obj.RoleId;
    this.DataModel = {
      BranchId: this.BranchId,
      CompId: this.CompId,
      PicklistDate: this.currentDate
    };
    this.title$ = this.pageInfo.title.asObservable();
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

    this.ExpiryStockistNotifiCount();
    this.GetNotiFicationList();
    this.GetPickListCounts(this.DataModel);
    this.GetPickList(this.DataModel);
    this.DataModelCount = {
      BranchId: this.BranchId,
      CompId: this.CompId
    }
    this.GetInvoiceCounts(this.DataModelCount);
    this.GetInvoiceList(this.DataModelCount);
  }

  ngAfterViewInit() {
    if (this.ktPageTitle) {
      for (const key in this.pageTitleAttributes) {
        if (
          this.pageTitleAttributes.hasOwnProperty(key) &&
          this.ktPageTitle.nativeElement
        ) {
          this.ktPageTitle.nativeElement.attributes[key] =
            this.pageTitleAttributes[key];
        }
      }
    }
  }

  // Stockist Expiry Notification
  ExpiryStockistNotifiCount() {
    this.isLoading = true;
    let FlagSuperAdmin: string = '';
    if (this.UserId != 1) {  //Branchadmin
      FlagSuperAdmin = 'BR';
    }
    else {
      FlagSuperAdmin = "''";
    }
    this._serviceMaster.GetExpiryStockistNotiCnt_Service(this.BranchId, this.CompId, FlagSuperAdmin)
      .subscribe((data: any) => {
        if (data !== null && data !== undefined && data !== "") {
          this.afterCount(data);
          this.chRef.detectChanges();
          this.authService.SendToDashboardNotification(data);
        }
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  // Stockist Expiry Notification
  afterCount(data: any) {
    if (data !== undefined && data !== null && data !== '') {
      this.ExpiryTotal = 0;
      this.TotalExpiry = data[0].DLFoodNotiCnt;
    }
    (error: any) => {
      console.error("Error:  " + JSON.stringify(error));
      this.isLoading = false;
    };
    this.chRef.detectChanges();
  }

  GetNotiFicationList() {
    this.isLoading = true;
    this._serviceMaster.GetExpiryStockistNotiFilList_Service(this.BranchId, this.CompId)
      .subscribe((data: any) => {
        this.NotificationDataList = data;
        // console.log( 'Count',this.NotificationDataList.length);
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

  // Get PickList Counts
  GetPickListCounts(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getPickListCounts_Service(DataModel)
      .subscribe((data: any) => {
        if (data != null && data != undefined && data != "") {
          this.afterCountForPicklist(data);
        }
        else {
          this.isLoading = false;
          this.chRef.detectChanges();
        }
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  afterCountForPicklist(data: PicklistCountModel) {
    this.picklistcount = new PicklistCountModel();
    this.picklistcount = data;
    this.RejectbyOperator = this.picklistcount.OperatorRejected;
    this.ConcernRaised = this.picklistcount.Concern;
    this.TotalCntPLRejCon = this.RejectbyOperator + this.ConcernRaised;
    this.chRef.detectChanges();
  }

  // Get PickList
  GetPickList(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getPickListByPicker_Service(DataModel)
      .subscribe((data: any) => {
        if (data != null && data != "" && data != undefined) {
          this.PicklistData = data;
          this.PicklistArray = this.PicklistData.filter((x: any) => x.PicklistStatus === 9 || x.PicklistStatus === 11);
          this.PicklistRejected = this.PicklistData.filter((x: any) => x.PicklistStatus === 2);
          this.isLoading = false;
          this.chRef.detectChanges();
        } else {
          this.isLoading = false;
          this.chRef.detectChanges();
        }
      }, (error: any) => {
        console.error("Error:  " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  // Get Invoice List
  GetInvoiceList(DataModel: any) {
    this.isLoading = true;
    this._orderDispatchService.getInvoice_Service(DataModel).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.InvDataList = data;
        this.InvoiceListArray = this.InvDataList.filter((x: any) => x.InvStatus === 4);
        this.isLoading = false;
        this.chRef.detectChanges();
      } else {
        this.isLoading = false;
        this.chRef.detectChanges();
      }
      (error: any) => {
        console.log(error);
      }
    });
  }

  // Get Invoice Count
  GetInvoiceCounts(DataModelCount: any) {
    this.isLoading = true;
    this._orderDispatchService.GetInvoiceCounts_Service(DataModelCount)
      .subscribe((data: any) => {
        if (data != null && data != "" && data != undefined) {
          this.PackerConcern = data.PackerConcern;
        } else {
          this.isLoading = false;
          this.chRef.detectChanges();
        }
        // this.afterCountInvoice(data);
      }, (error: any) => {
        console.error("Error: " + JSON.stringify(error));
        this.isLoading = false;
        this.chRef.detectChanges();
      });
  }

  // afterCountInvoice(data: AllInvCnt) {
  //   this.allinvCount = new AllInvCnt();
  //   this.allinvCount = data;
  //   this.PackerConcern = this.allinvCount.PackerConcern;
  //   this.chRef.detectChanges();

  // }


  // redirect on click cancel button
  // redirect(row: StockistModel) {
  //   this._SharedService.setData(row);
  //   this.router.navigate(['/modules/masters/add-stockist'], { queryParams: { state: AppCode.updateString } });
  // }

  redirect() {
    this.router.navigate(['/modules/masters/stockist-master']);
  }

  redirectPicklistConcern() {
    this.router.navigate(['/modules/order-dispatch/resolve-concern']);
  }
  redirectInvoiceConcern() {
    this.router.navigate(['/modules/order-dispatch/resolve-invoice']);
  }
  redirectPicklistPage() {
    this.router.navigate(['/modules/order-dispatch/picklist-operation']);
  }


}
