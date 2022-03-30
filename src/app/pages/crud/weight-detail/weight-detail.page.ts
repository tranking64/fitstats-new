import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { format } from 'date-fns';

@Component({
  selector: 'app-weight-detail',
  templateUrl: './weight-detail.page.html',
  styleUrls: ['./weight-detail.page.scss'],
})
export class WeightDetailPage implements AfterViewInit {
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;

  selectedSegment = 'week';

  lineChart: any;

  xLabel = [];
  yData = [];

  constructor(

  ) {
    // eslint-disable-next-line max-len
    this.xLabel = ['12. Mar', '13. Mar', '14. Mar', '15. Mar', '16. Mar', '17. Mar', '18. Mar', '19. Mar', '20. Mar', '21. Mar', '22. Mar', '23. Mar', '24. Mar', '25. Mar'];
    Chart.register(...registerables);
  }

  segmentChanged() {
    if(this.selectedSegment === 'week') {
      this.xLabel=[];
      let currDate;

      for (let i = 11; i > 0; i--) {
        currDate = new Date();
        currDate.setMonth(currDate.getMonth()-i);
        this.xLabel.push(format(currDate, 'MMM'));
      }
      //this.xLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
      this.yData = [];

      for (let i = 0; i < 11; i++) {
        this.yData.push(Math.floor(Math.random() * (70 - 60 + 1) + 60));

      this.lineChart.destroy();
      this.lineChartMethod();
      }

      this.selectedSegment = 'year';
    }
    else {
      // eslint-disable-next-line max-len
      this.xLabel = ['12. Mar', '13. Mar', '14. Mar', '15. Mar', '16. Mar', '17. Mar', '18. Mar', '19. Mar', '20. Mar', '21. Mar', '22. Mar', '23. Mar', '24. Mar', '25. Mar'];
      this.yData = [];

      for (let i = 0; i < 14; i++) {
        this.add();
      }

      this.selectedSegment = 'week';
    }
  }

  ngAfterViewInit() {
    this.lineChartMethod();

    for (let i = 0; i < 14; i++) {
      this.add();
    }
  }

  add() {
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
            tension: 0.4,
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
            spanGaps: true,
          }
        ]
      }
    });
  }
}
