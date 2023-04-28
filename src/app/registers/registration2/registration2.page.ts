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

  registrationForm!: FormGroup;
  images: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public photoService: PhotoService,
    private toastController: ToastController
  ) {}
 ngOnInit() {
    this.photoService.loadSaved();

    this.registrationForm = this.formBuilder.group({
      outletName: ['', Validators.required],
      outletCode: ['', Validators.required],
      channel: ['', Validators.required],
      township: ['', Validators.required],
      team: ['', Validators.required],
      images: [null, Validators.required]
    });
  }

  async onSubmit() {
    if (this.registrationForm.invalid) {
      return;
    }

    // Save form data
    const formData = this.registrationForm.value;
    await Storage.set({
      key: 'formData',
      value: JSON.stringify(formData)
    });

    // Navigate to submit page
    this.router.navigateByUrl('/submit');
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.push(e.target.result);
          const imagesFormControl = this.registrationForm.get('images');
          if (imagesFormControl) {
            imagesFormControl.setValue(this.images);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }
  


  async deleteImage(index: number) {
    if (this.images && this.images.length > index) {
      this.images.splice(index, 1);
      if (this.registrationForm) {
        const imagesControl = this.registrationForm.get('images');
        if (imagesControl) {
          imagesControl.setValue(this.images);
        }
      }
      await Storage.set({
        key: 'images',
        value: JSON.stringify(this.images)
      });
      this.showToast('Image deleted successfully');
    }
  }
  

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
