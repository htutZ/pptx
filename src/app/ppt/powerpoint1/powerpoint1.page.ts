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
import { FileOpener } from '@ionic-native/file-opener/ngx'; 
import { LoadingController } from '@ionic/angular';

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
    private androidPermissions: AndroidPermissions,
    private fileOpener: FileOpener,
    private loadingController: LoadingController
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

 async gobacktoTemplates(){

    this.registrationForm.reset();

    // Clear photos array
    await this.photoService.resetGallery();
    this.router.navigate(['/template-selection']);
  }

  async openFileLocation(fileUri: string) {
    try {
  
      await this.fileOpener.open(fileUri, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    } catch (error) {
      console.error('Error opening file location:', error);
    }
  }

  async askToAddDate() {
    const currentDate = new Date();
    const dateString = format(currentDate, "MMMM d, yyyy");

    const alert = await this.alertController.create({
      header: 'Add Date',
      message: `<img src="../../assets/example.jpg" alt="Date example" width="100%"><br>Would you like to add the current date (${dateString}) at the left side bottom of the PowerPoint?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
              this.createPresentation();
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.createPresentation(true);
          }
        }
      ]
    });
  
    await alert.present();
  }

  async getFileName(): Promise<string> {
    return new Promise<string>((resolve) => {
      this.alertController.create({
        cssClass: 'custom-alert',
        header: 'Enter File Name',
        inputs: [
          {
            id: 'input-field',
            name: 'fileName',
            type: 'text',
            placeholder: 'Enter File Name Here'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-cancel-button',
            handler: () => resolve('')
          },
          {
            text: 'Confirm',
            cssClass: 'alert-confirm-button',
            handler: (data) => resolve(data.fileName)
          }
        ]
      }).then(alert => alert.present());
    });
  }

  async createPresentation(includeDate: boolean = false) {

    try {

   await this.requestWriteExternalStoragePermission();

    const pptx = new pptxgen();

  const currentDate = new Date();
   const dateString = format(currentDate, "MMMM d, yyyy");
    const slide = pptx.addSlide();
    

    const contentQueue = [
      {label: 'OUTLET NAME', value: this.formData.outletName},
      {label: 'OUTLET CODE', value: this.formData.outletCode},
      {label: 'CHANNEL', value: this.formData.channel},
      {label: 'TOWNSHIP', value: this.formData.township},
      {label: 'TEAM', value: this.formData.team},
  ].filter(item => item.value);
  
    contentQueue.forEach((item, index) => {
      slide.addText(`${item.label}: ${item.value}`, { x: 0.5, y: 0.3 + index*0.2, color: "093C99", bold: true, fontSize: 15 });
  });
    
    // Add the first two photos to the slide
    if (this.photos[0]?.webviewPath && this.photos[1]?.webviewPath) {
      const firstPhotoData = Capacitor.convertFileSrc(this.photos[0].webviewPath) || '';
      const secondPhotoData = Capacitor.convertFileSrc(this.photos[1].webviewPath) || '';
    
      slide.addImage({ data: firstPhotoData, x: 0.7, y: 1.3, w: 4, h: 3.5 });
      slide.addImage({ data: secondPhotoData, x: 5, y: 1.3, w: 4.6, h: 3.5 });
    }
    
    if (includeDate) {
      slide.addText(dateString, { x: 0.5, y: 5.1, color: "093C99", bold: true, fontSize: 14 });
  }

  const selectedLogos = this.photoService.logos.filter(logo => logo.selected);
  for (let [index, logo] of selectedLogos.entries()) {
    if (logo.filepath) {
      const logoData = await this.photoService.getBase64FromPath(logo.filepath);
      console.log(logoData)
      slide.addImage({ data: logoData, x: 0.7 + index*4.3, y: 1.3, w: 4, h: 3.5 });
    }
  }

    const now = new Date();
    const fileName = await this.getFileName();

    if (fileName === '') {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });

    const fullFileName = `${fileName}.pptx`;
    
      pptx.write("base64")
      .then(async (base64Data) => {
        // Add the proper prefix for a PowerPoint base64 string
        const blob = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64Data}`;
        
        try {
        await loading.present();
          // Create a new folder named "powerpoints" inside the Documents directory
          const newFolder = 'powerpoints';
          const entries = await Filesystem.readdir({
            path: '',
            directory: Directory.Documents,
          });
          const directoryExists = entries.files.some((entry) => entry.name === newFolder);          
          
          if (!directoryExists) {
            await Filesystem.mkdir({
              path: newFolder,
              directory: Directory.Documents,
              recursive: true, // Set to true if you want to create nested directories
            });
          }
        
          // Save the Blob in the "powerpoints" folder
          const result = await Filesystem.writeFile({
            path: `${newFolder}/${fullFileName}`,
            data: blob,
            directory: Directory.Documents,
          });
        
          // Get the file path of the saved presentation
          const fileUri = await Filesystem.getUri({
            path: `${newFolder}/${fullFileName}`,
            directory: Directory.Documents,
          }).catch((error) => {
            console.error("Error getting file URI:", error);
            throw error;
          });


          loading.dismiss();
          console.log('Presentation saved successfully.');
          alert(`Presentation was created successfully. File saved at: ${fileUri.uri}`);

          const alertDialog = await this.alertController.create({
            header: 'File saved successfully',
            message: 'Do you want to open the file?',
            buttons: [
              {
                text: 'Confirm',
                handler: () => {
                  this.openFileLocation(fileUri.uri); // <-- Modify this line
                },
              },
              {
                text: 'Cancel',
                role: 'cancel',
              },
            ],
          });
          await alertDialog.present();


        } catch (err) {
          console.error('Error: Presentation was not created:', err);
          alert('Saving file does not complete.');
        }
      })
    
  } catch (err) {
    console.error("Error creating presentation: ", err);
    alert('Error: Presentation was not created.');
  }
}

}