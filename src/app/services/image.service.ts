import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private images: typeof Image[] = [];

  private imageSubject = new BehaviorSubject(this.images);
  public imageObservable = this.imageSubject.asObservable();

  constructor() { }

  addImage(image: typeof Image) {
    this.images.push(image);
    this.imageSubject.next(this.images);
  }

  getImages() {
    return this.images;
  }

  clearImages() {
    this.images = [];
    this.imageSubject.next(this.images);
  }
}
