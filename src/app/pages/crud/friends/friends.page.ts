import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FriendService } from 'src/app/services/api/crud/friend.service';
import { ToastService } from 'src/app/services/helpers/toast.service';
import { Storage } from '@capacitor/storage';
import { LoaderService } from 'src/app/services/helpers/loader.service';
import { AlertService } from 'src/app/services/helpers/alert.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  friendUsername = '';

  constructor(
    private modalCtrl: ModalController,
    private toastService: ToastService,
    private loaderSerivce: LoaderService,
    private friendService: FriendService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  async addFriend() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.loaderSerivce.presentLoading();

    this.friendService.addFriend(this.friendUsername, accessToken)
      .subscribe(
        res => {
          this.loaderSerivce.dismissLoading();
          this.toastService.presentToast('success', 'A friend request was succesfully sent!');
          this.friendUsername = '';
          this.dismissModal();
        },
        err => {
          this.loaderSerivce.dismissLoading();
          this.alertService.presentSimpleAlert('Error', err.error.message);
        }
      );
  }
}
