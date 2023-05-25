import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { UserPhoto, PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-registration2',
  templateUrl: './registration2.page.html',
  styleUrls: ['./registration2.page.scss'],
})
export class Registration2Page implements OnInit {

  registrationForm: FormGroup;
  public photos: UserPhoto[] = [];
  logos: UserPhoto[] = []; 

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public photoService: PhotoService
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
    console.log(
      formData
    )
    Storage.set({
      key: 'formData',
      value: JSON.stringify(formData)
    });

    // Navigate to the second page
    this.router.navigateByUrl('/confirmation2');
  }
}
