/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { format, parseISO } from 'date-fns';
import { TrainingService } from 'src/app/services/api/crud/training.service';
import { Storage } from '@capacitor/storage';
import { ModalController } from '@ionic/angular';
import { EditExercisePage } from '../edit-exercise/edit-exercise.page';
import { ToastService } from 'src/app/services/helpers/toast.service';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.page.html',
  styleUrls: ['./exercise-detail.page.scss'],
})
export class ExerciseDetailPage implements AfterViewInit, OnInit {

  // chart-specific
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  lineChart: any;
  xLabel = [];
  yData = [];

  formattedDateExecuted = format(parseISO(new Date().toISOString()), 'dd MMMM yyyy');

  tmpTraining =  {
    exercise_type_id: null,
    reps: '',
    weight: '',
    executed_at: format(new Date(), 'yyyy-MM-dd')
  };

  selectedSegment = 'week';

  selectedExercise;
  trainingData;
  exerciseTypes = [];
  exerciseName;

  editExercise: any;

  dates = [];
  months = [];

  constructor(
    private router: Router,
    private trainingService: TrainingService,
    private modalCtrl: ModalController,
    private toastService: ToastService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    const routerState = this.router.getCurrentNavigation().extras.state;
    this.selectedExercise = routerState.selectedExercise;
    this.trainingData = routerState.trainingData;
    this.exerciseTypes = routerState.exerciseTypes;

    this.exerciseTypes.forEach(elem => {
      if(elem.exercise_type_id === Number(this.selectedExercise)) {
        this.exerciseName = elem.exercise_type;
      }
    });
  }

  async getTrainingData() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.trainingService.getTrainingEntries(this.selectedExercise, accessToken)
      .subscribe(res => this.trainingData.entries = res.data);

    this.trainingService.getTrainingWeek(this.selectedExercise, accessToken)
      .subscribe(res => {
        this.trainingData.weekData = res.data;

        /*this.yData = new Array(14).fill(null);;

        this.trainingData.weekData.forEach(elem => {
          this.dates.forEach((value, index) => {
            if(elem.day === value) {
              this.yData[index] = elem.max_weight;
            }
          });
        });

        this.lineChart.destroy();
        this.lineChartMethod();*/
      });

    this.trainingService.getTrainingYear(this.selectedExercise, accessToken)
      .subscribe(res => {
        this.trainingData.yearData = res.data;

        if (this.selectedSegment === 'week') {
          this.selectedSegment = 'year';
        }
        else {
          this.selectedSegment = 'week';
        }
        this.segmentChanged();
      });

  }

  async addTraining() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.tmpTraining.exercise_type_id = this.selectedExercise;

    this.trainingService.createTraining(this.tmpTraining, accessToken)
      .subscribe(
        res => {
          this.dismissModal();
          this.getTrainingData();
          this.toastService.presentToast('success', 'Successfully added training!');

          //this.formattedDateExecuted = '';
        }
      );
  }

  async deleteEntry(currExercise) {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    console.log(currExercise);
    this.trainingService.deleteTraining(currExercise.exercise_id, accessToken)
      .subscribe(
        () => {
          this.trainingData.entries = this.trainingData.entries.filter(e => e !== currExercise);
          this.getTrainingData();
        }
      );
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  dateChangedExecute(value) {
    this.tmpTraining.executed_at = value;
    this.formattedDateExecuted = format(parseISO(value), 'dd MMMM yyyy');
  }

  async presentEditModal(currExercise) {
    const modal = await this.modalCtrl.create({
      component: EditExercisePage,
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      componentProps: {
        exerciseData: currExercise
      }
    });
    //this.editExercise = currExercise;
    await modal.present();

    modal.onDidDismiss().then(() => this.getTrainingData());
  }

  ngAfterViewInit() {
    this.lineChartMethod();

    let currDate;

      for (let i = 13; i >= 0; i--) {
        currDate = new Date();
        currDate.setDate(currDate.getDate()-i);
        this.xLabel.push(format(currDate, 'dd MMM'));
        this.dates.push(currDate.getDate());
      }

      this.yData = new Array(14).fill(null);;

      this.trainingData.weekData.forEach(elem => {
        this.dates.forEach((value, index) => {
          if(elem.day === value) {
            this.yData[index] = elem.max_weight;
          }
        });
      });

      this.lineChart.destroy();
      this.lineChartMethod();
  }

  formatDate(date) {
    return format(new Date(date), 'dd MMM');
  }

  segmentChanged() {
    if(this.selectedSegment === 'week') {
      this.xLabel = [];
      this.months = [];
      let currDate;

      for (let i = 11; i >= 0; i--) {
        currDate = new Date();
        currDate.setMonth(currDate.getMonth()-i);
        this.xLabel.push(format(currDate, 'MMM'));
        this.months.push(currDate.getMonth());
      }

      this.yData = new Array(11).fill(null);;

      this.trainingData.yearData.forEach(elem => {
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

      this.trainingData.weekData.forEach(elem => {
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
            tension: 0.4,
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
            spanGaps: true,
          }
        ]
      }
    });
  }

}
