import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditWeightPageRoutingModule } from './edit-weight-routing.module';

import { EditWeightPage } from './edit-weight.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditWeightPageRoutingModule
  ],
  declarations: [EditWeightPage]
})
export class EditWeightPageModule {}
