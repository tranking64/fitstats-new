import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/api/auth.service';
import { Storage } from '@capacitor/storage';
import { LoaderService } from 'src/app/services/helpers/loader.service';
import { AlertService } from 'src/app/services/helpers/alert.service';
import { format, parseISO } from 'date-fns';
import { ToastService } from 'src/app/services/helpers/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  nextStep = false;

  formattedDate = '';

  countries = [];
  genders = [];

  username = '';

  userCredentials = {
    email: '',
    password: ''
  };

  resetCredentials = {
    email: '',
    code: '',
    password: '',
    cPassword: ''
  };

  tmpUser = {
    username: '',
    email: '',
    password: '',
    cPassword: '',
    gender: '',
    country: '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    date_of_birth: format(new Date(), 'yyyy-MM-dd')
  };

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private modalCtrl: ModalController,
    private toastService: ToastService
  ) {


  }

  ngOnInit() {
    this.initColorTheme();

    this.authService.getCountries()
      .subscribe(data => this.countries = data.data);

    this.authService.getGenders()
      .subscribe(data => this.genders = data.data);

      this.rememberMe();
  }

  async initColorTheme() {
    const colorTheme = await (await Storage.get({ key: 'color_theme' })).value;

    if (colorTheme === null) {
      await Storage.set({key: 'color_theme', value: 'light'});
    }
    else {
      if (colorTheme === 'light') {
        document.body.setAttribute('color-theme', 'light');
      }
      else {
        document.body.setAttribute('color-theme', 'dark');
      }
    }
  }

  async rememberMe() {
    const refreshToken = await (await Storage.get({ key: 'refresh_token' })).value;

    if (refreshToken != null) {
      this.loaderService.presentLoading();

      this.authService.refreshLogin(refreshToken).subscribe(
        async res => {
          await Storage.set({key: 'access_token', value: 'Bearer ' + res.data.tokens.access_token});
          await Storage.set({key: 'refresh_token', value: res.data.tokens.refresh_token});

          this.loaderService.dismissLoading();

          this.navCtrl.navigateForward('/home');
        },
        async err => {
          await Storage.remove({ key: 'access_token' });
          await Storage.remove({ key: 'refresh_token' });

          this.loaderService.dismissLoading();

          this.alertService.presentSimpleAlert('Token expired', 'Please enter your credentials again!');
        }
      );
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss();
    this.nextStep = false;
  }

  dateChanged(value) {
    this.tmpUser.date_of_birth = value;
    this.formattedDate = format(parseISO(value), 'dd MMMM yyyy');
  }

  createAcc() {
    this.loaderService.presentLoading();

    this.authService.signup(this.tmpUser).subscribe(
      res => {
        this.loaderService.dismissLoading();
        this.dismissModal();
      },
      err => {
        this.loaderService.dismissLoading();
        this.alertService.presentSimpleAlert('Error', err.error.message);
      }
    );
  }

  signin() {
    this.loaderService.presentLoading();

    this.authService.login(this.userCredentials).subscribe(
      async res => {
        this.loaderService.dismissLoading();

        await Storage.set({key: 'access_token', value: 'Bearer ' + res.data.tokens.access_token});
        await Storage.set({key: 'refresh_token', value: res.data.tokens.refresh_token});

        this.navCtrl.navigateForward('/home');

        this.userCredentials.email = '';
        this.userCredentials.password = '';
      },
      err => {
        this.loaderService.dismissLoading();
        this.alertService.presentSimpleAlert('Error', err.error.message);
      }
    );
  }

  sendLink() {
    this.authService.forgotPassword(this.resetCredentials.email)
      .subscribe(
        () => this.nextStep = true
      );
  }

  resetPassword() {
    this.authService.resetPassword(this.resetCredentials.code, this.resetCredentials.password)
      .subscribe(
        () => {
          this.dismissModal();
          this.toastService.presentToast('success', 'Your password has been successfully changed!');
        }
      );
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

}
