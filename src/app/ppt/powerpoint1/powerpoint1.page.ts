import { Component, OnInit } from '@angular/core';
import { PhotoService, UserPhoto, Slide,Logo } from '../../services/photo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { format } from 'date-fns';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Capacitor, PermissionState, Plugins } from '@capacitor/core';
import { Filesystem, Directory, FilesystemDirectory, FilesystemEncoding, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx'; 
import { LoadingController } from '@ionic/angular';
import { TemplateService } from '../../services/template.service';
import { Device } from '@capacitor/device';
import { DozeOptimize } from 'capacitor-doze-optimize';
import { Manage_All_Access } from 'manage-access';

@Component({
  selector: 'app-powerpoint1',
  templateUrl: './powerpoint1.page.html',
  styleUrls: ['./powerpoint1.page.scss'],
})
export class Powerpoint1Page implements OnInit {

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
    this.checkOptimizationStatus();
  }
  

  async checkOptimizationStatus(): Promise<void> {
    try {
      const info = await Device.getInfo();
  
      if (!info.manufacturer) {
        console.error('Cannot determine device manufacturer.');
        return;
      }
  
      console.log(`Device manufacturer: ${info.manufacturer}`);
      if (info.manufacturer.toLowerCase() === 'huawei') {
        try {
          const response = await DozeOptimize.isIgnoringBatteryOptimizations();
          console.log(response);
  
          if(response.isIgnoring === false){
            DozeOptimize.requestOptimizationsMenu();
          }
        } catch (error) {
          console.error('An error occurred while checking battery optimizations:', error);
        }
      } else {
        console.log('This functionality is specific for Huawei devices.');
      }
    } catch (error) {
      console.error('Error getting device info:', error);
    }
  }

  noLogoSelected = false;

  deselectLogos() {
    if (this.noLogoSelected) {
      for (let logo of this.photoService.logos) {
        logo.selected = false;
      }
      this.optionSelected = true;
    }
  }

  uncheckNoLogoSelected() {
    if (!this.noLogoSelected) {
      this.optionSelected = true;
    }
  }

checkOptionSelected() {
    let anyLogoSelected = this.photoService.logos.some(logo => logo.selected);
    this.optionSelected = anyLogoSelected || this.noLogoSelected;
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

async requestManageAllAccessPermission(): Promise<boolean> {
  const manageAllAccessPlugin: any = Manage_All_Access;
  try {
    await manageAllAccessPlugin.requestAllFilesAccessPermission();
    console.log('Permission granted: MANAGE_EXTERNAL_STORAGE');
    // You need to add your own code to handle the result of the permission request.
    return true;
  } catch (error) {
    console.error('Permission not granted: MANAGE_EXTERNAL_STORAGE');
    return false;
  }
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


async askToAddDate() {
  const alert = await this.alertController.create({
    header: 'Add Date',
    message: `<img src="../../assets/example.jpg" alt="Date example" width="100%"><br>Would you like to add a date at the left side bottom of the PowerPoint?`,
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
          this.saveSlide();
        }
      }, {
        text: 'Yes',
        handler: async () => {
          const customDateAlert = await this.alertController.create({
            header: 'Enter Date',
            inputs: [
              {
                name: 'customDate',
                type: 'date',
                placeholder: 'Custom Date'
              }
            ],
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  this.saveSlide();
                }
              }, {
                text: 'Add',
                handler: (data) => {
                  if (data.customDate) {
                    const customDate = new Date(data.customDate);
                    this.saveSlide(true, customDate);
                  } else {
                    this.saveSlide();
                  }
                }
              }
            ]
          });

          await customDateAlert.present();
        }
      }
    ]
  });

  await alert.present();
}

  async saveSlide(includeDate: boolean = false, date: Date | undefined = undefined) {
    const storagePermissionStatus = await this.requestWriteExternalStoragePermission();
  
    if (!storagePermissionStatus) {
      return;
    }
  
    const templateType = this.templateService.templateType;
    if (!templateType) {
      console.error("No template selected");
      alert("No template selected.");
      this.router.navigate(['/template-selection']);
      return;
    }
  
    const dateString = date ? format(date, "MMMM d, yyyy") : "";
  
    const logoPositions = [
      { x: 8.3, y: 0.35, w: 1.3, h: 0.5 },
      { x: 8.3, y: 5.1, w: 1.2, h: 0.4 }
    ];
  
    const selectedLogos: UserPhoto[] = this.photoService.logos.filter(logo => logo.selected);
  
    const logos: Logo[] = selectedLogos.map((logo, index) => {
      return {
        filepath: logo.filepath,
        logoData: logo.webviewPath || '',
        position: logoPositions[index % logoPositions.length]
      };
    });
  
    const newSlide: Slide = {
      formData: this.formData,
      photos: this.photos,
      logos: logos,
      templateType: templateType,
      dateString: dateString
    };
  
    try {
      const timestamp = new Date().getTime();
      const fileName = `slide${timestamp}.json`;
  
      await Filesystem.writeFile({
        path: fileName,
        data: JSON.stringify(newSlide),
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
  
      console.log('Slide saved successfully');
    } catch (error) {
      console.error('Could not save slide', error);
    } finally {
      console.log(newSlide);
      this.formData = {};
      this.photos = [];
      this.router.navigate(['/finalpage']);
    }
  }

isLogoSelected(): boolean {
  return this.photoService.logos.some(logo => logo.selected);
}

}