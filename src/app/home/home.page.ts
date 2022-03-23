/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CrudService } from '../services/api/crud.service';
import { Storage } from '@capacitor/storage';
import { ModalController, NavController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { AuthService } from '../services/api/auth.service';

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

  genders = [];
  countries = [];

  friends = [
    { username: 'AmOasch6', units: 16 },
    { username: 'very_bad', units: 12 },
    { username: 'hoggst rider', units: 7 },
    { username: 'aleggs', units: 5 }
  ];

  userData = {
    username: '',
    email: '',
    gender: '',
    country: '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    date_of_birth: format(new Date(), 'yyyy-mm-dd')
  };

  pwData = {
    old_password: '',
    new_password: '',
    c_new_password: ''
  };

  exerciseTypes = [];
  formattedDate = '';

  constructor(
    private crudService: CrudService,
    private navCtrl: NavController,
    private authService: AuthService,
    private modalCtrl: ModalController
  ) {
    this.fetchExerciseTypes();

    this.authService.getCountries()
      .subscribe(data => this.countries = data.data);

    this.authService.getGenders()
      .subscribe(data => this.genders = data.data);

    Chart.register(...registerables);
  }

  dateChanged(value) {
    this.userData.date_of_birth = value;
    this.formattedDate = format(parseISO(value), 'dd MMMM yyyy');
  }

  async fetchUserdata() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.authService.getUserdata(accessToken).subscribe(
      res => {
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

  async fetchExerciseTypes() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.crudService.getExerciseTypes(accessToken)
      .subscribe(res => this.exerciseTypes = res.data);
  }

  ionViewWillEnter() {
    this.fetchUserdata();

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
      greeting = 'Gute evening';
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
