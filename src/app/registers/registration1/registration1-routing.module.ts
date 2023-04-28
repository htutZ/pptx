import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Registration1Page } from './registration1.page';

const routes: Routes = [
  {
    path: '',
    component: Registration1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Registration1PageRoutingModule {}
