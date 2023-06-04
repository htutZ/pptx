import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Confirmation3PageRoutingModule } from './confirmation3-routing.module';

import { Confirmation3Page } from './confirmation3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Confirmation3PageRoutingModule
  ],
  declarations: [Confirmation3Page]
})
export class Confirmation3PageModule {}
