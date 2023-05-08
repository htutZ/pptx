import { Component, OnInit } from '@angular/core';
import { PhotoService, UserPhoto } from '../../services/photo.service';
import pptxgen from "pptxgenjs";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { format } from 'date-fns';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Capacitor, PermissionState, Plugins } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-powerpoint1',
  templateUrl: './powerpoint1.page.html',
  styleUrls: ['./powerpoint1.page.scss'],
})
export class Powerpoint1Page implements OnInit {
  registrationForm: FormGroup;
  formData: any;
  public photos: UserPhoto[] = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public photoService: PhotoService,
    private alertController: AlertController,
    private androidPermissions: AndroidPermissions 
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
    this.photoService.loadSaved().then((photos: UserPhoto[]) => {
      this.photos = photos;
      console.log(photos);
    });
    Storage.get({ key: 'formData' }).then((result) => {
      if (result.value) {
        this.formData = JSON.parse(result.value);
        console.log(this.formData);
      }
    });
  }

async requestWriteExternalStoragePermission() {
  if (Capacitor.isNativePlatform()) {
    try {
      const status = await Filesystem.requestPermissions();
      if (status.publicStorage === 'granted') {
        console.log('Permission granted: WRITE_EXTERNAL_STORAGE');
      } else {
        console.error('Permission not granted: WRITE_EXTERNAL_STORAGE');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  } else {
    console.log('Not a native platform, permission request not needed');
  }
}

  async newSlide() {
    this.registrationForm.reset();

    // Clear photos array
    await this.photoService.resetGallery();
  
    // Navigate back to template1 page
    this.router.navigate(['/template1']);
  }

  gobacktoTemplates(){
    this.router.navigate(['/template-selection']);
  }

  async createPresentation() {
    try {

    this.requestWriteExternalStoragePermission();

    const pptx = new pptxgen();

    console.log('the function works')
  const currentDate = new Date();
const dateString = format(currentDate, "MMMM d, yyyy");
    const slide = pptx.addSlide();
    
    // Add outlet name, code, channel, township, and team to the slide
    if (this.formData.outletName) {
      slide.addText(`OUTLET NAME: ${this.formData.outletName}`, { x: 0.5, y: 0.3, color: "093C99", bold: true, fontSize: 15 });
    }
    
    if (this.formData.outletCode) {
      slide.addText(`OUTLET CODE: ${this.formData.outletCode}`, { x: 0.5, y: 0.5, color: "093C99", bold: true, fontSize: 15 });
    }
    
    if (this.formData.channel) {
      slide.addText(`CHANNEL: ${this.formData.channel}`, { x: 0.5, y: 0.7, color: "093C99", bold: true, fontSize: 15 });
    }
    
    if (this.formData.township) {
      slide.addText(`TOWNSHIP: ${this.formData.township}`, { x: 0.5, y: 0.9, color: "093C99", bold: true, fontSize: 15 });
    }
    
    if (this.formData.team) {
      slide.addText(`TEAM: ${this.formData.team}`, { x: 0.5, y: 1.1, color: "093C99", bold: true, fontSize: 15 });
    }
  
    
    // Add the first two photos to the slide
    if (this.photos[0]?.webviewPath && this.photos[1]?.webviewPath) {
      const firstPhotoData = Capacitor.convertFileSrc(this.photos[0].webviewPath) || '';
      const secondPhotoData = Capacitor.convertFileSrc(this.photos[1].webviewPath) || '';
    
      slide.addImage({ data: firstPhotoData, x: 0.7, y: 1.3, w: 4, h: 3.5 });
      slide.addImage({ data: secondPhotoData, x: 5, y: 1.3, w: 4.6, h: 3.5 });
    }
    slide.addText(dateString, { x: 0.5, y: 5.1, color: "093C99", bold: true, fontSize: 14 });

    const now = new Date();
    const fileName = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now
      .getDate()
      .toString()
      .padStart(2, "0")}-${now
      .getHours()
      .toString()
      .padStart(2, "0")}-${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}.pptx`;
    
      pptx.write("base64")
      .then(async (base64Data) => {
        // Add the proper prefix for a PowerPoint base64 string
        const blob = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64Data}`;
        let fileUri;
        
        try {
          // Create a new folder named "powerpoints" inside the Documents directory
          const newFolder = 'powerpoints';
          await Filesystem.mkdir({
            path: newFolder,
            directory: Directory.Documents,
            recursive: false, // Set to true if you want to create nested directories
          });
        
          // Save the Blob in the "powerpoints" folder
          const result = await Filesystem.writeFile({
            path: `${newFolder}/${fileName}`,
            data: blob,
            directory: Directory.Documents,
          });
        
          // Get the file path of the saved presentation
          const fileUri = await Filesystem.getUri({
            path: `${newFolder}/${fileName}`,
            directory: Directory.Documents,
          });
        
          console.log('Presentation saved successfully.');
          alert(`Presentation was created successfully. File saved at: ${fileUri.uri}`);
        } catch (err) {
          console.error('Error: Presentation was not created:', err);
          alert('Saving file does not complete.');
        }

        console.log('Presentation saved successfully.');
        alert('Presentation was created successfully.');
      })
      .catch((err) => {
        console.error('Error: Presentation was not created:', err);
        alert('Error: Presentation was not created.');
      });
    

        console.log('Presentation saved successfully.');
      
    
  } catch (err) {
    console.error("Error creating presentation: ", err);
  }
}
}