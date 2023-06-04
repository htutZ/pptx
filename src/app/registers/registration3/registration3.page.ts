import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { UserPhoto, PhotoService } from '../../services/photo.service';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-registration3',
  templateUrl: './registration3.page.html',
  styleUrls: ['./registration3.page.scss'],
})
export class Registration3Page implements OnInit {
  registrationForm: FormGroup;
  public photos: UserPhoto[] = [];
  logos: UserPhoto[] = []; 

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public photoService: PhotoService,
    private templateService: TemplateService
  ) {
    this.registrationForm = this.formBuilder.group({
      outletName: ['', Validators.required],
      outletCode: ['', Validators.required],
      channel: ['', Validators.required],
      township: ['', Validators.required],
      team: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.photoService.loadSaved().then((result: {photos: UserPhoto[], logos: UserPhoto[]}) => {
      this.photos = result.photos;
      this.logos = result.logos;
      console.log(result.photos);
      console.log(result.logos);
    });
  }
  
  onSubmit() {
    // Save form data
    const formData = this.registrationForm.value;
    Storage.set({
      key: 'formData',
      value: JSON.stringify(formData)
    });

    // Navigate to the second page
    this.router.navigateByUrl('/confirmation3');
  }

  getPhotosForTemplate() {
    let maxPhotos;
    switch (this.templateService.templateType) {
      case 'template1':
        maxPhotos = 2;
        break;
      case 'template2':
        maxPhotos = 3;
        break;
      case 'template3':
        maxPhotos = 4;
        break;
      default:
        maxPhotos = this.photoService.photos.length;
    }
  
    return this.photoService.photos.slice(0, maxPhotos);
  }
}
