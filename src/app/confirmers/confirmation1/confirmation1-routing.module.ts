import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Confirmation1Page } from './confirmation1.page';

const routes: Routes = [
  {
    path: '',
    component: Confirmation1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Confirmation1PageRoutingModule {}
