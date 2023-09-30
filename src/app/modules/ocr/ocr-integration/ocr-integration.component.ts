import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

// Angular Material
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// models
import { OCRDataModel } from '../models/OCRDataModel';

// Services
import { MastersServiceService } from '../../../modules/master-forms/Services/masters-service.service';
import { OcrIntegrationService } from '../Services/ocr-integration.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppCode } from '../../../app.code';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';

@Component({
  selector: 'app-ocr-integration',
  templateUrl: './ocr-integration.component.html',
  styleUrls: ['./ocr-integration.component.scss']
})
export class OcrIntegrationComponent implements OnInit, OnDestroy {
  @Output() getPicture = new EventEmitter<WebcamImage>();
  displayedColumnsForApi = ['SrNo', 'StockistNo', 'StockistName', 'LR_ClaimNo', 'BatchNo', 'ProductName', 'ReturnType', 'EXP_Date', 'Code', 'Quantity'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('Sort') Sort: MatSort;
  @ViewChild('AddEditPopup')
  private AddEditPopup: TemplateRef<any>;
  public DataSource = new MatTableDataSource<any>();
  UserId: Number = 0;
  BranchId: number = 0;
  CompanyId: number = 0;
  submitted: boolean = false;
  isLoading: boolean = false;
  OCRSaveDataForm: FormGroup;
  StockistForm: FormGroup;
  StockistNameList: any[] = [];
  errors: WebcamInitError[] = [];
  StockistNameArray: Observable<OCRDataModel[]>;
  StockistName: boolean = false;
  pageState: string = "";
  btnCancelText: string = "";
  OCRDataModel: OCRDataModel = new OCRDataModel();
  ManufacturingDate: any | string = "";
  ExpiryDate: any | string = "";
  MrpRs: string = "";
  BatchNo: any | string = "";
  ManufaturingDateFormat: any;
  ExpiryDateFormat: any;
  ExpiryDateMonth: any;
  ExpiryDateDay: any;
  ExpiryDateYear: any;
  ManufacturingDateDay: any;
  ManufacturingDateYear: any;
  ManufacturingDateMonth: any;
  CommonDateFormat: any;
  imageName: string = "";
  imgDt: Date = new Date();
  AddEditModel: any; // popup
  Title: string = "";
  searchModel: string = '';
  captureImageNew: string = "";
  defaultform: any = {
    LrClaimNo: '',
    Quantity: '',
    Unit: '',
    Code: '',
    ProductName: '',
    Returntype: ''
  };
  defaultform1: any = {
    StockistName: ''
  };
  webcamImage: WebcamImage | undefined;
  captureImage: string = "";
  BatchNoList: any[] = [];
  IsStockistDisable: boolean = false;
  recognizedText: string | null = null;
  private trigger: Subject<any> = new Subject();
  private nextWebcam: Subject<any> = new Subject();
  typeRectBox: string = "rectangle";
  typeRectBoxValue: string = "";
  CurrentDateTime = new Date();
  TodayDateForFilter: any;
  blur: boolean;
  sepia: boolean;
  invert: boolean;
  flip: boolean;
  brightness: boolean;
  subscription: Subscription;
  public motionDetected = false;
  isFlagTimer: boolean = false;
  isColorBlack: boolean = false;

  constructor(private _service: MastersServiceService, private _ToastrService: ToastrService, private fb: FormBuilder,
    private chef: ChangeDetectorRef, private _ocrSerivce: OcrIntegrationService, private fb1: FormBuilder,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    this.initForm();
    this.stockistforminit();
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetStockistList();
    this.GetOCRTextData();
    this.RectangleBox(this.typeRectBox);
    this.TodayDateForFilter = formatDate(this.CurrentDateTime, 'yyyy-MM-dd', 'en-US');
    this.refreshLoad(); // Refresh Load for Every 30 Seconds
  }

  // Refresh Load for Every 30 Seconds
  refreshLoad() {
    // debugger
    console.log("Starting...............");
    this.subscription = timer(0, 10000)
      .subscribe(async () => {
        console.log("Execute Starting...............");
        if (this.isFlagTimer === false || this.isFlagTimer === undefined || this.isFlagTimer === null) {
          await this.refreshData();
        }
        console.log("Execute Ending...............");
        this.chef.detectChanges();
      });

    console.log("Ending...............");
  }

  // image capturing rectangle and square box code
  onImageLoad(captimg: string) {
    // debugger
    let formData = new FormData();
    const imgElement = new Image();
    imgElement.src = captimg;
    let boxtype = this.typeRectBoxValue;
    imgElement.onload = async () => {
      // image load
      const canvas = document.createElement('canvas');
      const context: any = canvas.getContext('2d');
      if (boxtype === "square") {
        context.drawImage(imgElement, 190, 150, 300, 300, 0, 0, 300, 300);
      } else {
        context.drawImage(imgElement, 150, 180, 300, 300, 0, 0, 300, 300);
      }
      const imgData = context.getImageData(0, 0, 300, 300);
      const [r, g, b] = imgData.data;

      // Case - Black    
      var resultA = (([r, g, b][0] === 0 && [r, g, b][1] === 0 && [r, g, b][2] === 0) ? false : true);
      this.captureImage = '';
      if (resultA === true) {
        this.isFlagTimer = true;
        this.captureImageNew = canvas.toDataURL('image/png', 1.0);
        this.imageName = "capture_" + this.imgDt.getDate() + "_" + this.imgDt.getMinutes() + "_" + this.imgDt.getSeconds() + ".png";
        var file = await this.urltoFile(this.captureImageNew, this.imageName, 'image/png');
        formData.append('upload', file);
        this._ocrSerivce.GetOCRImageTextData(formData)
          .subscribe((data: any) => {
            this.ConvertDataForSave(data.DetectedText);
          });
        this.AddEditModel = this.modalService.open(this.AddEditPopup, {
          centered: true,
          size: 'xl',
          backdrop: 'static'
        });
        if (this.pageState === AppCode.saveString) {
          this.Title = 'Add OCR';
          this.f.Unit.setValue("EA"); // by default EA
        }
      } else {
        this.ClearImage();
      }
    };
    this.chef.detectChanges();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.OCRSaveDataForm.controls;
  }

  // Refresh Data
  public refreshData() {
    this.trigger.next(void 0);
  }

  // captured images.
  public captureImg(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    this.captureImage = webcamImage!.imageAsDataUrl;
    this.isBlackImage(this.captureImage);
    if (this.isColorBlack === true) {
      this.onImageLoad(this.captureImage);
      this.chef.detectChanges();
    }
  }

  isBlackImage(captimg: string) {
    const imgElement = new Image();
    imgElement.src = captimg;
    let boxtype = this.typeRectBoxValue;
    var blackcolr = "";
    imgElement.onload = async () => {
      // image load
      const canvas = document.createElement('canvas');
      const context: any = canvas.getContext('2d');
      if (boxtype === "square") {
        context.drawImage(imgElement, 190, 150, 300, 300, 0, 0, 300, 300);
      } else {
        context.drawImage(imgElement, 150, 180, 300, 300, 0, 0, 300, 300);
      }
      const imgData = context.getImageData(0, 0, 300, 300);
      const [r, g, b] = imgData.data;
      var resultA = (([r, g, b][0] === 0 && [r, g, b][1] === 0 && [r, g, b][2] === 0) ? false : true);
      this.Test(resultA);
      this.ClearImage();
    }
  }

  Test(resultA: any) {
    if (resultA === false) {
      this.isColorBlack = true;
    } else {
      this.isColorBlack = false;
    }

  }

  getStyles() {
    let filter = '';
    let transform = '';

    if (this.blur) {
      filter += 'blur(5px)';
    }
    if (this.sepia) {
      filter += 'sepia(50%)';
    }
    if (this.invert) {
      filter += 'invert(1)';
    }
    if (this.flip) {
      transform += 'scaleX(-1)';
    }
    if (this.brightness) {
      // Apply brightness using the filter property
      filter += 'brightness(1.75) ';
    }

    return {
      filter: filter.trim(),
      transform: transform.trim(),
    };
  }

  //form initilization
  initForm() {
    this.OCRSaveDataForm = this.fb.group({
      LrClaimNo: [
        this.defaultform.LrClaimNo,
        Validators.compose([
          Validators.required
        ]),
      ],
      Quantity: [
        this.defaultform.Quantity,
        Validators.compose([
          Validators.required
        ]),
      ],
      Unit: [
        this.defaultform.Unit,
        Validators.compose([
          Validators.required
        ]),
      ],
      Code: [
        this.defaultform.Code,
        Validators.compose([
          Validators.required
        ]),
      ],
      ProductName: [
        this.defaultform.ProductName,
        Validators.compose([
          Validators.required
        ]),
      ],
      Returntype: [
        this.defaultform.Returntype,
        Validators.compose([
          Validators.required
        ]),
      ],
      // Division: [
      //   this.defaultform.Division,
      //   Validators.compose([
      //     Validators.required
      //   ]),
      // ],
      // Plant: [
      //   this.defaultform.Plant,
      //   Validators.compose([
      //     Validators.required
      //   ]),
      // ],
    });
  }

  get f1(): { [key: string]: AbstractControl } {
    return this.StockistForm.controls;
  }

  stockistforminit() {
    this.StockistForm = this.fb1.group({
      StockistName: [
        this.defaultform1.StockistName,
        { disabled: true },
        Validators.compose([
          Validators.required,
        ])
      ],
    })
  };

  // Get Stockist No. and Stockist Name
  GetStockistList() {
    this._service.getStockistList_Service(this.BranchId, this.CompanyId, AppCode.IsActiveString)
      .subscribe(
        (data: any) => {
          this.StockistNameList = data;
          this.StockistNameList = this.StockistNameList.sort((a: any, b: any) => a.StockistName.localeCompare(b.StockistName));
          this.StockistNameArray = this.f1.StockistName.valueChanges
            .pipe(
              startWith<string | OCRDataModel>(''),
              map(value => typeof value === 'string' ? value : value !== null ? value.StockistName : null),
              map(StockistName => StockistName ? this.filterStockistNo(StockistName) : this.StockistNameList.slice())
            );
          this.chef.detectChanges();
        },
        (error) => {
          console.error(error);
          this.chef.detectChanges();
        });
  }

  GetOCRTextData() {
    this.isLoading = true;
    this._ocrSerivce.GetOCRTextDataList_Service(this.BranchId, this.CompanyId).subscribe((data: any) => {
      if (data.length > 0 && data != null && data != "" && data != undefined) {
        this.DataSource.data = data;
        this.DataSource.paginator = this.paginator;
        this.DataSource.sort = this.Sort;
      } else {
        this.DataSource.data = [];
      }
      this.isLoading = false;
      this.chef.detectChanges();
    });
  }

  // Autocomplete Search Filter
  private filterStockistNo(name: string): OCRDataModel[] {
    this.StockistName = false;
    this.IsStockistDisable = true;
    this.f1.StockistName.disable();
    const filterValue = name.toLowerCase();
    return this.StockistNameList.filter((option: any) => option.StockistName.toLocaleLowerCase().includes(filterValue));

  }

  // Select or Choose dropdown values
  displayFnStockistName(StockstName: OCRDataModel): string {
    return StockstName && StockstName.StockistName ? StockstName.StockistName : '';
  }

  // Stockist drop down validtion
  stockistnameValidation() {
    this.submitted = false;
    if ((this.f1.StockistName.value.StockistName === "" || this.f1.StockistName.value.StockistName === null || this.f1.StockistName.value.StockistName === undefined)) {
      this.StockistName = true;
      this.IsStockistDisable = false;
      return;
    } else {
      this.StockistName = false;
      this.IsStockistDisable = true;
    }
  }

  Enablestockist() {
    this.IsStockistDisable = false;
    this.f1.StockistName.setValue("");
    this.f1.StockistName.enable();
    this.GetStockistList();
  }

  // Define regular expressions for each information extraction
  ConvertDataForSave(DetectedText: any) {
    //Batch No Regex Epression
    const regexDigitalAll = /(?:(Batch\s*No\.|B\.No\.|BATCH\s*NO\.):\s*(\S+))|(?:(Mfg\.\s*Date|Mfg\.\s*Date\s*:)\s*([A-Z]+\s*\d{1,2}\s*\d{2,4}))|(?:(Expiry\s*Date|EXP\.|EXP\s*:)\s*([A-Z]+\s*\d{1,2}\s*\d{2,4}))|(?:(M\.R\.P\.|M\.R\.P\. Rs\.|MRP\. Rs\.|MRP\s*:)\s*([\d.]+))/gi;
    const batchNumberRegex1 = /B\.No\.([A-Z0-9]+)/;
    const batchNumberRegex2 = /Batch\.No\.:(.+)/;
    const batchNumberRegex3 = /BATCH NO\.:\s*([A-Z0-9]+)/;
    const batchNumberRegex4 = /B\.No\.:(.+)/;
    const batchNumberRegex5 = /Batch No\.([A-Z0-9]+)/;
    const batchNumberRegex6 = /Batch No:([A-Z0-9]+)/;
    const batchNumberRegex7 = /B\.NO:([A-Z0-9]+)/;
    const batchNumberRegex8 = /Batch\. No\. ([A-Z0-9]+)/;
    const batchNumberRegex9 = /B\.NO\.:(\w+)/;
    const batchNumberRegex10 = /B\.NO\.(\w+)/;
    const batchNumberRegex11 = /Batch No\.(\w+)/;
    const batchNumberRegex12 = /Batch\. No\. (\w+)/;
    const rebatchNumberRegex13 = /B\.NO\.([A-Z0-9]+)/;
    const rebatchNumberRegex14 = /BINO\.([A-Z0-9]+)/;
    const batchNumberRegex15 = /B.No.\ ([A-Z0-9]+)/;
    const batchNumberRegex16 = /B\.No\. (\d+)/;
    const batchNumberRegex17 = /B\.No (\w+)/;
    const batchNumberRegex18 = /B\.NO (\w+)/;
    const batchNumberRegex19 = /B\.No\.(\w+)/;
    const batchNumberRegex20 = /B\.No\. +(\d+)/;
    const batchNumberRegex21 = /[A-Z]\d+/;
    const batchNumberRegex22 = /^[A-Z]+\d+/;
    const batchNumberRegexall = /B(?:atch)?\.? ?No\.?(?:\.|:)?:? ?(\w+)/i;
    // const batchNumberRegexall1 = /(?:B(?:atch)?|O)\.? ?NO\.? ?\\? ?(\w+)/i; //B either any character
    // const batchNumberRegexall2 = /(?:B(?:\.|atch)?|O)\.? ?NO\.? ?\(?\s*(\w+)/i;
    const batchNumberRegex23 = /E\.NO\.([A-Z0-9]+)/;
    const batchNumberRegex24 = /B\.No\.([A-Z0-9]+)/;
    const batchNumberRegex25 = /Batch No\.\n:\n([A-Z0-9]+)/i;
    const batchNumberRegex26 = /Batch No\.\s*:\s*([A-Z0-9]+)/i;
    const batchNumberRegex27 = /Batch No. : (\w+)\s+Mfg. Date : (\w+\d+)\s+Expiry Date: (\w+\d+)\s+M.R.P. Rs. : (.*?)\s+\(/;

    //Manufacturing Date
    const manufacturingDateRegex1 = /MFD\.([A-Z]{3}\.\d{2})/;
    const manufacturingDateRegex2 = /MFG\.([A-Z]{3}\.\d{2})/;
    const manufacturingDateRegex3 = /MFG\.([A-Z]+\.\d{4})/;
    const manufacturingDateRegex4 = /([A-Z]+\.\d{4})/;
    const manufacturingDateRegex6 = /MFD\.(\d{2}\.\d{2}\.\d{2})/;
    const manufacturingDateRegex7 = /Mfg\.Date:\s*(\d{2}\/\d{4})/;
    const manufacturingDateRegex8 = /Mfg\. Date ([A-Z]{3}\.\d{4})/;
    const manufacturingDateRegex9 = /Mfg\.Dt\.:(.+)/;
    const manufacturingDateRegex10 = /Mfg\.Date: ([A-Z]+\s\d{4})/;
    const manufacturingDateRegex11 = /MFD\.([A-Z]{3} \d{2})/;
    const manufacturingDateRegex12 = /Mfg\.Dt:([A-Z]{3}\.\d{4})/;
    const manufacturingDateRegex13 = /MFG\.([A-Z]{3}\.\d{4})/;
    const manufacturingDateRegex14 = /Mfg\.Dt:([A-Z]{3}\.\d{2})/;
    const manufacturingDateRegex15 = /Mfg.Date:([A-Z]{3}\.\d{4})/;
    const manufacturingDateRegex16 = /Mfg\.Date:([A-Z]{3}\.\d{4})/;
    const manufacturingDateRegex17 = /Mfg\.Date:([\d/]+)/;
    const manufacturingDateRegex18 = /Mfg\.Date: ([A-Z]{3}\.\d{4})/;
    const manufacturingDateRegex19 = /MFD\.:(\w{3}\.\d{2})/;
    const manufacturingDateRegex20 = /MFD\.([A-Z]{3}:\d{2})/;
    const manufacturingDateRegex21 = /WFD\.([A-Z]+:\d{2})/;
    const manufacturingDateRegex22 = /MFD\. ([A-Z]{3}\. \d{4})/;
    const manufacturingDateRegex23 = /MFG\.(\d{2}\/\d{4})/;
    const manufacturingDateRegex24 = /MFG\.(\d{2}\/\d{4})/;
    const manufacturingDateRegex25 = /MFD\. ([A-Z]{3}\.\d{4})/;
    const manufacturingDateRegex26 = /MFD\. ([A-Z]{3}\. \d{4})/;
    const manufacturingDateRegex27 = /MFD\.\s*(\w+\s+\d{4})/;
    const manufacturingDateRegex28 = /MFD\.\s+([A-Z]{3}\.\s+\d{4})/;
    const manufacturingDateRegex29 = /MFD\.\s+([A-Z]{3})\.\s+(\d{4})/;
    const manufacturingDateRegex30 = /MFD\. +([A-Z]+\.? +\d+)/;
    const manufacturingDateRegex31 = /\d{2}\/\d{4}/;
    const manufacturingDateRegexall = /M(?:fg|FD|FG|F\.D)\.? ?(?:Date)?(?:\.|:)?:? ?([A-Z]{3}\. ?\d{1,2}(?: ?\d{2})?)/i;
    const manufacturingDateRegex32 = /MFD\s([A-Z]{3}\.\d{2})/;
    const manufacturingDateRegex33 = /MED\s+([A-Z]{3}\.\d{2})/;
    const manufacturingDateRegex34 = /MFD\.([A-Z]{3}\s+\d{2})/;
    const manufacturingDateRegex35 = /MFD\.([A-Z]{3}\.\d{2})/;
    const manufacturingDateRegex36 = /MFD\.(\d{2}\.\d{2}\.\d{2})/;


    //Expiry Date
    const expiryDateRegex1 = /EXP\.([A-Z]{3}\.\d{2})/;
    const expiryDateRegex2 = /Expiry Date: ([A-Z]+\.\d{2})/;
    const expiryDateRegex3 = /EXPIRY DATE ([A-Z]+\.\d{4})/;
    // const expiryDateRegex4 = /([A-Z]+\.\d{4})/;
    const expiryDateRegex5 = /EXP\.([A-Z]{3}\.\d{4})/;
    // const expiryDateRegex6 = /(\d{2}\/\d{4})/;
    const expiryDateRegex7 = /Expiry Date:(.+)/;
    const expiryDateRegex8 = /EXP\.(\d{2}\.\d{2}\.\d{2})/;
    const expiryDateRegex9 = /(\d{2}\/\d{4}):(\d{2}\/\d{4})/;
    const expiryDateRegex10 = /EXP\.Dt\.:(.+)/;
    const expiryDateRegex11 = /Expiry Date: ([A-Z]+\.\d{4})/;
    const expiryDateRegex12 = /EXP\. ([A-Z]{3}\.\d{2}\.\d{2})/;
    const expiryDateRegex13 = /Expiry Date:([A-Z]{3}\.\d{4})/;
    const expiryDateRegex14 = /EXPIRY DATE\.([A-Z]{3}\.\d{4})/;
    const expiryDateRegex15 = /Expiry Date:([A-Z]{3}\.\d{2})/;
    const expiryDateRegex16 = /Use Before: ([A-Z]{3}\.\d{4})/;
    const expiryDateRegex17 = /EXPIRY DATE: ([A-Z]{3}\.\d{4})/;
    const expiryDateRegex18 = /Expiry Date:([\d/]+)/;
    const expiryDateRegex19 = /EXP\.:(\w{3}\.\d{2})/;
    const expiryDateRegex20 = /EXPI?([A-Z]{3}\.\d{2})/;
    const expiryDateRegex21 = /EXPIDEC\.(\d{2})/;
    const expiryDateRegex22 = /EXP\. ([A-Z]{3} \d{4})/;
    const expiryDateRegex23 = /EXP\.(\d{2}\/\d{4})/;
    const expiryDateRegex24 = /EXP\.(\w)/;
    const expiryDateRegex25 = /EXP\. ([A-Z]{3}\. \d{4})/;
    const expiryDateRegex26 = /EXP\.\s*(\w+\s+\d{4})/;
    const expiryDateRegex27 = /EXP\.\s+([A-Z]{3})\s+(\d{4})/;
    const expiryDateRegex28 = /EXP\. +([A-Z]+\.? +\d+)/;
    const expiryDateRegex29 = /\d{2}\/\d{4}/g;
    const expiryDateRegex2All = /Exp(?:iry)?\.? ?(?:Date)?(?:\.|:)?:? ?([A-Z]{3}\. ?\d{1,2}(?: ?\d{2})?)/i;
    const expiryDateRegex30 = /EXP\.([A-Z]{3}\.\d{2})/;
    const expiryDateRegex31 = /Expiry\s*Date\s*:\s*(JUN\s*\d{4})|(MAY\s*\d{4})/;
    const expiryDateRegex32 = /\b(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+\d{4}\b/gi;
    const expiryDateRegex33 = /EXP\.([A-Z]{3}\.\d{2})/;
    const expiryDateRegex34 = /EXP (\d{2}\.\d{2}\.\d{2})/;
    const expiryDateRegex35 = /[A-Z]{3}\.\d{2}/g
    const expiryDateRegex36 = /[A-Z]{3}\.\d{4}/g;
    //MRP
    const mrpValueRegex1 = /M\.R\.P\.RS\.([\d.]+)/;
    const mrpValueRegex2 = /M\.R\.P\.RS:\s*([\d.]+)/;
    const mrpValueRegex3 = /M\.R\.P\. DOLLAR SIGN ([\d.]+)/;
    const mrpValueRegex4 = /M\.R\.P\.RS: ([\d.]+)/;
    const mrpValueRegex5 = /M.R.P.RS: ([\d.]+)/;
    const mrpValueRegex6 = /MRP\.RS\.([\d.]+)/;
    const mrpValueRegex7 = /M\.R\.P\. DOLLAR SIGN\. ([\d.]+)/;
    const mrpValueRegex8 = /RS\.([\d.]+)/;
    const mrpValueRegex9 = /M\.R\.P\.PER STRIP OF TABS\.RS\.([\d.]+)/;
    const mrpValueRegex10 = /M\.R\.P\.PER STRIP OF TABS\. RS\.([\d.]+)/;
    const mgfDateRegex11 = /Mfg\.Date:(.+)/;
    const mrpValueRegex12 = /M\.R\.P\.RS.:([\d.]+)/;
    const mgfLicNoRegex13 = /Mfg\.Lic\.No\.:(.+)/;
    const mgfLicNoRegex14 = /MFD\.([A-Z]{3}:\d{2})/;
    const mgfLicNoRegex15 = /M\.R\. > ([\d,]+)/;
    const mrpValueRegex16 = /M\.R\.P\.(\d+\.\d+)/;
    const mrpValueRegex17 = /M\.R\..Rs\.([\d.]+)/;
    const mrpValueRegex18 = /M\.R\.P\.Rs\.([\d.]+)/;
    const mrpValueRegex19 = /M\.R\.P\.([\d.]+)/;
    const mrpValueRegex20 = /M\.R\.P\.\d+\.\d{2}/;
    const mrpValueRegex21 = /\d{2}-\d{2}/;
    const mrpRegex = /M\.R\.P\.\s*(\d+\.\d+)/;
    const batchNumberRegex = /B\.No\.\s*(\d+)/;
    const mrpValueRegex22 = /M\.R\.P\.RS:([\d.]+)/;


    //batch No. Start
    if (!this.BatchNo) {
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegexall);
      }
      if (!this.BatchNo) {
        // this.BatchNo = this.extractInformation(DetectedText, batchNumberRegexall1);
      }
      if (!this.BatchNo) {
        // this.BatchNo = this.extractInformation(DetectedText, batchNumberRegexall2);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex1);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex2);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex3);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex4);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex5);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex6);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex7);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex8);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex9);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex10);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex11);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex12);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, rebatchNumberRegex13);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, rebatchNumberRegex14);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex15);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex16);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex17);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex18);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex19);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex20);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex21);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex22);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex23);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex24);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex25);
      }
      if (!this.BatchNo) {
        this.BatchNo = this.extractInformation(DetectedText, batchNumberRegex27);
      }

    }
    //Manufacturing Date Start
    if (!this.ManufacturingDate) {

      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegexall);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, regexDigitalAll);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex1);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex2);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex3);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex4);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex6);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex7);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex8);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex9);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex10);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex11);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex12);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex13);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex14);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex15);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex16);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex17);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex18);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex19);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex20);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex21);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex22);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex23);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex24);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex25);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex26);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex27);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex28);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex29);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex30);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex31);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex32);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex33);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex34);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex35);
      }
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = this.extractInformation(DetectedText, manufacturingDateRegex36);
      }

    }
    //Expiry Date Start
    if (!this.ExpiryDate) {

      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex2All);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex1);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex2);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex3);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex5);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex7);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex8);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex9);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex10);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex11);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex12);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex13);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex14);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex15);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex16);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex17);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex18);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex19);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex20);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex21);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex22);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex23);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex24);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex25);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex26);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex27);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex28);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex29);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex30);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex31);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex32);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex33);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex34);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex35);
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = this.extractInformation(DetectedText, expiryDateRegex36);
      }

    }
    //MRP Start
    if (!this.MrpRs) {
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex1);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex2);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex3);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex4);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex5);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex6);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex7);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex8);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex9);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex10);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mgfDateRegex11);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex12);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mgfLicNoRegex13);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mgfLicNoRegex14);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mgfLicNoRegex15);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex16);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex17);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex18);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex19);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex20);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex21);
      }
      if (!this.MrpRs) {
        this.MrpRs = this.extractInformation(DetectedText, mrpValueRegex22);
      }

    }

    // const data = 'Batch No.\nMfg. Date\nExpiry Date\nM.R.P. Rs.\nper 14 Tablets\n(Inclusive of all taxes)\n:\n:\nPLHOO06\n01/2022\n06/2023\n269.00';
    // Define regular expressions to match Batch No., Mfg. Date, and Expiry Date patterns
    const batchPattern = /[A-Z]+\d+/;
    const datePattern = /\d{2}\/\d{4}/;
    const batchPattern1 = /[A-Z]{3}\d{4}/;
    const datePattern1 = /[A-Z]+\.\d{2}/;
    const datePattern2 = /[A-Z]{3}\.\d{4}/;
    // const datePattern1 = /[A-Z]{3}\s?\d{2}/;

    // Search for Batch No., Mfg. Date, and Expiry Date using regular expressions
    if (!this.BatchNo || !this.ExpiryDate || !this.ManufacturingDate) {
      const batchMatch: RegExpMatchArray | null = DetectedText.match(batchPattern);
      const mfgDateMatch: RegExpMatchArray | null = DetectedText.match(datePattern);
      const expiryDateMatch: RegExpMatchArray | null = DetectedText.slice(mfgDateMatch?.index! + mfgDateMatch?.[0].length!).match(datePattern);
      if (!this.BatchNo) {
        this.BatchNo = batchMatch ? batchMatch[0] : null;
      }
      // const expiryDate111: string
      if (!this.ManufacturingDate) {
        this.ManufacturingDate = mfgDateMatch ? mfgDateMatch[0] : null;
      }
      if (!this.ExpiryDate) {
        this.ExpiryDate = expiryDateMatch ? expiryDateMatch[0] : null;
      }
    }
    if (!this.BatchNo || !this.ExpiryDate || !this.ManufacturingDate) {
      const batchMatch: RegExpMatchArray | null = DetectedText.match(batchPattern1);
      const mfgDateMatch: RegExpMatchArray | null = DetectedText.match(datePattern1);
      const expiryDateMatch: RegExpMatchArray | null = DetectedText.slice(mfgDateMatch?.index! + mfgDateMatch?.[0].length!).match(datePattern2);
      const expiryDateMatch1: RegExpMatchArray | null = DetectedText.slice(mfgDateMatch?.index! + mfgDateMatch?.[0].length!).match(datePattern1);
      if (!this.BatchNo) {
        this.BatchNo = batchMatch ? batchMatch[0] : null;
      }
      if (!this.ManufacturingDate) { //MFGJAN.2020
        this.ManufacturingDate = mfgDateMatch ? mfgDateMatch[0] : null;
        if (this.ManufacturingDate !== null) {
          if (this.ManufacturingDate.length >= 3 && (this.ManufacturingDate.substring(0, 3) == 'MFD')) {
            var date = this.ManufacturingDate.substring(3, this.ManufacturingDate.length);
            this.ManufacturingDate = date;
          }
        }
      }
      if (!this.ExpiryDate) { //MFGJAN.2020
        this.ExpiryDate = expiryDateMatch ? expiryDateMatch[0] : null;
        if (this.ExpiryDate !== null) {
          if (this.ExpiryDate.length >= 3 && (this.ExpiryDate.substring(0, 3) == 'EXR')) {
            var date = this.ExpiryDate.substring(3, this.ExpiryDate.length);
            this.ExpiryDate = date;
          }
        }
      }
      if (!this.ExpiryDate) { //MFGJAN.2020
        this.ExpiryDate = expiryDateMatch1 ? expiryDateMatch1[0] : null;
        if (this.ExpiryDate !== null) {
          if (this.ExpiryDate.length >= 3 && (this.ExpiryDate.substring(0, 3) == 'EXR')) {
            var date = this.ExpiryDate.substring(3, this.ExpiryDate.length);
            this.ExpiryDate = date;
          }
        }
      }
    }

    //manufacturing Date Again divide in Year and Month
    const manufacturingDateRegExList = [
      /M(?:FD|FG)\.\s*([A-Z]{3}(?:\s|\.)\d{4})/,
      /MFD\. ([A-Z]{3}\. \d{4})/,
      /([A-Z]+)\.\s*(\d{4})/,
      /MFG\.(\d{2}\/\d{4})/,
      /(\d{2})\/(\d{4})/,
      /MFD\.\s*([A-Z]{3}\s\d{4})/,
      /MFD\.\s+([A-Z]{3}\.\s+\d{4})/,
      /MFD\s(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\.?(\d{2})/,
      /([A-Z]{3})\.(\d{2})/,
      /MFD\.([A-Z]{3})\.(\d{2})/,
      /^([A-Z]+)(\.\d+)$/
    ];

    //expiry Date Again divide in Year and Month
    const expiryDateRegExList = [
      /EXP?\.?\s*([A-Z]{3}(?:\s|\.)\d{4})/,
      /([A-Z]+)\.\s*(\d{4})/,
      /MFG\.(\d{2}\/\d{4})/,
      /(\d{2})\/(\d{4})/,
      /([A-Z]{3})\. (\d{4})/,
      /EXP\. ([A-Z]{3}\. \d{4})/,
      /([A-Z]{3})\.\s+(\d{4})/,
      /EXP\.(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\.?(\d{2})/,
      /([A-Z]{3})\.(\d{2})/,
      /([A-Z]{3})\s+(\d{4})/,
      /EXP\.([A-Z]{3})\.(\d{2})/,
      /EXP (\d{2}\.\d{2}\.\d{2})/,
      /^([A-Z]+)(\.\d+)$/
    ];

    const ShortDDMMYY = [
      /(\d{2})\.(\d{2})\.(\d{2})/  //10.02.23 format
    ];

    const manufacturingDateInfo = this.extractDateInfo(this.ManufacturingDate, manufacturingDateRegExList);
    const expiryDateInfo1 = this.extractDateInfo(this.ExpiryDate, expiryDateRegExList);
    const expiryDateInfo = this.extractDateInfoDDMMYY(this.ExpiryDate, ShortDDMMYY);
    const manufacturingDateInfo1 = this.extractDateInfoDDMMYY(this.ManufacturingDate, ShortDDMMYY);
    if (expiryDateInfo) {
      this.ExpiryDateDay = expiryDateInfo.day;
      this.ExpiryDateMonth = expiryDateInfo.month;
      this.ExpiryDateYear = expiryDateInfo.year;
    }
    if (manufacturingDateInfo1) {
      this.ManufacturingDateDay = manufacturingDateInfo1.day;
      this.ManufacturingDateMonth = manufacturingDateInfo1.month;
      this.ManufacturingDateYear = manufacturingDateInfo1.year;
    }
    if ((manufacturingDateInfo) && (this.ManufacturingDateMonth === null || this.ManufacturingDateMonth === undefined || this.ManufacturingDateYear === undefined || this.ManufacturingDateYear === null)) {
      this.ManufacturingDateMonth = manufacturingDateInfo.month;
      this.ManufacturingDateYear = manufacturingDateInfo.year;
    }
    if ((expiryDateInfo1) && (this.ExpiryDateMonth === null || this.ExpiryDateMonth === undefined || this.ExpiryDateYear === undefined || this.ExpiryDateYear === null)) {
      this.ExpiryDateMonth = expiryDateInfo1.month;
      this.ExpiryDateYear = expiryDateInfo1.year;
    }
    this.ConvertorConcateData(this.ManufacturingDateMonth, this.ManufacturingDateYear, this.ExpiryDateMonth, this.ExpiryDateYear);

    if (this.ExpiryDate !== null) {
      const currentDate = new Date(this.TodayDateForFilter);
      const expiryDate = new Date(this.ExpiryDate);
      if (expiryDate > currentDate) {
        this.f.Returntype.setValue('Expiry');
      } else {
        this.f.Returntype.setValue('Damage');
      }
      this.ExpiryDate = this.DateFormatForDDMMYYYY(expiryDate);
    }

    if (this.BatchNo !== null && this.BatchNo !== undefined && this.BatchNo !== "") {
      this.onChangeBatchNo();
    }
    this.chef.detectChanges();
  }


  extractDateInfo(input: any, regexList: any) {
    if (input !== null && input !== undefined && input !== "")
      for (const regex of regexList) {
        const match = input.match(regex);
        if (match !== null) {
          return { month: match[1], year: match[2] };
        }
      }
    return null;
  }

  extractDateInfoDDMMYY(input: any, regexList: any) {
    if (input !== null && input !== undefined && input !== "")
      for (const regex of regexList) {
        const match = input.match(regex);
        if (match !== null) {
          return { day: match[1], month: match[2], year: match[3] };
        }
      }
    return null;
  }

  ValidDateFormat(ManufacturingDate: any, ExpiryDate: any) {
    this.ManufacturingDateMonth = "";
    this.ExpiryDateMonth = "";
    this.ExpiryDateYear = "";
    if (ManufacturingDate !== null && ExpiryDate !== null) {
      if ((ManufacturingDate.length <= 6 && ExpiryDate.length <= 6)) {
        this.ManufacturingDateSubstring(ManufacturingDate);
        this.ExpiryDateDevideSubstring(ExpiryDate);
      }
      if (ManufacturingDate.length >= 6 && ExpiryDate.length >= 6) {
        this.ManufacturingDateSubstringGrtrsix(ManufacturingDate);
        this.ExpiryDateDevideSubstringGrtrsix(ExpiryDate);
      }
      if (ManufacturingDate.length <= 6) {
        this.ManufacturingDateSubstring(ManufacturingDate);
      }
      if (ExpiryDate.length <= 6) {
        this.ExpiryDateDevideSubstring(ExpiryDate);
      }
      if (this.ManufacturingDateYear.length === 2 || this.ExpiryDateYear.length === 2) {
        this.ManufacturingDateYear = "20" + this.ManufacturingDateYear;
        this.ExpiryDateYear = "20" + this.ExpiryDateYear;
        // this.ConvertorConcateData();
      }
      // this.ConvertorConcateData();
      console.log("Formatted Date ManufacturingDate -> ", this.ManufacturingDate);
      console.log("Formatted Date ExpiryDate -> ", this.ExpiryDate);
    }
    this.chef.detectChanges();
  }

  ExpiryDateDevideSubstring(ExpiryDate: any) {
    this.ExpiryDateMonth = ExpiryDate.substring(3, 0);
    this.ExpiryDateYear = ExpiryDate.substring(4, 10);
  }

  ManufacturingDateSubstring(ManufacturingDate: any) {
    this.ManufacturingDateMonth = ManufacturingDate.substring(3, 0);
    this.ManufacturingDateYear = ManufacturingDate.substring(4, 10);
  }

  ManufacturingDateSubstringGrtrsix(ManufacturingDate: any) {
    this.ManufacturingDateMonth = ManufacturingDate.substring(0, 2);
    this.ManufacturingDateYear = ManufacturingDate.substring(3, 10);
  }

  ExpiryDateDevideSubstringGrtrsix(ExpiryDate: any) {
    this.ExpiryDateMonth = ExpiryDate.substring(0, 2);
    this.ExpiryDateYear = ExpiryDate.substring(3, 10);
  }

  ConvertorConcateData(ManufacturingDateMonth: any, ManufacturingDateYear: any, ExpiryDateMonth: any, ExpiryDateYear: any) {
    // Define a regular expression to match the characters to be removed   //example '20.20';
    const removeCharsPattern = /[.,\/";'{}=\-()\s]/g;
    if (ManufacturingDateMonth !== "" && ManufacturingDateMonth !== undefined && ManufacturingDateMonth !== null
      || ManufacturingDateYear !== "" && ManufacturingDateYear !== undefined && ManufacturingDateYear !== null) {
      //If Year is Short Format
      if (ManufacturingDateYear.length <= 3) {
        var AttachingYear, FullYear;
        if (ManufacturingDateMonth === 'AN') {
          ManufacturingDateMonth = 'JAN';
        }
        if (ManufacturingDateMonth === 'OC') {
          ManufacturingDateMonth = 'OCT';
        }
        if (ManufacturingDateMonth === 'A') {
          ManufacturingDateMonth = 'AUG';
        }
        FullYear = AttachingYear = '20' + ManufacturingDateYear;
        FullYear.replace(removeCharsPattern, '');
        this.ManufaturingDateFormat = ("01" + "-" + ManufacturingDateMonth + "-" + FullYear);
        this.ManufacturingDate = this.DateFormatForYYYYMMDD(this.ManufaturingDateFormat);
      }
      else {
        this.ManufaturingDateFormat = ("01" + "-" + ManufacturingDateMonth + "-" + ManufacturingDateYear);
        this.ManufacturingDate = this.DateFormatForYYYYMMDD(this.ManufaturingDateFormat);
      }
    }
    if (ExpiryDateMonth !== "" && ExpiryDateMonth !== undefined && ExpiryDateMonth !== null
      || ExpiryDateYear !== "" && ExpiryDateYear !== undefined && ExpiryDateYear !== null) {
      //If Year is Short Format
      if (ExpiryDateYear.length <= 3) {
        var AttachingYear, FullYear;
        if (ExpiryDateMonth === 'AUL') {
          ExpiryDateMonth = 'JUL';
        }
        if (ExpiryDateMonth === 'AN') {
          ExpiryDateMonth = 'JAN';
        }
        if (ExpiryDateMonth === 'OC') {
          ExpiryDateMonth = 'OCT';
        }
        if (ExpiryDateMonth === 'A') {
          ExpiryDateMonth = 'AUG';
        }
        FullYear = AttachingYear = '20' + ExpiryDateYear
        FullYear.replace(removeCharsPattern, '');
        this.ExpiryDateFormat = String("01" + "-" + ExpiryDateMonth + "-" + FullYear);
        this.ExpiryDate = this.DateFormatForYYYYMMDD(this.ExpiryDateFormat);
      } else {
        this.ExpiryDateFormat = String("01" + "-" + ExpiryDateMonth + "-" + ExpiryDateYear);
        this.ExpiryDate = this.DateFormatForYYYYMMDD(this.ExpiryDateFormat);
      }
    }
  }

  // return date format
  DateFormatForDDMMYYYY(CommonDateFormat: any) {
    return formatDate(CommonDateFormat, 'dd-MM-yyyy ', 'en-US') //dd-MM-yyyy
  }

  // return date format
  DateFormatForYYYYMMDD(CommonDateFormat: any) {
    return formatDate(CommonDateFormat, 'yyyy-MM-dd ', 'en-US') //yyyy-MM-dd
  }

  // Match key and Return value
  extractInformation(str: any, regex: any) {
    if (str !== null) {
      var match = str.match(regex);
    }
    return match ? match[1] : null
  }

  // save OCR Data
  SaveOCRData() {
    // debugger
    this.submitted = true;
    this.isLoading = true;
    if (!this.OCRSaveDataForm.valid) {
      this.isLoading = false;
      return;
    }
    this.OCRDataModel.BranchId = this.BranchId;
    this.OCRDataModel.CompId = this.CompanyId;
    this.OCRDataModel.StockistId = this.f1.StockistName.value.StockistId;
    this.OCRDataModel.LR_ClaimNo = this.f.LrClaimNo.value;
    this.OCRDataModel.BatchNo = this.BatchNo;
    this.OCRDataModel.Quantity = this.f.Quantity.value;
    this.OCRDataModel.Unit = this.f.Unit.value;
    this.OCRDataModel.Code = this.f.Code.value;
    this.OCRDataModel.ProductName = this.f.ProductName.value;
    this.OCRDataModel.Returntype = this.f.Returntype.value;
    this.OCRDataModel.EXP_Date = this.ExpiryDate;
    this.OCRDataModel.MFG_Date = this.ManufacturingDate;
    this.OCRDataModel.MRP_Price = this.MrpRs;
    this.OCRDataModel.Addedby = String(this.UserId);
    this.OCRDataModel.Action = AppCode.addString;
    this._ocrSerivce.SaveOCRData_Service(this.OCRDataModel)
      .subscribe((data: any) => {
        if (data > 0) {
          this._ToastrService.success(AppCode.msg_saveSuccess);
          this.ClearForm();
          this.ClearImage();
          this.submitted = false;
          this.isColorBlack = false;
          this.isFlagTimer = false;
        }
        else if (data < 0) {
          this._ToastrService.warning('Batch no already exists!');
        } else {
          this._ToastrService.error(AppCode.FailStatus);
        }
        this.isLoading = false;
        this.chef.detectChanges();
      }, (error: any) => {
        console.log('Error:  ' + JSON.stringify(error));
        this.isLoading = false;
        this.chef.detectChanges();
      });
  }

  ClearImage() {
    this.webcamImage = undefined;
    this.captureImage = "";
    this.captureImageNew = "";
    this.typeRectBoxValue = "";
    this.isLoading = false;
    this.isFlagTimer = false;
    this.chef.detectChanges();
  }

  ClearForm() {
    this.f.LrClaimNo.setValue("");
    this.f.Quantity.setValue("");
    this.f.Unit.setValue("");
    this.f.Code.setValue("");
    this.f.ProductName.setValue("");
    this.f.Returntype.setValue("");
    this.BatchNo = "";
    this.ExpiryDate = "";
    this.ManufacturingDate = "";
    this.modalService.dismissAll();
    this.isLoading = false;
    this.ClearImage();
    this.chef.detectChanges();
  }

  public getSnapshot(content: any): void {
    // debugger
    // if (this.f1.StockistName.value.StockistId === null || this.f1.StockistName.value.StockistId === "" ||
    //   this.f1.StockistName.value.StockistId === undefined) {
    //   // this._ToastrService.warning('Please Select Stockist');
    //   return;
    // }
    // this.trigger.next(void 0);
    this.AddEditModel = this.modalService.open(content, {
      centered: true,
      size: 'xl',
      backdrop: 'static'
    });
    if (this.pageState === AppCode.saveString) {
      this.Title = 'Add OCR';
      this.f.Unit.setValue("EA"); // by default EA
    }

  }

  public get invokeObservable(): Observable<any> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<any> {
    return this.nextWebcam.asObservable();
  }

  // Bind on
  onChangeBatchNo() {
    // this.isLoading = true;
    // this._ocrSerivce.GetProductDetailsByBatchNo_Service(this.BatchNo)
    //   .subscribe((data: any) => {
    //     if (data !== null) {
    //       this.f.Code.setValue(data.Code);
    //       this.f.ProductName.setValue(data.ProductName);
    //       this.isLoading = false;
    //       this.chef.detectChanges();
    //     }
    //   }, (error) => {
    //     console.error(error);
    //     this.isLoading = false;
    //     this.chef.detectChanges();
    //   });
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  // return a promise that resolves with a File instance
  urltoFile(url: string, filename: string, mimeType: string) {
    return (fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
  }

  // return mime Type of bs64
  base64MimeType(encoded: string) {
    var result = null;
    if (typeof encoded !== 'string') {
      return result;
    }
    var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
      result = mime[1];
    }
    return result;
  }

  // To Rectangle & Square Box change behavior
  RectangleBox(typeRectBox: string) {
    let myWidth = window.innerWidth;
    let mediaQuery = window.matchMedia("screen and (max-width: " + myWidth + "px)");
    if (mediaQuery.matches) {
      let container: any = <HTMLElement>document.getElementById('myDiv');
      if (typeRectBox === "square") {
        container.style.position = "absolute";
        container.style.height = "53%";
        container.style.width = "25%";
        container.style.border = "1px white solid";
        container.style.bottom = "20px";
        container.style.margin = "5% 6% 3% 3%";
      } else {
        container.style.position = "absolute";
        container.style.height = "35%";
        container.style.width = "24%";
        container.style.border = "1px white solid";
        container.style.bottom = "20px";
        container.style.margin = "0% 2% 4% 4%";
      }
      this.typeRectBoxValue = typeRectBox;
      this.chef.detectChanges();
    }
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
    // this.trigger.unsubscribe();
  }

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';
  OcrTextData: any;

  selectFile(event: any) {
    if (this.f1.StockistName.value.StockistId === null || this.f1.StockistName.value.StockistId === "" ||
      this.f1.StockistName.value.StockistId === undefined) {
      this._ToastrService.warning('Please Select Stockist');
      return;
    }
    let formData = new FormData();
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;
    if (this.selectedFiles) {
      const file: File | null | any = this.selectedFiles.item(0);
      formData.append('upload', file);
      this._ocrSerivce.GetOCRImageTextData(formData)
        .subscribe((data: any) => {
          this.ConvertDataForSave(data.DetectedText);
          this.OcrTextData = data.DetectedText;
          this.chef.detectChanges();
        });
      if (file) {
        this.preview = '';
        this.currentFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }

}
