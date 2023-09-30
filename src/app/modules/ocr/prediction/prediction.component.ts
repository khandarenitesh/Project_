import { AppCode } from 'src/app/app.code';
import { formatDate, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewChild, Renderer2 } from '@angular/core';
import { Observable, Subject, Subscription, interval, timer } from 'rxjs';
import { MastersServiceService } from '../../master-forms/Services/masters-service.service';
import { OcrIntegrationService } from '../Services/ocr-integration.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { OCRDataModel } from '../models/OCRDataModel';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {
  CommonDateFormat: any;
  imageName: string = "";
  imgDt: Date = new Date();
  captureImageNew: string = "";
  // captureImageNew1: string = "";
  captureImageNew1: any;
  typeRectBoxValue: string = "";
  isFlagTimer: boolean = false;
  isColorBlack: boolean = false;
  @ViewChild('video') videoElement: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement: ElementRef<HTMLCanvasElement>;

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
  AddEditModel: any; // popup
  Title: string = "";
  searchModel: string = '';
  defaultform: any = {
    Quantity: '',
    Unit: '',
    Code: '',
    ProductName: '',
    Returntype: '',
    ExpiryDates: ''
  };
  defaultform1: any = {
    StockistName: '',
    LrClaimNo: '',
  };
  webcamImage: WebcamImage | undefined;
  captureImage: string = "";
  BatchNoList: any[] = [];
  IsStockistDisable: boolean = false;
  recognizedText: string = '';
  typeRectBox: string = "rectangle";
  CurrentDateTime = new Date();
  TodayDateForFilter: any;
  subscription: Subscription;
  goForImageCapture: boolean = false;
  Framecolr1: any = "B";
  waitForBlackFrame = true;
  isColorBlack1: any;
  Framecolr: any;
  disablefield: boolean = true;
  isRectangleClicked = false;
  isSquareClicked = false;
  Code: string = '';
  Unit: string = "";
  Returntype: string = "";
  Division: string = "";
  Framecolr3: any = 'D';
  timer: number = 0;
  showDialog: boolean = false;
  showNotice: boolean = false;
  rxjsTimer: Observable<number>;
  destroy: Subject<void> = new Subject<void>();
  enableMouseClickEvents = false;
  avoidMouseEvents = false;
  captureSpacebarKeyPress = true;


  constructor(private _service: MastersServiceService, private _ToastrService: ToastrService, private fb: FormBuilder,
    private chef: ChangeDetectorRef, private _ocrSerivce: OcrIntegrationService, private fb1: FormBuilder,
    private modalService: NgbModal, @Inject(PLATFORM_ID) private platformId: Object, private chRef: ChangeDetectorRef,
    private renderer: Renderer2, private el: ElementRef) {
    this.rxjsTimer = timer(0, 1000); // Emits values starting from 0 every 1000ms (1 second)
  }

  ngOnInit() {
    this.onStart();
    this.initForm();
    this.pageState = AppCode.saveString;
    this.btnCancelText = AppCode.cancelString;
    this.stockistforminit();
    let obj = AppCode.getUser();
    this.UserId = obj.UserId;
    this.BranchId = obj.BranchId;
    this.CompanyId = obj.CompanyId;
    this.GetStockistList();
    this.GetOCRTextData();
    this.RectangleBox(this.typeRectBox);
    this.TodayDateForFilter = formatDate(this.CurrentDateTime, 'yyyy-MM-dd', 'en-US');
    this.DisabledField();
    window.addEventListener('mousedown', this.mouseClickListener);
  }


  //form initilization
  initForm() {
    this.OCRSaveDataForm = this.fb.group({
      Quantity: [
        this.defaultform.Quantity,
        Validators.compose([
          Validators.required
        ]),
      ],
      // Unit: [
      //   this.defaultform.Unit,
      //   Validators.compose([
      //     Validators.required
      //   ]),
      // ],
      // Code: [
      //   this.defaultform.Code,
      //   Validators.compose([
      //     Validators.required,

      //   ]),
      // ],
      ProductName: [
        this.defaultform.ProductName,
        Validators.compose([
          Validators.required,
        ]),
      ],
      ExpiryDates: [
        this.defaultform.ExpiryDates,
        Validators.compose([
          Validators.required,
        ]),
      ],
      // Returntype: [
      //   this.defaultform.Returntype,
      //   Validators.compose([
      //     Validators.required
      //   ]),
      // ],
      // Division: [
      //   this.defaultform.Division,
      //   Validators.compose([
      //     Validators.required
      //   ]),
      // ],
    });
  }

  get f1(): { [key: string]: AbstractControl } {
    return this.StockistForm.controls;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.OCRSaveDataForm.controls;
  }

  DisabledField() {
    this.f.ExpiryDates.disable();
    this.f.ProductName.disable();
    // this.f.Division.disable();
    // this.f.Returntype.disable();
    // this.f.Unit.disable();
    // this.f.Code.disable();
    this.chRef.detectChanges();
  }

  stockistforminit() {
    this.StockistForm = this.fb1.group({
      LrClaimNo: [
        this.defaultform1.LrClaimNo,
        Validators.compose([
          Validators.required
        ]),
      ],
      StockistName: [
        this.defaultform1.StockistName,
        Validators.compose([
          Validators.required,
        ])
      ],
    });
  }

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

  saveRGBData(R_Color: number, G_Color: number, B_Color: number) {
    this.OCRDataModel = new OCRDataModel();
    this.OCRDataModel.R_Color = R_Color;
    this.OCRDataModel.G_Color = G_Color;
    this.OCRDataModel.B_Color = B_Color;
    this._ocrSerivce.SaveRGBData_Service(this.OCRDataModel).subscribe((data: any) => {
      if (data !== null) {
        // this._ToastrService.success(AppCode.msg_RGBsaveSuccess);
      }
    })
    this.chRef.detectChanges();
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
    this.f1.LrClaimNo.setValue("");
    this.GetStockistList();
  }

  onStart() {
    if (isPlatformBrowser(this.platformId) && 'mediaDevices' in navigator) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream: MediaStream) => {
          const video: HTMLVideoElement = this.videoElement.nativeElement;
          video.srcObject = mediaStream;
          video.play();
          // this.captureFrames();
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    }
  }

  onStop() {
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    const mediaStream: MediaStream = video.srcObject as MediaStream;

    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => track.stop());

      video.pause();
      video.srcObject = null;
    }
  }

  mouseClickListener = (e: MouseEvent) => {
    if (!this.enableMouseClickEvents || this.avoidMouseEvents) {
      e.preventDefault(); // Prevent the default behavior (mouse click)
    }
  };

  enableMouseClick() {
    this.enableMouseClickEvents = true;
    window.removeEventListener('mousedown', this.mouseClickListener);
  }

  disableMouseClick() {
    this.enableMouseClickEvents = false;
    window.addEventListener('mousedown', this.mouseClickListener);
  }

  async CaptureImageOnKeyPlusKeyPress(event: any) {
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    const canvas: HTMLCanvasElement = this.canvasElement.nativeElement;
    const imgElement = new Image();
    let formData = new FormData();
    this.OCRDataModel.Unit = this.Unit = "EA";

    if ((event && event.keyCode === 32)) { // Check for keyCode 32 for the Space key
      const ctx: CanvasRenderingContext2D | any = canvas.getContext('2d');
      let boxtype = this.typeRectBoxValue;
      const capturedFrame: string = canvas.toDataURL('image/png');
      imgElement.src = capturedFrame;

      // Add event listener to capture image on Space key press
      const spaceKeyListener = (e: KeyboardEvent) => {
        if (e.key === ' ' && this.captureSpacebarKeyPress) {
          window.removeEventListener('keydown', spaceKeyListener); // Remove the listener after Space key press
          this.CaptureImageOnKeyPlusKeyPress(e);
        }
      };

      window.addEventListener('keydown', spaceKeyListener);
      // Wait for a short duration  
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000); // 1000 milliseconds = 1 second
      });

      // Draw frame based on boxtype
      if (boxtype === "square") {
        ctx.drawImage(video, 110, 160, 200, 320, 0, 0, 300, 300);
        this.isSquareClicked = true;
        this.isRectangleClicked = false; // Reset the other icon
      } else {
        ctx.drawImage(video, 90, 130, 440, 395, 0, 0, 300, 300);
        this.isRectangleClicked = true;
        this.isSquareClicked = false; // Reset the other icon
      }

      this.captureImageNew1 = canvas.toDataURL('image/png', 1.0);
      this.imageName = "capture_" + this.imgDt.getDate() + "_" + this.imgDt.getMinutes() + "_" + this.imgDt.getSeconds() + ".png";
      var file = await this.urltoFile(this.captureImageNew1, this.imageName, 'image/png');
      console.log("Space key event captured -> " + file.name);
      formData.append('upload', file);
      this.ClearForm();
      this._ocrSerivce.GetOCRImageTextData(formData)
        .subscribe((data: any) => {
          this.recognizedText = "";
          if (data.DetectedText !== null) {
            this.recognizedText = data.DetectedText;
            this.ConvertDataForSave(this.recognizedText);
            this.isLoading = false;
            this.submitted = false;
            this.f1.StockistName.disable();
            // Set focus on the Quantity input field
            const quantityInput: HTMLInputElement = this.el.nativeElement.querySelector('input[formControlName="Quantity"]');
            if (quantityInput) {
              this.renderer.selectRootElement(quantityInput).focus();
            }
            this.avoidMouseEvents = true;
            // Enable mouse click events
            this.enableMouseClick();
          }
        });

      this.disableMouseClick(); // Disable mouse click events

      event = null;
      requestAnimationFrame(() => this.CaptureImageOnKeyPlusKeyPress(event));
      console.log('First Time captured!');
    } else {
      // Wait for a short duration
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000); // 2000 milliseconds = 2 seconds
      });
      requestAnimationFrame(() => this.CaptureImageOnKeyPlusKeyPress(event));
      console.log('Image not captured until Space key event is not fired!');
      this.isLoading = false;
      this.chRef.detectChanges();
    }
  }


  SaveOCRData(event: any) {
    if (event.keyCode === 13 && this.f.Quantity.value !== "") {
      this.submitted = true;
      this.isLoading = true;
      if (!this.OCRSaveDataForm.valid || !this.StockistForm.valid) {
        if (this.f1.StockistName.value.StockistId === null || this.f1.StockistName.value.StockistId === undefined) {
          this._ToastrService.warning('Please select a stockist!');
        }
        this.isLoading = false;
        return;
      }
      this.OCRDataModel.BranchId = this.BranchId;
      this.OCRDataModel.CompId = this.CompanyId;
      this.OCRDataModel.StockistId = this.f1.StockistName.value.StockistId;
      this.OCRDataModel.LR_ClaimNo = this.f1.LrClaimNo.value;
      this.OCRDataModel.EXP_Date = this.f.ExpiryDates.value;
      this.OCRDataModel.BatchNo = this.BatchNo;
      this.OCRDataModel.Quantity = this.f.Quantity.value;
      this.OCRDataModel.Code = this.Code;
      this.OCRDataModel.Unit = this.Unit;
      this.OCRDataModel.ProductName = this.f.ProductName.value;
      if (this.f.ExpiryDates.value !== null) {
        const currentDate = new Date(this.TodayDateForFilter);
        const expiryDate = new Date(this.f.ExpiryDates.value);
        if (expiryDate > currentDate) {
          this.Returntype = "Expiry";
        } else {
          this.Returntype = "Damage";
        }
      }
      this.OCRDataModel.Returntype = this.Returntype;
      this.OCRDataModel.MFG_Date = this.ManufacturingDate;
      this.OCRDataModel.MRP_Price = this.MrpRs;
      this.OCRDataModel.Addedby = String(this.UserId);
      this.OCRDataModel.Action = AppCode.addString;
      this.OCRDataModel.Division = this.Division;
      var BNo = this.BatchNo;
      this._ocrSerivce.SaveOCRData_Service(this.OCRDataModel)
        .subscribe((data: any) => {
          if (data > 0) {
            this._ToastrService.success(' " ' + BNo + ' " ', AppCode.msg_OcrsaveSuccess);
            this.GetOCRTextData();
            this.captureImageNew1 = "";
            this.ClearForm();
            this.ClearImage();
            this.DisabledField();
            this.submitted = false;
            this.isColorBlack = false;
            this.isFlagTimer = false;
            this.captureSpacebarKeyPress = false;
            const quantityInput: HTMLInputElement = this.el.nativeElement.querySelector('input[formControlName="Quantity"]');
            if (quantityInput) {
              quantityInput.blur(); // Remove focus from the input element
            }

            // Add event listener to capture image on Space key press
            const spaceKeyListener = (e: KeyboardEvent) => {
              if (e.key === ' ') {
                window.removeEventListener('keydown', spaceKeyListener); // Remove the listener after Space key press
                this.CaptureImageOnKeyPlusKeyPress(e);
              }
            };
            window.addEventListener('keydown', spaceKeyListener);

          } else if (data < 0) {
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
    this.submitted = false;
  }

  onChangeAllInputField() {
    const spaceKeyListener = (e: KeyboardEvent) => {
      if (e.key === '') {
        window.removeEventListener('keydown', spaceKeyListener); // Remove the listener after Space key press
        this.CaptureImageOnKeyPlusKeyPress(e);
      } else {
        window.addEventListener('keydown', spaceKeyListener);
      }
    };
    // window.addEventListener('keydown', spaceKeyListener);
    this.enableMouseClick();

  }

  async recursiveFirstTimeObject(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    const ctx: CanvasRenderingContext2D | any = canvas.getContext('2d');
    const imgElement = new Image();
    let boxtype = this.typeRectBoxValue;
    const capturedFrame: string = canvas.toDataURL('image/png');
    imgElement.src = capturedFrame;
    // Wait for a short duration
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000); // 2000 milliseconds = 5 seconds
    });

    // Draw frame based on boxtype
    if (boxtype === "square") {
      ctx.drawImage(video, 110, 160, 200, 320, 0, 0, 300, 300);
      this.isSquareClicked = true;
      this.isRectangleClicked = false; // Reset the other icon
    } else {
      ctx.drawImage(video, 90, 130, 440, 395, 0, 0, 300, 300);
      this.isRectangleClicked = true;
      this.isSquareClicked = false; // Reset the other icon
    }
    this.Framecolr3 = 'E';
    requestAnimationFrame(() => this.captureFrameOnStart());
    this.isBlackImage(capturedFrame, canvas);
  }

  captureFrameOnStart() {
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    const canvas: HTMLCanvasElement = this.canvasElement.nativeElement;
    if (this.Framecolr3 === 'D') {
      requestAnimationFrame(() => this.recursiveFirstTimeObject(video, canvas));
      return;
    }
    if (this.Framecolr === 'B') {
      this.captureFrame(video, canvas);
    } else if (this.Framecolr === 'C') {
      this._ToastrService.warning('initially black color is required!');
      requestAnimationFrame(() => this.recursiveFirstTimeObject(video, canvas));
    }
    this.chRef.detectChanges();
  }

  private async captureFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    if (video.paused || video.ended) {
      return;
    }

    const ctx: CanvasRenderingContext2D | any = canvas.getContext('2d');
    const imgElement = new Image();
    let boxtype = this.typeRectBoxValue;
    const capturedFrame: string = canvas.toDataURL('image/png');
    imgElement.src = capturedFrame;
    // Draw frame based on boxtype
    if (boxtype === "square") {
      ctx.drawImage(video, 110, 160, 200, 320, 0, 0, 300, 300);
    } else {
      ctx.drawImage(video, 90, 130, 440, 395, 0, 0, 300, 300);
    }
    // Wait for a short duration
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000); // 5000 milliseconds = 5 seconds
    });

    if (this.waitForBlackFrame) {
      // Check if the frame is black
      this.isBlackImage(capturedFrame, canvas);
      var color = this.Framecolr;
      var COLOR1 = this.Framecolr1;
      if (color === COLOR1) {
        // Continue capturing frames recursively
        requestAnimationFrame(() => this.captureFrame(video, canvas));
        return;
      } else {
        // Proceed to capture color frames
        this.waitForBlackFrame = false;
        this.captureColorFrames(capturedFrame);
      }
    } else {
      // Capture the color frame
      this.captureColorFrames(capturedFrame);
    }
    this.chRef.detectChanges();
  }

  captureColorFrames(capturedFrame: string) {
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    const canvas: HTMLCanvasElement = this.canvasElement.nativeElement;
    // Process captured color frame here
    const ctx: CanvasRenderingContext2D | any = canvas.getContext('2d');
    const imgElement = new Image();
    imgElement.src = capturedFrame;
    let boxtype = this.typeRectBoxValue;
    if (boxtype === "square") {
      ctx.drawImage(imgElement, 110, 160, 310, 320, 0, 0, 300, 300);
    } else {
      ctx.drawImage(imgElement, 176, 772, 320, 320, 0, 0, 300, 400);
    }
    // Call the mainMethod after processing the color frame
    this.mainMethod(capturedFrame, canvas);
    // Wait for a black frame again
    this.waitForBlackFrame = true;
    // Continue capturing frames recursively
    requestAnimationFrame(() => this.captureFrame(video, canvas));
  }

  isBlackImage(capturedFrame: string, canvas: any) {
    this.goForImageCapture = false;
    const imgElement = new Image();
    let boxtype = this.typeRectBoxValue;
    imgElement.src = capturedFrame;
    const ctx: CanvasRenderingContext2D | any = canvas.getContext('2d');

    if (boxtype === "square") {
      ctx.drawImage(imgElement, 110, 160, 310, 320, 0, 0, 300, 300);
    } else {
      ctx.drawImage(imgElement, 176, 172, 320, 320, 0, 0, 300, 300);
    }


    const imgData = ctx.getImageData(0, 0, 300, 300);
    const [r, g, b] = imgData.data;
    const thresholdValue = 10;
    const convertedColor = this.convertDarkToBlack(r, g, b, thresholdValue);
    console.log(convertedColor);
    this.saveRGBData(r, g, b);
    // if ((convertedColor[0] < 39 && convertedColor[1] < 49 && convertedColor[2] < 44)) {
    if ((convertedColor[0] === 0 && convertedColor[1] === 0 && convertedColor[2] === 0)) {
      this.isColorBlack = true; // black true
    } else {
      this.isColorBlack = false; // black false 
      this.goForImageCapture = true; // different image
    }
    this.isCheckBlack(this.isColorBlack);
    this.ClearImage();
  }

  // Function to convert a dark color to black based on a threshold
  convertDarkToBlack(r: any, g: any, b: any, threshold: any) {
    if (r <= threshold && g <= threshold && b <= threshold) {
      // Color is dark, convert it to black
      return [0, 0, 0];
    } else {
      // Color is not dark, return original color
      return [r, g, b];
    }
  }

  isCheckBlack(isColorBlack: boolean) {
    if (isColorBlack === true) {
      this.isColorBlack1 = true;
      this.Framecolr = "B";
    } else {
      this.isColorBlack1 = false;
      this.goForImageCapture = true;
      this.Framecolr = "C";
    }
  }

  async mainMethod(video: any, canvas: any) {
    let formData = new FormData();
    const imgElement = new Image();
    imgElement.src = video;

    var isColorBlack1 = this.isColorBlack1;
    if (isColorBlack1 === false) {
      this.captureImageNew1 = canvas.toDataURL('image/png', 1.0);
      this.imageName = "capture_" + this.imgDt.getDate() + "_" + this.imgDt.getMinutes() + "_" + this.imgDt.getSeconds() + ".png";
      var file = await this.urltoFile(this.captureImageNew1, this.imageName, 'image/png');
      console.log('file received ->', file.name);
      formData.append('upload', file);
      this.isBlack(this.isColorBlack, this.captureImageNew1);
      this._ocrSerivce.GetOCRImageTextData(formData)
      // .subscribe((data: any) => {
      //   if (data.DetectedText !== null) {
      //     this.ConvertDataForSave(data.DetectedText);
      //     this.recognizedText = data.DetectedText;
      //   }
      // });
      if (this.pageState === AppCode.saveString) {
        this.Title = 'Add OCR';
        // this.f.Unit.setValue("EA"); // by default EA
        this.Unit = "EA";
      }
    } else {
      this.isBlack(this.isColorBlack, this.captureImageNew);
    }
    this.chef.detectChanges();
  }

  isBlack(isColorBlack: boolean, captureImageNew1: any) {
    if (isColorBlack === true) {
      //this.isColorBlack = true;
      this.Framecolr1 = "B";
      this.captureImageNew1 = captureImageNew1;
    } else {
      this.isColorBlack = false;
      this.Framecolr1 = "C";
      this.captureImageNew1 = captureImageNew1;
    }
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

  ClearImage() {
    this.webcamImage = undefined;
    this.captureImage = "";
    this.captureImageNew = "";
    // this.captureImageNew1 = "";
    this.typeRectBoxValue = "";
    this.isLoading = false;
    this.isFlagTimer = false;
    this.isRectangleClicked = false;
    this.isSquareClicked = false;
    this.chef.detectChanges();
  }

  ClearForm() {
    // this.StockistForm.reset();
    this.f.Quantity.setValue("");
    // this.f.Unit.setValue("");
    this.Unit = "";
    // this.f.Code.setValue("");
    this.Code = "";
    this.f.ProductName.setValue("");
    // this.f.Returntype.setValue("");
    this.Returntype = "";
    this.f.ExpiryDates.setValue("");
    // this.f.Division.setValue("");
    this.Division = "";
    // this.captureImageNew1 = "";
    this.BatchNo = "";
    this.ManufacturingDate = "";
    this.modalService.dismissAll();
    this.isLoading = false;
    this.ClearImage();
    this.chef.detectChanges();
  }
  // Bind on
  onChangeBatchNo() {
    this.isLoading = true;
    this._ocrSerivce.GetProductDetailsByBatchNo_Service(this.BatchNo, this.BranchId, this.CompanyId, this.UserId)
      .subscribe((data: any) => {
        if (data !== null) {
          this.Code = (data.Code);
          // this.f.Division.setValue(data.Division);
          this.Division = data.Division;
          this.f.ProductName.setValue(data.ProductName);
          this.f.ExpiryDates.setValue(data.EXP_Date);
          this.isLoading = false;
          this.chef.detectChanges();
        }
      }, (error) => {
        console.error(error);
        this.isLoading = false;
        this.chef.detectChanges();
      });
  }

  // Search - Apply Filter
  applyFilter() {
    this.isLoading = true;
    this.searchModel = this.searchModel.toLowerCase(); // Datasource defaults to lowercase matches
    this.DataSource.filter = this.searchModel;
    this.isLoading = false;
    this.chef.detectChanges(); // IMMEDIATE ACTION FIRED
  }

  // To Rectangle & Square Box change behavior
  RectangleBox(typeRectBox: string) {
    // debugger
    let myWidth = window.innerWidth;
    let mediaQuery = window.matchMedia("screen and (min-width: " + myWidth + "px)");
    if (mediaQuery.matches) {
      let container: any = <HTMLElement>document.getElementById('myDiv');
      if (typeRectBox === "square") {
        container.style.position = "absolute";
        container.style.height = "47%";
        container.style.width = "24%";
        container.style.border = "1px white solid";
        container.style.bottom = "20px";
        container.style.margin = "5% 6% 6% 6%";
        this.isSquareClicked = true;
        this.isRectangleClicked = false; // Reset the other icon
      } else {
        container.style.position = "absolute";
        container.style.height = "37%";
        container.style.width = "24%";
        container.style.border = "1px white solid";
        container.style.bottom = "18px";
        container.style.margin = "0% 2% 7% 7%";
        this.isRectangleClicked = true;
        this.isSquareClicked = false; // Reset the other icon

        //small size
        // container.style.position = "absolute";
        // container.style.height = "24%";
        // container.style.width = "12%";
        // container.style.border = "1px white solid";
        // container.style.bottom = "18px";
        // container.style.margin = "0% 2% 8% 12%";
        // this.isRectangleClicked = true;
        // this.isSquareClicked = false; // Reset the other ico
      }
      this.typeRectBoxValue = typeRectBox;
      this.chef.detectChanges();
    }
  }

  // Define regular expressions for each information extraction
  ConvertDataForSave(DetectedText: any) {
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
    const expiryDateRegex35 = /[A-Z]{3}\.\d{2}/g;
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
        // this.f.Returntype.setValue('Expiry');
        this.Returntype = "Expiry";
      } else {
        // this.f.Returntype.setValue('Damage');
        this.Returntype = "Damage";
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
        FullYear = AttachingYear = '20' + ExpiryDateYear;
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
    return formatDate(CommonDateFormat, 'dd-MM-yyyy ', 'en-US'); //dd-MM-yyyy
  }
  // return date format
  DateFormatForYYYYMMDD(CommonDateFormat: any) {
    return formatDate(CommonDateFormat, 'yyyy-MM-dd ', 'en-US'); //yyyy-MM-dd
  }
  // Match key and Return value
  extractInformation(str: any, regex: any) {
    if (str !== null) {
      var match = str.match(regex);
    }
    return match ? match[1] : null;
  }

}
