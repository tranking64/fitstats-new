import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FriendService } from 'src/app/services/api/crud/friend.service';
import { ToastService } from 'src/app/services/helpers/toast.service';
import { Storage } from '@capacitor/storage';
import { LoaderService } from 'src/app/services/helpers/loader.service';
import { AlertService } from 'src/app/services/helpers/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  friendUsername = '';

  friendList = [];
  friendRequests = [];

  constructor(
    private modalCtrl: ModalController,
    private toastService: ToastService,
    private loaderSerivce: LoaderService,
    private friendService: FriendService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    const routerState = this.router.getCurrentNavigation().extras.state;
    this.friendList = routerState.list;
    this.friendRequests = routerState.requests;
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

  async accept(currReq) {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.friendService.acceptReq(currReq.user_id, accessToken).subscribe(
      () => {
        this.friendList.push(currReq);
        this.friendRequests = this.friendRequests.filter(req => req !== currReq);
      }
    );
  }

  async decline(currReq) {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.friendService.declineReq(currReq.user_id, accessToken)
      .subscribe(
        () => this.friendRequests = this.friendRequests.filter(req => req !== currReq)
      );
  }

  async remove(currFriend) {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.friendService.removeFriend(currFriend.user_id, accessToken).subscribe(
      () => this.friendList = this.friendList.filter(f => f !== currFriend)
    );
  }
}
