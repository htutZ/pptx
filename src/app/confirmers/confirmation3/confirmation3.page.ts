import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { PhotoService, UserPhoto } from '../../services/photo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-confirmation3',
  templateUrl: './confirmation3.page.html',
  styleUrls: ['./confirmation3.page.scss'],
})
export class Confirmation3Page implements OnInit {

  editStates = {
    outletName: false,
    outletCode: false,
    channel: false,
    township: false,
    team: false
};

  registrationForm: FormGroup;
  formData: any;
  public photos: UserPhoto[] = [];
  onSubmit: any;
  logos: UserPhoto[] = []; 
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public photoService: PhotoService,
    private alertController: AlertController,
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
    Storage.get({ key: 'formData' }).then((result) => {
      if (result.value) {
        this.formData = JSON.parse(result.value);
        this.registrationForm.patchValue(this.formData);
        console.log(this.formData);
      }
    });

    this.registrationForm.valueChanges.subscribe(newData => {
      Storage.set({
        key: 'formData',
        value: JSON.stringify(newData)
      }).then(() => {
        console.log('Data stored successfully');
      }).catch((err) => {
        console.error('Error storing data:', err);
      });
    });
  
  }

  async confirmRegistration() {
    const alert = await this.alertController.create({
      header: 'Confirm registration',
      message: `
        <p>Outlet Name: ${this.registrationForm.value.outletName}</p>
        <p>Outlet Code: ${this.registrationForm.value.outletCode}</p>
        <p>Channel: ${this.registrationForm.value.channel}</p>
        <p>Township: ${this.registrationForm.value.township}</p>
        <p>Team: ${this.registrationForm.value.team}</p>
      `,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.submitRegistration();
          }
        }
      ]
    });

    await alert.present();
  }

  async submitRegistration(): Promise<void> {
    await Storage.set({
      key: 'formData',
      value: JSON.stringify(this.registrationForm.value)
    });
    this.router.navigateByUrl('/powerpoint1');
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
