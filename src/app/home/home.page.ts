/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TrainingService } from '../services/api/crud/training.service';
import { Storage } from '@capacitor/storage';
import { ModalController, NavController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { AuthService } from '../services/api/auth.service';
import { ToastService } from '../services/helpers/toast.service';
import { LoaderService } from '../services/helpers/loader.service';
import { AlertService } from '../services/helpers/alert.service';
import { LeaderboardService } from '../services/api/leaderboard.service';
import { Router } from '@angular/router';
import { FriendService } from '../services/api/crud/friend.service';
import { WeightService } from '../services/api/crud/weight.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  // chart-specific
  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  lineChart: any;
  xLabel = [];
  yData = new Array(14).fill(null);

  // for progress bar
  pageIsLoading = false;

  // data
  //presentWeekData = new Array(14).fill(null);

  genders = [];
  countries = [];

  leaderboardAll = [];
  leaderboardFriends = [];

  friendList = [];
  friendRequests = [];

  selectedExerciseId = 0;

  userData = {
    user_id: null,
    username: '',
    email: '',
    gender: '',
    country: '',
    gain_weight: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    date_of_birth: format(new Date(), 'yyyy-MM-dd')
  };

  dates = [];

  pwData = {
    old_password: '',
    new_password: '',
    c_new_password: ''
  };

  tmpTraining =  {
    exercise_type_id: null,
    reps: '',
    weight: '',
    executed_at: format(new Date(), 'yyyy-MM-dd')
  };

  tmpWeight =  {
    weight: '',
    weighted_at: format(new Date(), 'yyyy-MM-dd')
  };

  trainingData = {
    weekData: [],
    yearData: [],
    entries: []
  };

  weightData = {
    weekData: [],
    yearData: [],
    entries: [],
    weightDiff: null
  };

  deletePassword = '';

  exerciseTypes = [];

  formattedDate = '';
  formattedDateExecuted = format(parseISO(new Date().toISOString()), 'dd MMMM yyyy');
  formattedDateWeighted = format(parseISO(new Date().toISOString()), 'dd MMMM yyyy');

  constructor(
    private trainingService: TrainingService,
    private navCtrl: NavController,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private leaderboardService: LeaderboardService,
    private router: Router,
    private friendService: FriendService,
    private weightService: WeightService
  ) {
    this.fetchUserdata();
    this.fetchExerciseTypes();

    this.authService.getCountries()
      .subscribe(data => this.countries = data.data);

    this.authService.getGenders()
      .subscribe(data => this.genders = data.data);

    this.getWeightData();

    Chart.register(...registerables);
  }

  dateChanged(value) {
    this.userData.date_of_birth = value;
    this.formattedDate = format(parseISO(value), 'dd MMMM yyyy');
  }

  dateChangedWeighted(value) {
    this.tmpWeight.weighted_at = value;
    this.formattedDateWeighted = format(parseISO(value), 'dd MMMM yyyy');
  }

  async addTraining() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.trainingService.createTraining(this.tmpTraining, accessToken)
      .subscribe(
        res => {
          console.log(res.data);
          this.dismissModal();
          this.toastService.presentToast('success', 'Successfully added training!');

          //this.formattedDateExecuted = '';
        }
      );
  }

  async addWeight() {

    console.log(this.tmpWeight);
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.weightService.createWeight(this.tmpWeight, accessToken)
      .subscribe(
        res => {
          this.dismissModal();
          this.toastService.presentToast('success', 'Successfully added weight entry!');

          //this.formattedDateExecuted = '';
        }
      );
  }

  dateChangedExecute(value) {
    this.tmpTraining.executed_at = value;
    this.formattedDateExecuted = format(parseISO(value), 'dd MMMM yyyy');
  }

  async fetchUserdata() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.authService.getUserdata(accessToken).subscribe(
      res => {
        this.userData.user_id = res.user_id;
        this.userData.username = res.username;
        this.userData.email = res.email;
        this.userData.gender = res.gender.gender_type;
        this.userData.country = res.country.country_type;
        this.userData.date_of_birth = res.date_of_birth;

        this.formattedDate = format(parseISO(res.date_of_birth), 'dd MMMM yyyy');
      }
    );
  }

  async logout() {
    this.dismissModal();

    await Storage.remove({ key: 'access_token' });
    await Storage.remove({ key: 'refresh_token' });

    this.navCtrl.navigateForward('/login');
  }

  async toggleTheme() {
    const colorTheme = await (await Storage.get({ key: 'color_theme' })).value;

    if (colorTheme === 'light') {
      document.body.setAttribute('color-theme', 'dark');
      await Storage.set({key: 'color_theme', value: 'dark'});
    }
    else {
      document.body.setAttribute('color-theme', 'light');
      await Storage.set({key: 'color_theme', value: 'light'});
    }
  }

  async updateUser() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.loaderService.presentLoading();

    this.authService.updateUser(this.userData, accessToken)
      .subscribe(
        res => {
          this.loaderService.dismissLoading();
          this.dismissModal();
          this.toastService.presentToast('success', 'Credentials were successfully updated!');
        },
        err => {
          this.loaderService.dismissLoading();
          this.alertService.presentSimpleAlert('Error', err.error.message);
        }
      );
  }

  async changePassword() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.loaderService.presentLoading();

    this.authService.changePassword(this.pwData, accessToken)
      .subscribe(
        res => {
          this.loaderService.dismissLoading();
          this.dismissModal();
          this.toastService.presentToast('success', 'Successfully changed password!');

          this.pwData.old_password = '';
          this.pwData.new_password = '';
          this.pwData.c_new_password = '';
        },
        err => {
          this.loaderService.dismissLoading();
          this.alertService.presentSimpleAlert('Error', err.error.message);
        }
      );
  }

  async deleteAccount() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.loaderService.presentLoading();

    this.authService.deleteAccount(this.deletePassword, accessToken)
      .subscribe(
        async res => {
          this.loaderService.dismissLoading();
          this.deletePassword = '';

          this.dismissModal();
          setTimeout(() => { this.logout(); }, 250);
          setTimeout(() => { this.toastService.presentToast('success', 'Your account was successfully deleted!'); }, 250);
        },
        err => {
          this.loaderService.dismissLoading();
          this.alertService.presentSimpleAlert('Error', err.error.message);
        }
      );
  }

  async fetchExerciseTypes() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.trainingService.getExerciseTypes(accessToken)
      .subscribe(res => this.exerciseTypes = res.data);
  }

  ionViewWillEnter() {
    this.pageIsLoading = true;

    this.fetchUserdata();

    this.fetchLeaderboardAll();
    this.fetchLeaderboardFriends();

    this.fetchFriendlist();
    this.fetchFriendRequests();

    if(this.selectedExerciseId !== 0) {
      this.getTrainingData();
    }

    this.getWeightData();
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
  }

  dismissModal() {
    this.modalCtrl.dismiss();
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

  async fetchFriendRequests() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.friendService.getFriendRequests(accessToken)
      .subscribe(
        res => {
          this.friendRequests = res.data;
          this.pageIsLoading = false;
        }
      );
  }

  async fetchFriendlist() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.friendService.getFriendlist(accessToken)
      .subscribe(
        res => this.friendList = res.data
      );
  }

  async getTrainingData() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.trainingService.getTrainingEntries(this.selectedExerciseId, accessToken)
      .subscribe(res => this.trainingData.entries = res.data);

    this.trainingService.getTrainingWeek(this.selectedExerciseId, accessToken)
      .subscribe(res => {
        this.trainingData.weekData = res.data;

        this.yData = new Array(14).fill(null);;

        this.trainingData.weekData.forEach(elem => {
          this.dates.forEach((value, index) => {
            if(elem.day === value) {
              this.yData[index] = elem.max_weight;
            }
          });
        });

        //this.yData = this.presentWeekData;
        this.lineChart.destroy();
        this.lineChartMethod();
      });

    this.trainingService.getTrainingYear(this.selectedExerciseId, accessToken)
      .subscribe(res => this.trainingData.yearData = res.data);

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
      .subscribe(res => this.weightData.yearData = res.data);

  }

  checkNegative(weight) {
    if (String(weight).substring(0, 1) === '-') {
      return true;
    }
    else {
      return false;
    }
  }

  getPositive(weight) {
    return String(weight).substring(1);
  }

  async fetchLeaderboardAll() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.leaderboardService.getLeaderboardAll(accessToken)
      .subscribe(
        res => {
          this.leaderboardAll = res.data;
        }
      );
  }

  async fetchLeaderboardFriends() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.leaderboardService.getLeaderboardFriends(accessToken)
      .subscribe(
        res => {
          this.leaderboardFriends = res.data;
        }
      );
  }

  routeToExerciseDetail() {
    if(this.selectedExerciseId !== 0) {
      this.router.navigate(['exercise-detail'], {
        state: {
          selectedExercise: this.selectedExerciseId,
          trainingData: this.trainingData,
          exerciseTypes: this.exerciseTypes
        }
      });
    }
  }

  routeToWeightDetail() {
    this.router.navigate(['weight-detail'], {
      state: {
        weightData: this.weightData
      }
    });
  }

  routeToFriends() {
    this.router.navigate(['friends'], {
      state: {
        list: this.friendList,
        requests: this.friendRequests
      }
    });
  }

  routeToLeaderboard() {
    this.router.navigate(['leaderboard'], {
      state: {
        all: this.leaderboardAll,
        friends: this.leaderboardFriends,
        myUserId: this.userData.user_id
      }
    });
  }

  sortAfterNameCountries(arr) {
    return arr.sort((a, b) => (a.country_type > b.country_type) ? 1 : -1);
  }

  sortAfterNameExercises(arr) {
    return arr.sort((a, b) => (a.exercise_type > b.exercise_type) ? 1 : -1);
  }

  toTitleCase = (phrase) =>
    phrase
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  getGreeting() {
    const currentDate = new Date();
    let greeting = '';

    if (currentDate.getHours() < 5) {
      greeting = 'Good evening';
    }
    else if(currentDate.getHours() < 12) {
      greeting = 'Good morning';
    }
    else if (currentDate.getHours() < 18) {
      greeting = 'Good afternoon';
    }
    else {
      greeting = 'Good evening';
    }

    return greeting;
  }
}
