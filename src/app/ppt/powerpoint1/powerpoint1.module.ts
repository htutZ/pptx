import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Powerpoint1PageRoutingModule } from './powerpoint1-routing.module';

import { Powerpoint1Page } from './powerpoint1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Powerpoint1PageRoutingModule
  ],
  declarations: [Powerpoint1Page]
})
export class Powerpoint1PageModule {}
