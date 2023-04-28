import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-template2',
  templateUrl: './template2.page.html',
  styleUrls: ['./template2.page.scss'],
})
export class Template2Page implements OnInit {

  images: string[] = [];
  name: string = '';
  email: string = '';
  
  constructor(public photoService: PhotoService) { }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  ngOnInit() {
  }

}
