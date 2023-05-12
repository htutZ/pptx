import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Confirmation1PageRoutingModule } from './confirmation1-routing.module';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Confirmation1Page } from './confirmation1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Confirmation1PageRoutingModule
  ],
  providers: [
    FileOpener,
  ],
  declarations: [Confirmation1Page]
})
export class Confirmation1PageModule {}
