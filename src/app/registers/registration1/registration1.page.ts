import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { PhotoService, UserPhoto } from '../../services/photo.service';

@Component({
  selector: 'app-registration1',
  templateUrl: './registration1.page.html',
  styleUrls: ['./registration1.page.scss'],
})
export class Registration1Page implements OnInit{
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
    Storage.set({
      key: 'formData',
      value: JSON.stringify(formData)
    });

    // Navigate to the second page
    this.router.navigateByUrl('/confirmation1');
  }
}
