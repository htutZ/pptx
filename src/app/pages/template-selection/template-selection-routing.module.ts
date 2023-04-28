import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TemplateSelectionPage } from './template-selection.page';

const routes: Routes = [
  {
    path: '',
    component: TemplateSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplateSelectionPageRoutingModule {}
