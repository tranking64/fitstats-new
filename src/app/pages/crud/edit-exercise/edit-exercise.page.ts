import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { TrainingService } from 'src/app/services/api/crud/training.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-edit-exercise',
  templateUrl: './edit-exercise.page.html',
  styleUrls: ['./edit-exercise.page.scss'],
})
export class EditExercisePage implements OnInit {

  @Input() exerciseData;

  formattedDateExecuted;

  constructor(
    private modalCtrl: ModalController,
    private trainingService: TrainingService
  ) { }

  ngOnInit() {
    this.formattedDateExecuted = format(parseISO(this.exerciseData.executed_at), 'dd MMMM yyyy');
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  dateChangedExecute(value) {
    this.exerciseData.executed_at = value;
    this.formattedDateExecuted = format(parseISO(value), 'dd MMMM yyyy');
  }

  async updateTraining() {
    const accessToken = await (await Storage.get({ key: 'access_token' })).value;

    this.trainingService.updateTraining(this.exerciseData, accessToken)
      .subscribe(
        () => {
          this.dismissModal();
        }
      );
  }

}
