import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Powerpoint1PageRoutingModule } from './powerpoint1-routing.module';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Powerpoint1Page } from './powerpoint1.page';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Powerpoint1PageRoutingModule
  ],
  providers: [
    AndroidPermissions,
    FileOpener,
  ],
  declarations: [Powerpoint1Page]
})
export class Powerpoint1PageModule {}
