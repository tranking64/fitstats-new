import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { format, parseISO } from 'date-fns';
import { WeightService } from 'src/app/services/api/crud/weight.service';
import { Storage } from '@capacitor/storage';
import { ModalController } from '@ionic/angular';
import { EditWeightPage } from '../edit-weight/edit-weight.page';
import { ToastService } from 'src/app/services/helpers/toast.service';

@Component({
  selector: 'app-weight-detail',
  templateUrl: './weight-detail.page.html',
  styleUrls: ['./weight-detail.page.scss'],
})
export class WeightDetailPage implements AfterViewInit, OnInit {
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;

  selectedSegment = 'week';

  lineChart: any;

  xLabel = [];
  yData = [];

  dates = [];
  months = [];

  formattedDateWeighted = format(parseISO(new Date().toISOString()), 'dd MMMM yyyy');

  tmpWeight =  {
    weight: '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    weighted_at: format(new Date(), 'yyyy-MM-dd')
  };

  weightData;

  constructor(
    private router: Router,
    private weightService: WeightService,
    private modalCtrl: ModalController,
    private toastService: ToastService
  ) {
    // eslint-disable-next-line max-len
    //this.xLabel = ['12. Mar', '13. Mar', '14. Mar', '15. Mar', '16. Mar', '17. Mar', '18. Mar', '19. Mar', '20. Mar', '21. Mar', '22. Mar', '23. Mar', '24. Mar', '25. Mar'];
    Chart.register(...registerables);
  }
  ngOnInit() {
    const routerState = this.router.getCurrentNavigation().extras.state;
    this.weightData = routerState.weightData;
    console.log(this.weightData.entries);
  }

  dateChangedWeighted(value) {
    this.tmpWeight.weighted_at = value;
    this.formattedDateWeighted = format(parseISO(value), 'dd MMMM yyyy');
  }

  formatDate(date) {
    return format(new Date(date), 'dd MMM');
  }

  async getWeightData() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.weightService.getWeightEntries(accessToken)
      .subscribe(res => this.weightData.entries = res.data);

    this.weightService.getWeightWeek(accessToken)
      .subscribe(res => {
        this.weightData.weekData = res.data;
        if(this.weightData.weekData.length > 1) {
          // eslint-disable-next-line max-len
          this.weightData.weightDiff =  Number(this.weightData.weekData[this.weightData.weekData.length-1].max_weight - this.weightData.weekData[this.weightData.weekData.length-2].max_weight).toFixed(1);
          console.log(this.weightData.weightDiff);
        }

      });

    this.weightService.getWeightYear(accessToken)
      .subscribe(res => {
        this.weightData.yearData = res.data;

        if (this.selectedSegment === 'week') {
          this.selectedSegment = 'year';
        }
        else {
          this.selectedSegment = 'week';
        }
        this.segmentChanged();
      });

  }

  segmentChanged() {
    if(this.selectedSegment === 'week') {
      this.xLabel = [];
      let currDate;

      for (let i = 11; i >= 0; i--) {
        currDate = new Date();
        currDate.setMonth(currDate.getMonth()-i);
        this.xLabel.push(format(currDate, 'MMM'));
        this.months.push(currDate.getMonth());
      }

      this.yData = new Array(11).fill(null);;

      this.weightData.yearData.forEach(elem => {
        this.months.forEach((value, index) => {
          if(elem.month-1 === value) {
            this.yData[index] = elem.average_weight;
          }
        });
      });

      this.lineChart.destroy();
      this.lineChartMethod();

      this.selectedSegment = 'year';
    }
    else {
      this.xLabel = [];
      this.dates = [];

      let currDate;

      for (let i = 13; i >= 0; i--) {
        currDate = new Date();
        currDate.setDate(currDate.getDate()-i);
        this.xLabel.push(format(currDate, 'dd MMM'));
        this.dates.push(currDate.getDate());
      }

      this.yData = new Array(14).fill(null);;

      this.weightData.weekData.forEach(elem => {
        this.dates.forEach((value, index) => {
          if(elem.day === value) {
            this.yData[index] = elem.max_weight;
          }
        });
      });

      this.lineChart.destroy();
      this.lineChartMethod();

      this.selectedSegment = 'week';
    }
  }

  ngAfterViewInit() {
    this.lineChartMethod();

    this.xLabel = [];
    this.dates = [];

    let currDate;

    for (let i = 13; i >= 0; i--) {
      currDate = new Date();
      currDate.setDate(currDate.getDate()-i);
      this.xLabel.push(format(currDate, 'dd MMM'));
      this.dates.push(currDate.getDate());
    }

    this.yData = new Array(14).fill(null);;

    this.weightData.weekData.forEach(elem => {
      this.dates.forEach((value, index) => {
        if(elem.day === value) {
          this.yData[index] = elem.max_weight;
        }
      });
    });

    this.lineChart.destroy();
    this.lineChartMethod();
  }

  async deleteEntry(currEntry) {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.weightService.deleteWeight(currEntry.bodyweight_id, accessToken)
      .subscribe(
        () => {
          this.weightData.entries = this.weightData.entries.filter(e => e !== currEntry);
          this.getWeightData();
        }
      );
  }

  async presentEditModal(currEntry) {
    const modal = await this.modalCtrl.create({
      component: EditWeightPage,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      componentProps: {
        weightData: currEntry
      }
    });
    //this.editExercise = currExercise;
    await modal.present();

    modal.onDidDismiss().then(() => this.getWeightData());
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  async addWeight() {

    console.log(this.tmpWeight);
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.weightService.createWeight(this.tmpWeight, accessToken)
      .subscribe(
        res => {
          this.getWeightData();
          this.dismissModal();
          this.toastService.presentToast('success', 'Successfully added weight entry!');

          //this.formattedDateExecuted = '';
        }
      );
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
