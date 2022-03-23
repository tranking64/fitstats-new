import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loading;

  constructor(private loadingCtrl: LoadingController) {}

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      translucent: true
    });

    this.loading.present();
  }

  async dismissLoading() {
    await this.loading.dismiss();
  }
}
