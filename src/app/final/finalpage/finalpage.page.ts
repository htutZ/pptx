import { Component, OnInit } from '@angular/core';
import { PhotoService, UserPhoto, Slide,Logo } from '../../services/photo.service';
import pptxgen from "pptxgenjs";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { format } from 'date-fns';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Capacitor, PermissionState, Plugins } from '@capacitor/core';
import { Filesystem, Directory, FilesystemDirectory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx'; 
import { LoadingController } from '@ionic/angular';
import { TemplateService } from '../../services/template.service';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { SQLiteService } from '../../services/sqlite.service';
import { Device } from '@capacitor/device';
import { Manage_All_Access } from 'manage-access';
import { Keyboard } from '@capacitor/keyboard';
import { FileWriter } from 'file-writer'

const TEMPLATE1 = 'template1';
const TEMPLATE2 = 'template2';
const TEMPLATE3 = 'template3';

@Component({
  selector: 'app-finalpage',
  templateUrl: './finalpage.page.html',
  styleUrls: ['./finalpage.page.scss'],
})
export class FinalpagePage implements OnInit {

  db!: SQLiteDBConnection;
  dbName: string = 'pptx';
  registrationForm: FormGroup;
  formData: any;
  public photos: UserPhoto[] = [];
  public slides: Slide[] = [];
  logos: UserPhoto[] = []; 
  public optionSelected = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public photoService: PhotoService,
    private alertController: AlertController,
    private androidPermissions: AndroidPermissions,
    private fileOpener: FileOpener,
    private loadingController: LoadingController,
    private templateService: TemplateService,
    private sqlite: SQLiteService,
  ) {
    this.optionSelected = false;
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

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Permission Required',
      message: 'App requires storage permissions to save Slides. Please grant permissions.',
      buttons: [{
        text: 'Grant Permission',
        handler: () => {
          this.requestWriteExternalStoragePermission();
        },
      }],
    });
    await alert.present();
  }

  async requestWriteExternalStoragePermission(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        const info = await Device.getInfo();
        if (info.platform === 'android') {
          let androidVersion: number;
          try {
            androidVersion = parseInt(info.osVersion);
            console.log(androidVersion);
          } catch (error) {
            console.error('Error parsing Android version:', error);
            return false;
          }
  
          if (androidVersion >= 10 && androidVersion < 13) {
            console.log("this is 10,11,12");
            const androidPermissions = new AndroidPermissions();
            const permission = androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE;
            const readPermission = androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE;
  
            const hasReadPermission = await androidPermissions.checkPermission(readPermission);
            if (!hasReadPermission.hasPermission) {
              const result = await androidPermissions.requestPermission(readPermission);
              if (!result.hasPermission) {
                console.error('Permission not granted: READ_EXTERNAL_STORAGE'); 
                return false;
              }
            }
  
            const hasPermission = await androidPermissions.checkPermission(permission);
            if (!hasPermission.hasPermission) {
              const result = await androidPermissions.requestPermission(permission);
              if (!result.hasPermission) {
                console.error('Permission not granted: WRITE_EXTERNAL_STORAGE'); 
                return false;
              }
            }
            console.log('Permission granted: WRITE_EXTERNAL_STORAGE');
            return true;
          } else if (androidVersion >= 13) {
            console.log("this is 13+")
  
            try {
              const checkResult = await Manage_All_Access.checkAllFilesAccessPermission();
              if (checkResult.hasPermission) {
                  console.log('Permission already granted: MANAGE_EXTERNAL_STORAGE');
                  return true;
              }
              await Manage_All_Access.requestAllFilesAccessPermission();
              console.log('Permission granted: MANAGE_EXTERNAL_STORAGE');
              return true;
          } catch (error) {
              console.error('Permission not granted: MANAGE_EXTERNAL_STORAGE', error);
              return false;
          }
          } else {
            console.log("9-")
            const { publicStorage } = await Filesystem.requestPermissions();
            if (publicStorage === 'granted') {
              console.log('Permission granted: WRITE_EXTERNAL_STORAGE');
              return true;
            } else {
              console.error('Permission not granted: WRITE_EXTERNAL_STORAGE');
              return false;
            }
          }
        } else {
          console.log('Not a native platform, permission request not needed');
          return true;
        }
      } else {
        console.log('Not a native platform, permission request not needed');
        return true;
      }
    } catch (error) {
      console.error('Error in requestWriteExternalStoragePermission:', error);
      return false;
    }
  
    return false;
  }

  async openFileLocation(fileUri: string) {
    try {
  
      await this.fileOpener.open(fileUri, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    } catch (error) {
      console.error('Error opening file location:', error);
    }
  }
  resetData() {
    this.registrationForm.reset();
    return this.photoService.resetGallery();
  }

  async newSlide() {
    
    await this.resetData();
  
    // Navigate back to template1 page
    this.router.navigate(['/template-selection']);
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
            handler: (data) => {
              console.log(data);  // Add this line to log the data object
              resolve(data.fileName)
            }
          }
        ]
      }).then(alert => {
        alert.present().then(() => {
          const input: any = document.querySelector('ion-alert input');
          input.focus();
          return;
        });
        alert.onDidDismiss().then(() => {
          // Remove the custom-alert CSS class after dismissing the alert
          const inputField = document.getElementById('input-field');
          if (inputField) {
            inputField.classList.remove('custom-alert');
          }
        });
      });
    });
  }


  async createPresentation(includeDate: boolean = false, date: Date | undefined = undefined) {
    try {
      const storagePermissionStatus = await this.requestWriteExternalStoragePermission();
      console.log('Storage permission status:', storagePermissionStatus);
      if (!storagePermissionStatus) {
        return;
      }
  
      const pptx = new pptxgen();
  
      const directoryContents = await Filesystem.readdir({
        path: '',
        directory: Directory.Data
      });
        
      const slideFileNames = directoryContents.files
        .filter(fileInfo => fileInfo.name.startsWith('slide'))
        .map(fileInfo => fileInfo.name)
        .sort((a, b) => {
          // Extract timestamps from the filename and sort based on them
          const timestampA = Number(a.replace('slide', '').replace('.json', ''));
          const timestampB = Number(b.replace('slide', '').replace('.json', ''));
          return timestampA - timestampB;
        });
  
      for (let filename of slideFileNames) {
        const jsonData = await Filesystem.readFile({
          path: filename,
          directory: Directory.Data,
          encoding: Encoding.UTF8
        });
        const slideData = JSON.parse(jsonData.data) as Slide;
  
        // Add slides...
        const slide = pptx.addSlide();
  
        const contentQueue = [
          { label: 'OUTLET NAME', value: slideData.formData.outletName },
          { label: 'OUTLET CODE', value: slideData.formData.outletCode },
          { label: 'CHANNEL', value: slideData.formData.channel },
          { label: 'TOWNSHIP', value: slideData.formData.township },
          { label: 'TEAM', value: slideData.formData.team },
        ].filter(item => item.value);
  
        contentQueue.forEach((item, index) => {
          slide.addText(`${item.label}: ${item.value}`, {
            x: 0.5,
            y: 0.3 + index * 0.2,
            color: "093C99",
            bold: true,
            fontSize: 13
          });
        });
  
        let maxPhotos;
        switch (slideData.templateType) {
          case TEMPLATE1:
            maxPhotos = 2;
            break;
           case TEMPLATE2:
            maxPhotos = 3;
            break;
            case TEMPLATE3:
            maxPhotos = 4;
            break;
        }
  
        // Add images based on the template type
        for (let i = 0; i < Math.min(slideData.photos.length, maxPhotos); i++) {
          if (slideData.photos[i]) {
            const webviewPath = slideData.photos[i].webviewPath;
            const photoData = webviewPath ? Capacitor.convertFileSrc(webviewPath) : '';
      
            let x,   y, w, h;
            switch (slideData.templateType) {
              case TEMPLATE1:
                if (i == 0) {
                  x = 0.5; y = 1.3; w = 4.2; h = 3.7;
                } else {
                  x = 5.1; y = 1.3; w = 4.2; h = 3.7;
                }
                break;
              case TEMPLATE2:
                if (i == 0) {
                  x = 0.5; y = 1.3; w = 4.1; h = 3.7;
                } else if (i == 1) {
                  x = 4.75; y = 1.3; w = 2.4; h = 3.7;
                } else {
                  x = 7.25; y = 1.3; w = 2.4; h = 3.7;
                }
                break;
              case TEMPLATE3:
                w = 4.1;
                h = 1.85;
                if (i == 0) {
                  x = 0.5; y = 1.3;
                } else if (i == 1) {
                  x = 5.1; y = 1.3;
                } else if (i == 2) {
                  x = 0.5; y = 3.15;
                } else {
                  x = 5.1; y = 3.15;
                }
                break;
            }
      
            slide.addImage({ data: photoData, x, y, w, h });
          }
        }
  
        // Add logos
        for (let logo of slideData.logos) {
          const { x, y, w, h } = logo.position;
          slide.addImage({ data: logo.logoData, x, y, w, h });
        }
  
        if (slideData.dateString) {
          slide.addText(slideData.dateString, { x: 0.5, y: 5.32, color: "093C99", bold: true, fontSize: 13 });
        }
      }
  
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
        // const blob = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64Data}`;
  
       console.log("Base64 data: ", base64Data);
        try {
          await loading.present();
          // Use FileWriterPlugin to create the file
          console.log("htut-0.8")


          let stringData;

if(base64Data instanceof ArrayBuffer) {
    const decoder = new TextDecoder('utf8');
    stringData = decoder.decode(base64Data);
} else if (typeof base64Data === 'string') {
    stringData = base64Data;
} else {
    console.error('Invalid base64Data type. Expected ArrayBuffer or string.');
    return;
}

          const result = await FileWriter.createDocument({
            fileName: fullFileName,
            fileContent: stringData,
          });
          console.log('Write result:', result);
          
          // Delete the slide files
          for (let filename of slideFileNames) {
            await Filesystem.deleteFile({
              path: filename,
              directory: Directory.Data,
            });
          }
          
          console.log('Presentation saved successfully.');
          alert(`Presentation was created successfully. File saved at: ${result.uri}`);
          
        
          const alertDialog = await this.alertController.create({
            header: 'File saved successfully',
            message: 'Do you want to open the file?',
            buttons: [
              {
                text: 'Confirm',
                handler: () => {
                  this.openFileLocation(result.uri); 
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
        } finally {
          await loading.dismiss();
        }
      }) 
    } catch (err) {
      console.error("Error creating presentation: ", err);
      alert('Error: Presentation was not created.');
    }
  
  }
  
  isLogoSelected(): boolean {
    return this.photoService.logos.some(logo => logo.selected);
  }
}
