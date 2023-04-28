import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Import this

import { IonicModule } from '@ionic/angular';

import { Registration1PageRoutingModule } from './registration1-routing.module';
import { Registration1Page } from './registration1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // <-- Add this
    IonicModule,
    Registration1PageRoutingModule
  ],
  declarations: [Registration1Page]
})
export class Registration1PageModule {}
