import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CrudService } from '../services/api/crud.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;

  lineChart: any;

  xLabel = [];
  yData = [];

  friends = [
    { username: 'AmOasch6', score: 1450 },
    { username: 'very_bad', score: 1300 },
    { username: 'hoggst rider', score: 860 },
    { username: 'aleggs', score: 500 }
  ];

  exerciseTypes = [];

  constructor(private crudService: CrudService) {
    Chart.register(...registerables);
  }

  async fetchExerciseTypes() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.crudService.getExerciseTypes(accessToken)
      .subscribe(res => this.exerciseTypes = res.data);
  }

  ngAfterViewInit() {
    this.fetchExerciseTypes();

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
            label: 'Used weight in kg',
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

  sortAfterName(arr) {
    return arr.sort((a, b) => (a.country_type > b.country_type) ? 1 : -1);
  }
}
