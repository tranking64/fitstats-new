import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-weight-detail',
  templateUrl: './weight-detail.page.html',
  styleUrls: ['./weight-detail.page.scss'],
})
export class WeightDetailPage implements AfterViewInit {
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;

  lineChart: any;

  xLabel = [];
  yData = [];

  constructor(

  ) {
    Chart.register(...registerables);
  }

  segmentChanged() {
    this.xLabel = [];
    this.yData = [];

    for (let i = 0; i < 14; i++) {
      this.add();
    }
  }

  ngAfterViewInit() {
    this.lineChartMethod();

    for (let i = 0; i < 14; i++) {
      this.add();
    }
  }

  add() {
    this.xLabel.push('12. Jan');
    this.yData.push(Math.floor(Math.random() * (100 - 70 + 1) + 70));

    this.lineChart.destroy();
    this.lineChartMethod();
  }

  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        // eslint-disable-next-line max-len
        labels: this.xLabel, //['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'],
        datasets: [
          {
            label: 'Bodyweight in kg',
            fill: false,
            backgroundColor: 'rgba(55,117,42,1)', // 'rgba(2,204,254,0.4)',
            borderColor: 'rgba(55,117,42,1)', // 'rgba(2,204,254,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(55,117,42,1)', // 'rgba(2,204,254,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(55,117,42,1)', // 'rgba(2,204,254,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.yData, //[47.5, 35, 52.5, 50, 47.5, 45, 40, 40, 50, 50, 45, 40],
            spanGaps: false,
          }
        ]
      }
    });
  }
}
