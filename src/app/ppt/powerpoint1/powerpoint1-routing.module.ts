import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Powerpoint1Page } from './powerpoint1.page';

const routes: Routes = [
  {
    path: '',
    component: Powerpoint1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Powerpoint1PageRoutingModule {}
