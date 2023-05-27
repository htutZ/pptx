import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LottieAnimationViewModule } from 'ng-lottie';
import { IonicModule } from '@ionic/angular';

import { FinalpagePageRoutingModule } from './finalpage-routing.module';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FinalpagePage } from './finalpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FinalpagePageRoutingModule,
    LottieAnimationViewModule.forRoot()
  ],
  providers: [
    FileOpener,
  ],
  declarations: [FinalpagePage]
})
export class FinalpagePageModule {}
