import {
  Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy,
  Output, Input, EventEmitter
} from '@angular/core';
import { Chart, registerables } from 'node_modules/chart.js'
import { DashboardService } from '../dashboard.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashborad-chart',
  templateUrl: './dashborad-chart.component.html',
  styleUrls: ['./dashborad-chart.component.scss']
})
export class DashboradChartComponent implements OnInit {

  constructor(private Dservice: DashboardService, private chng: ChangeDetectorRef) { }

  chartdata: any;
  labeldata: any[] = [];
  realdata: any[] = [];
  colordata: any[] = [];
  isLoading: boolean = false;
  ChartTitle: any
  sendIdWiseData:any[]=[];

  @Input() DashBoardOrderDispatchPermission: any[];

  @Output() parentFun: EventEmitter<any> = new EventEmitter();
  DashBoardOrderDispatch:any;
  DashBoradChequeAcc:any;

  ngOnInit(): void {
    this.getChartData();
    this.getChartDataforPie();
    // this.RenderBubblechart();
    // this.RenderScatterchart();
    console.log('permission data - ', this.DashBoardOrderDispatchPermission);
    this.DashBoardOrderDispatch = this.DashBoardOrderDispatchPermission[0].DashBoardOrderDispatch;
    this.DashBoradChequeAcc = this.DashBoardOrderDispatchPermission[0].DashBoradChequeAcc;
  }

  SendDatatoParent() {
    const bar = document.getElementById("barchart");
    const pie = document.getElementById("piechart");
    // const bar1 = document.getElementById("barchart1");
    this.parentFun.emit(bar);
    this.parentFun.emit(pie);
    // this.parentFun.emit(bar1);
    // const model ={
    //     'bar':bar,
    //     'pie':pie,
    //     'bar1':bar1
    // }
    // console.log(this.sendIdWiseData.push(model));
    // localStorage.setItem("ModelArray", JSON.stringify(model));
  }

  getChartData() {
    this.isLoading = true;
    this.Dservice.GetOrderDispatchChartData().subscribe((result: any) => {
      this.chartdata = result;
      if (this.chartdata !== null || this.chartdata !== undefined) {
        for (let i = 0; i < this.chartdata.length; i++) {
          this.labeldata.push(this.chartdata[i].year);
          this.realdata.push(this.chartdata[i].amount);
          this.colordata.push(this.chartdata[i].colorcode);
        }
        this.RenderChart(this.labeldata, this.realdata, this.colordata, 'bar', 'barchart');
      }
      this.isLoading = false;
      this.chng.detectChanges();
    });
  }

  RenderChart(labeldata: any, maindata: any, colordata: any, type: any, id: any) {
    if (id !== null && id !== undefined) {
      const myChart = new Chart(id, {
        type: type,
        data: {
          labels: labeldata,
          datasets: [{
            data: maindata,
            backgroundColor: colordata,
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRation: false,
          scales: {
            y: {
              beginAtZero: true
            },
          },
          plugins: {
            legend: {
              display: false // This hides all text in the legend and also the labels.
            }
          }
        }
      });
    }
  }


  SendDatatoParentPie() {
    const pie = document.getElementById("piechart");
    this.parentFun.emit(pie);
  }

  getChartDataforPie() {
    this.isLoading = true;
    this.Dservice.GetOrderDispatchChartData().subscribe((result: any) => {
      this.chartdata = result;
      if (this.chartdata !== null || this.chartdata !== undefined) {
        for (let i = 0; i < this.chartdata.length; i++) {
          this.labeldata.push(this.chartdata[i].year);
          this.realdata.push(this.chartdata[i].amount);
          this.colordata.push(this.chartdata[i].colorcode);
        }
        this.RenderChartforPie(this.labeldata, this.realdata, this.colordata, 'pie', 'piechart');
      }
      this.isLoading = false;
      this.chng.detectChanges();
    });
  }

  RenderChartforPie(labeldata: any, maindata: any, colordata: any, type: any, id: any) {
    if (id !== null && id !== undefined) {
      const myChart = new Chart(id, {
        type: type,
        data: {
          labels: labeldata,
          datasets: [{
            data: maindata,
            backgroundColor: colordata,
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRation: false,
          scales: {
            y: {
              beginAtZero: true
            },
          },
          plugins: {
            legend: {
              display: false // This hides all text in the legend and also the labels.
            }
          }
        }
      });
    }
  }


  // RenderBubblechart(){
  //   const data = {
  //     datasets: [{
  //       label: 'First Dataset',
  //       data: [{
  //         x: 20,
  //         y: 30,
  //         r: 15
  //       }, {
  //         x: 40,
  //         y: 10,
  //         r: 10
  //       }],
  //       backgroundColor: 'rgb(255, 99, 132)'
  //     }]
  //   };
  //   const myChart = new Chart('bubchart', {
  //     type: 'bubble',
  //     data: data,
  //     options: {

  //     }
  //   });
  // }

  // RenderScatterchart(){
  //   const data = {
  //     datasets: [{
  //       label: 'Scatter Dataset',
  //       data: [{
  //         x: -10,
  //         y: 0
  //       }, {
  //         x: 0,
  //         y: 10
  //       }, {
  //         x: 10,
  //         y: 5
  //       }, {
  //         x: 0.5,
  //         y: 5.5
  //       }],
  //       backgroundColor: 'rgb(255, 99, 132)'
  //     }],
  //   };
  //   const myChart = new Chart('scchart', {
  //     type: 'scatter',
  //     data: data,
  //     options: {
  //       scales: {
  //         x: {
  //           type: 'linear',
  //           position: 'bottom'
  //         }
  //       }
  //     }
  //   });
  // }

}
