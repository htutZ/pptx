import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ImageUploadPageRoutingModule } from './image-upload-routing.module';
import { ImageUploadPage } from './image-upload.page';
import { Camera } from '@ionic-native/camera/ngx'; // import Camera service

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ImageUploadPageRoutingModule
  ],
  declarations: [ImageUploadPage],
  providers: [Camera] // add Camera to providers array
})
export class ImageUploadPageModule {}
