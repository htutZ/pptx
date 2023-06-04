import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'template-selection',
    loadChildren: () => import('./pages/template-selection/template-selection.module').then( m => m.TemplateSelectionPageModule)
  },
  {
    path: '',
    redirectTo: 'template-selection',
    pathMatch: 'full'
  },
  {
    path: 'template1',
    loadChildren: () => import('./templates/template1/template1.module').then( m => m.Template1PageModule)
  },
  {
    path: 'image-upload',
    loadChildren: () => import('./image-upload/image-upload.module').then( m => m.ImageUploadPageModule)
  },
  {
    path: 'template2',
    loadChildren: () => import('./templates/template2/template2.module').then( m => m.Template2PageModule)
  },
  {
    path: 'registration1',
    loadChildren: () => import('./registers/registration1/registration1.module').then( m => m.Registration1PageModule)
  },
  {
    path: 'registration2',
    loadChildren: () => import('./registers/registration2/registration2.module').then( m => m.Registration2PageModule)
  },
  {
    path: 'confirmation1',
    loadChildren: () => import('./confirmers/confirmation1/confirmation1.module').then( m => m.Confirmation1PageModule)
  },
  {
    path: 'powerpoint1',
    loadChildren: () => import('./ppt/powerpoint1/powerpoint1.module').then( m => m.Powerpoint1PageModule)
  },
  {
    path: 'confirmation2',
    loadChildren: () => import('./confirmers/confirmation2/confirmation2.module').then( m => m.Confirmation2PageModule)
  },  {
    path: 'finalpage',
    loadChildren: () => import('./final/finalpage/finalpage.module').then( m => m.FinalpagePageModule)
  },
  {
    path: 'template3',
    loadChildren: () => import('./templates/template3/template3.module').then( m => m.Template3PageModule)
  },
  {
    path: 'registration3',
    loadChildren: () => import('./registers/registration3/registration3.module').then( m => m.Registration3PageModule)
  },
  {
    path: 'confirmation3',
    loadChildren: () => import('./confirmers/confirmation3/confirmation3.module').then( m => m.Confirmation3PageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
