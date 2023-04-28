import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TemplateSelectionPageRoutingModule } from './template-selection-routing.module';

import { TemplateSelectionPage } from './template-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TemplateSelectionPageRoutingModule
  ],
  declarations: [TemplateSelectionPage]
})
export class TemplateSelectionPageModule {}
