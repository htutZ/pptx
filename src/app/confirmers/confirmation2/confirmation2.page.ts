import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { PhotoService, UserPhoto } from '../../services/photo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-confirmation2',
  templateUrl: './confirmation2.page.html',
  styleUrls: ['./confirmation2.page.scss'],
})
export class Confirmation2Page implements OnInit {

  registrationForm: FormGroup;
  formData: any;
  public photos: UserPhoto[] = [];
  onSubmit: any;
  logos: UserPhoto[] = []; 
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public photoService: PhotoService,
    private alertController: AlertController
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
        console.log(this.formData);
      }
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

  submitRegistration(): void{
    this.router.navigateByUrl('/powerpoint2');
  }

}
