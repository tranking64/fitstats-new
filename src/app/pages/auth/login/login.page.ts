import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/api/auth.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  countries = [];
  genders = [];

  username = '';

  userCredentials = {
    email: '',
    password: ''
  };

  tmpUser = {
    username: '',
    email: '',
    password: '',
    cPassword: '',
    gender: '',
    country: '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    date_of_birth: ''
  };

  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.authService.getCountries()
      .subscribe(data => this.countries = data.data);

    this.authService.getGenders()
      .subscribe(data => this.genders = data.data);
  }

  createAcc() {
    this.authService.signup(this.tmpUser).subscribe(
      res => console.log(res), // close modal needed
      err => console.log(err)
    );
  }

  signin() {
    this.authService.login(this.userCredentials).subscribe(
      async res => {
        await Storage.set({key: 'access_token', value: 'Bearer ' + res.data.tokens.access_token});
        await Storage.set({key: 'refresh_token', value: res.data.tokens.refresh_token});

        this.navCtrl.navigateForward('/home');

        this.userCredentials.email = '';
        this.userCredentials.password = '';
      },
      err => console.log(err)
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
