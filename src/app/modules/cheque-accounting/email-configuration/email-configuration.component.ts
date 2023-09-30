import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ChequeAccountingService } from '../Services/cheque-accounting.service';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { AppCode } from 'src/app/app.code';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThisReceiver } from '@angular/compiler';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-email-configuration',
  templateUrl: './email-configuration.component.html',
  styleUrls: ['./email-configuration.component.scss']
})

export class EmailConfigurationComponent implements OnInit {
  DataSource = new MatTableDataSource<Element>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  ElementModel: Element = new Element();
  adminList: any;
  displayedColumns = ['SrNo', 'Name', 'Email'];
  Selected: Person[];
  EmailForList: any[];
  PurposeList: any[];
  EmailFor: any = {};
  EmailPurpose: any = {};
  EmailPurposeList: any[];
  Title: string = "";
  BranchList: any[] = [];
  CompanyList: any[] = [];
  selectedBranchList: any[] = [];
  selection = new SelectionModel<any>(true, []);
  EmailConfigModel: EmailConfig
  EmailForm: FormGroup;
  submitted = false;
  isLoading: boolean = false;
  searchModel: string = '';
  filteredBranch: Observable<BranchModel[]>;
  filteredCompany: Observable<CompanyModel[]>;
  filteredPurpose: Observable<EmailPurpose[]>;
  InvalidBranch: boolean = false;
  InvalidCompany: boolean = false;
  InvalidPurpose: boolean = false;

  constructor(private chequeService: ChequeAccountingService, private _service: MastersServiceService,
    private chRef: ChangeDetectorRef, private toastr: ToastrService, private fb: FormBuilder, private chef: ChangeDetectorRef) { }

  ngOnInit() {
    this.Title = "Email Configuration";
    this.getEmailForm();
    this.getEmailPurpose();
    this.GetBranchList();
    this.GetCompanyList();
    this.EmailForList = [];
  }

  getEmailForm() {
    this.EmailForm = new FormGroup({
      Branch: new FormControl('', Validators.required),
      Company: new FormControl('', Validators.required),
      Purpose: new FormControl('', Validators.required),
      CCPerson: new FormControl('', Validators.required),
    });
  }

  // Get Branch List
  GetBranchList() {
    this._service.getBranchList_Service(AppCode.IsActiveString)
      .subscribe((data: any) => {
        this.BranchList = data;
        this.BranchList = this.BranchList.sort((a: any, b: any) => a.BranchName.localeCompare(b.BranchName));
        this.filteredBranch = this.f.Branch.valueChanges
          .pipe(
            startWith<string | BranchModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.BranchName : null),
            map(BranchName => BranchName ? this.filterBranch(BranchName) : this.BranchList.slice())
          );
        this.chRef.detectChanges();
      }, (error) => {
        console.error(error);
      });
  }

  // Autocomplete Search Filter
  private filterBranch(name: string): BranchModel[] {
    this.InvalidBranch = false;
    const filterValue = name.toLowerCase();
    return this.BranchList.filter((br: any) =>
      br.BranchName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayBranch(branch: BranchModel): string {
    return branch && branch.BranchName ? branch.BranchName : '';
  }

  // Get Company list
  GetCompanyList() {
    this._service.getCompanyList_Service(AppCode.allString)
      .subscribe((data: any) => {
        this.CompanyList = data;
        this.CompanyList = this.CompanyList.sort((a: any, b: any) => a.CompanyName.localeCompare(b.CompanyName));
        this.filteredCompany = this.f.Company.valueChanges
          .pipe(
            startWith<string | CompanyModel>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.CompanyName : null),
            map(CompanyName => CompanyName ? this.filterCompany(CompanyName) : this.CompanyList.slice())
          );
        this.chRef.detectChanges();
      },
        (error) => {
          console.error(error);
        });
  }

  // Autocomplete Search Filter
  private filterCompany(name: string): CompanyModel[] {
    this.InvalidCompany = false;
    const filterValue = name.toLowerCase();
    return this.CompanyList.filter((option: any) =>
      option.CompanyName.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayCompany(Company: CompanyModel): string {
    return Company && Company.CompanyName ? Company.CompanyName : '';
  }

  getEmailPurpose() {
    this.chequeService.getEmailPurposeDetails_Service()
      .subscribe(data => {
        this.EmailPurposeList = [];
        this.EmailPurposeList = data;
        this.EmailPurposeList = this.EmailPurposeList.sort((a: any, b: any) => a.Name.localeCompare(b.Name));
        this.filteredPurpose = this.f.Purpose.valueChanges
          .pipe(
            startWith<string | EmailPurpose>(''),
            map(value => typeof value === 'string' ? value : value !== null ? value.Name : null),
            map(Name => Name ? this.filterPurpose(Name) : this.EmailPurposeList.slice())
          );
        this.chRef.detectChanges();
      },
        (error) => {
          console.error(error);
        });
  }

  // Autocomplete Search Filter
  private filterPurpose(name: string): EmailPurpose[] {
    this.InvalidPurpose = false;
    const filterValue = name.toLowerCase();
    return this.EmailPurposeList.filter((option: any) =>
      option.Name.toLowerCase().includes(filterValue))
  }

  // Select or Choose dropdown values
  displayPurpose(Purpose: EmailPurpose): string {
    return Purpose && Purpose.Name ? Purpose.Name : '';
  }

  get f(): { [key: string]: AbstractControl } {
    return this.EmailForm.controls;
  }

  OnsubmitStage() {
    this.EmailConfigModel = new EmailConfig();
    this.EmailConfigModel.BranchId = this.f.Branch.value.BranchId;
    this.EmailConfigModel.CompanyId = this.f.Company.value.CompanyId;
    if (this.f.Purpose.value === "" || this.f.Purpose.value === null || this.f.Purpose.value === undefined) {
      this.EmailConfigModel.EmailForId = 0;
    }
    else {
      this.EmailConfigModel.EmailForId = this.f.Purpose.value.Id;
    }
    this.GetCCPerson(this.EmailConfigModel.EmailForId);
  }

  // CC Person display on Purpose of email
  GetCCPerson(EmailForId: number) {
    this.chequeService.getAdminDetails(EmailForId)
      .subscribe(data => {
        this.adminList = [];
        this.Selected = [];
        this.EmailForList = [];
        this.adminList = data;
        this.EmailForList = this.adminList;
        if (this.adminList != null && this.adminList != undefined) {
          this.Selected = this.adminList.filter((x: { IsSelect: number; }) => x.IsSelect === 1);
          this.selection.select(this.Selected);
          this.f.CCPerson.setValue(this.Selected);
        }
        this.getEmailConfigurationList(this.EmailConfigModel.BranchId, this.EmailConfigModel.CompanyId);
      }, (error) => {
        console.error(error);
      });
  }

  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chRef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  // getEmailConfigurationList
  getEmailConfigurationList(BranchId: number, CompanyId: number) {
    // this.isLoading = true;
    this.chequeService.getEmailConfigurationData(BranchId, CompanyId)
      .subscribe((data) => {
        this.DataSource = new MatTableDataSource<Element>();
        this.DataSource.data = data;
        this.DataSource.sort = this.Sort; // before declare then removed
        this.DataSource.paginator = this.paginator;
        // this.isLoading = false;
        this.chRef.detectChanges();
      },
        (error) => {
          console.error(error);
        });
  }

  // Save email configuration
  SaveEmailConfiguration() {
    this.submitted = true;
    if (!this.EmailForm.valid) {
      this.isLoading = false;
      this.InvalidBranch = false;
      this.InvalidCompany = false;
      this.InvalidPurpose = false;
      return;
    }
    else {
      if (this.InvalidPurpose === false && this.InvalidBranch === false && this.InvalidCompany === false) {
        this.ElementModel.adminId = [];
        this.EmailConfigModel = new EmailConfig();
        var arrPurpose = [];
        this.EmailConfigModel.BranchId = this.f.Branch.value.BranchId;
        this.EmailConfigModel.CompanyId = this.f.Company.value.CompanyId;
        this.EmailConfigModel.EmailForId = this.f.Purpose.value.Id;
        //multiple role
        arrPurpose.push(this.f.CCPerson.value);
        arrPurpose.forEach((element: any) => {
          for (var i = 0; i < element.length; i++) {
            this.EmailConfigModel.EmailCCPersonId += element[i].Id + ",";
          }
        });
        if (this.f.Purpose.value.Id !== undefined && this.f.Branch.value.BranchId !== undefined && this.f.Company.value.CompanyId !== undefined) {
          this.chequeService.SaveEmailConfiguration_Service(this.EmailConfigModel)
            .subscribe(data => {
              if (data === AppCode.SuccessStatus) {
                this.toastr.success(AppCode.msg_saveSuccess);
                this.Selected = this.adminList.filter((x: { IsSelect: number; }) => x.IsSelect === 1);
                this.getEmailConfigurationList(this.EmailConfigModel.BranchId, this.EmailConfigModel.CompanyId);
                this.EmailForm.reset();
                this.getEmailForm();
                this.getEmailPurpose();
                this.GetBranchList();
                this.GetCompanyList();
                this.EmailForm.updateValueAndValidity();
                this.chRef.detectChanges();
              }
            },
              (error) => {
                console.error(error);
              });
        }
        else {
          this.toastr.error(AppCode.FailStatus);
          this.isLoading = false;
        }
      }
      else {
        this.toastr.error(AppCode.FailStatus);
        this.isLoading = false;
      }
    }
  }
  emailvalidation() {
    this.submitted = false;
    if ((this.f.Purpose.value.Id === "" || this.f.Purpose.value.Id === null || this.f.Purpose.value.Id === undefined)) {
      this.InvalidPurpose = true;
    } else {
      this.InvalidPurpose = false;
    }
    this.chRef.detectChanges();
  }
  branchvalidation() {
    this.submitted = false;
    if ((this.f.Branch.value.BranchId === "" || this.f.Branch.value.BranchId === null || this.f.Branch.value.BranchId === undefined)) {
      this.InvalidBranch = true;
    } else {
      this.InvalidBranch = false;
    }
    this.chRef.detectChanges();
  }
  companyvalidation() {
    this.submitted = false;
    if ((this.f.Company.value.CompanyId === "" || this.f.Company.value.CompanyId === null || this.f.Company.value.CompanyId === undefined)) {
      this.InvalidCompany = true;
    } else {
      this.InvalidCompany = false;
    }
    this.chRef.detectChanges();
  }
  // clear form on click cancel button
  ClearForm() {
    this.submitted = false;
    this.InvalidPurpose = false;
    this.InvalidBranch = false;
    this.InvalidCompany = false;
    this.EmailForm.reset();
    this.getEmailForm();
    this.getEmailPurpose();
    this.GetBranchList();
    this.GetCompanyList();
    //this.EmailForList = [];
  }

}

export class Element {
  Purpose: number;
  Role: string;
  adminId: any[];
}

export class Person {
  PersonId: number;
  PersonName: string;
  Email: string;
  IsSelect: number;
}

export class EmailConfig {
  BranchId: number = 0;
  CompanyId: number = 0;
  EmailForId: number = 0;
  EmailCCPersonId: string = "";
}

export class BranchModel {
  BranchId: number = 0;
  BranchName: string = '';
}

export class CompanyModel {
  CompanyId: number = 0;
  CompanyName: string = '';
}

export class EmailPurpose {
  Id: number = 0;
  Name: string = '';
}
