import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Registration3PageRoutingModule } from './registration3-routing.module';

import { Registration3Page } from './registration3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Registration3PageRoutingModule
  ],
  declarations: [Registration3Page]
})
export class Registration3PageModule {}
