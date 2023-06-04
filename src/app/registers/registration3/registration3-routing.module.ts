import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Registration3Page } from './registration3.page';

const routes: Routes = [
  {
    path: '',
    component: Registration3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Registration3PageRoutingModule {}
