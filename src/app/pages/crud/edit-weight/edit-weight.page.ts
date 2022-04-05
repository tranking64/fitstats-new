import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Storage } from '@capacitor/storage';
import { WeightService } from 'src/app/services/api/crud/weight.service';

@Component({
  selector: 'app-edit-weight',
  templateUrl: './edit-weight.page.html',
  styleUrls: ['./edit-weight.page.scss'],
})
export class EditWeightPage implements OnInit {

  @Input() weightData;

  formattedDateWeighted;

  constructor(
    private modalCtrl: ModalController,
    private weightService: WeightService
  ) { }

  ngOnInit() {
    this.formattedDateWeighted = format(parseISO(this.weightData.weighted_date), 'dd MMMM yyyy');
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  dateChangedWeighted(value) {
    this.weightData.weighted_date = value;
    this.formattedDateWeighted = format(parseISO(value), 'dd MMMM yyyy');
  }

  async update() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.weightService.updateWeight(this.weightData, accessToken).subscribe(
      () => {
        this.dismissModal();
      }
    );
  }

}
