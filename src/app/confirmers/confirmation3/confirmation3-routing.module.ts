import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Confirmation3Page } from './confirmation3.page';

const routes: Routes = [
  {
    path: '',
    component: Confirmation3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Confirmation3PageRoutingModule {}
