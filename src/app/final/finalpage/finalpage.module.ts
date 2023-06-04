import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FinalpagePageRoutingModule } from './finalpage-routing.module';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FinalpagePage } from './finalpage.page';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FinalpagePageRoutingModule,
  ],
  providers: [
    AndroidPermissions,
    FileOpener,
  ],
  declarations: [FinalpagePage]
})
export class FinalpagePageModule {}
