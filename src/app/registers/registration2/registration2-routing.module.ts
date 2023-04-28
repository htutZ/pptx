import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Registration2Page } from './registration2.page';

const routes: Routes = [
  {
    path: '',
    component: Registration2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Registration2PageRoutingModule {}
