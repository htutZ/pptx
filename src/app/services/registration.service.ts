import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  selectedTemplate: number | undefined;
  images: string[] = [];
  outletCode: string = '';
  outletName: string = '';
  channel: string = '';
  township: string = '';
  team: string = '';

  constructor() { }

  addImage(image: string) {
    if (this.images.length < this.getImageLimit()) {
      this.images.push(image);
    }
  }

  getImageLimit() {
    switch (this.selectedTemplate) {
      case 1:
        return 2;
      case 2:
        return 3;
      case 3:
        return 4;
      default:
        return 0;
    }
  }

  clear() {
    this.selectedTemplate = undefined;
    this.images = [];
    this.outletCode = '';
    this.outletName = '';
    this.channel = '';
    this.township = '';
    this.team = '';
  }
}
