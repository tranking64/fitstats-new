import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertCtrl: AlertController) { }

  async presentSimpleAlert(headerMsg, msg) {
    const alert = await this.alertCtrl.create({
      header: headerMsg,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }
}
