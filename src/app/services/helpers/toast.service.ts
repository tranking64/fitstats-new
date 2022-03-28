import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl: ToastController) { }

  async presentToast(toastColor, msg) {
    const toast = await this.toastCtrl.create({
      color: toastColor,
      message: msg,
      duration: 2000
    });

    toast.present();
  }
}
