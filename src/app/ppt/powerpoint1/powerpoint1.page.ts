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
import { Filesystem, Directory, FilesystemDirectory, FilesystemEncoding } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx'; 
import { LoadingController } from '@ionic/angular';
import { TemplateService } from 'src/app/services/template.service';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { SQLiteService } from '../../services/sqlite.service';

@Component({
  selector: 'app-powerpoint1',
  templateUrl: './powerpoint1.page.html',
  styleUrls: ['./powerpoint1.page.scss'],
})
export class Powerpoint1Page implements OnInit {

  db!: SQLiteDBConnection;
  dbName: string = 'pptx';
  registrationForm: FormGroup;
  formData: any;
  public photos: UserPhoto[] = [];
  public slides: Slide[] = [];
  logos: UserPhoto[] = []; 
  private slideCounter = 0;

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


   async saveSlide(includeDate: boolean = false, date: Date | undefined = undefined) {

    await this.requestWriteExternalStoragePermission();

    const templateType = this.templateService.templateType;
    if (!templateType) {
      // handle the case where templateType is null
      console.error("No template selected");
      return;
    }
    const dateString = date ? format(date, "MMMM d, yyyy") : "";
  
    const logoPositions = [
      { x: 8.3, y: 0.35, w: 1.3, h: 0.5 },
      { x: 8.3, y: 4.9, w: 1.3, h: 0.5 }
    ];
  
    // Get selected logos from photoService
    const selectedLogos: UserPhoto[] = this.photoService.logos.filter(logo => logo.selected);
  
    // Convert UserPhoto[] to Logo[]
    const logos: Logo[] = selectedLogos.map((logo, index) => {
      return {
        filepath: logo.filepath,
        logoData: logo.webviewPath || '', // if webviewPath is undefined, use an empty string
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
    await this.requestWriteExternalStoragePermission();
    const timestamp = new Date().getTime();
     const fileName = `slide${timestamp}.json`;

    await Filesystem.writeFile({
      path: fileName,
      data: JSON.stringify(newSlide),
      directory: Directory.Data,
      encoding: FilesystemEncoding.UTF8,
    });

    console.log('Slide saved successfully');
  } catch (error) {
    console.error('Could not save slide', error);
  } finally {
    console.log(newSlide);
    this.formData = {};
    this.photos = [];
  }

  }  

  async createPresentation(includeDate: boolean = false, date: Date | undefined = undefined) {
  try {
    await this.requestWriteExternalStoragePermission();

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
        encoding: FilesystemEncoding.UTF8
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
          fontSize: 15
        });
      });

      // Add images based on the template type
      for (let i = 0; i < slideData.photos.length; i++) {
        if (slideData.photos[i]) {
          const webviewPath = slideData.photos[i].webviewPath;
          const photoData = webviewPath ? Capacitor.convertFileSrc(webviewPath) : '';
          slide.addImage({ data: photoData, x: (i % 2) * 4.3 + 0.7, y: Math.floor(i / 2) * 1.8 + 1.3, w: 4, h: 3.5 });
        }
      }

      // Add logos
      for (let logo of slideData.logos) {
        const { x, y, w, h } = logo.position;
        slide.addImage({ data: logo.logoData, x, y, w, h });
      }

      if (slideData.dateString) {
        slide.addText(slideData.dateString, { x: 0.5, y: 5.1, color: "093C99", bold: true, fontSize: 14 });
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
      const blob = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64Data}`;
      
      try {
      await loading.present();

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
            recursive: true, 
          });
        }
      
        const result = await Filesystem.writeFile({
          path: `${newFolder}/${fullFileName}`,
          data: blob,
          directory: Directory.Documents,
        });
      
        const fileUri = await Filesystem.getUri({
          path: `${newFolder}/${fullFileName}`,
          directory: Directory.Documents,
        }).catch((error) => {
          console.error("Error getting file URI:", error);
          throw error;
        });
        
        for (let filename of slideFileNames) {
          await Filesystem.deleteFile({
            path: filename,
            directory: Directory.Data,
          });
        }

        await loading.dismiss();
        console.log('Presentation saved successfully.');
        alert(`Presentation was created successfully. File saved at: ${fileUri.uri}`);

        const alertDialog = await this.alertController.create({
          header: 'File saved successfully',
          message: 'Do you want to open the file?',
          buttons: [
            {
              text: 'Confirm',
              handler: () => {
                this.openFileLocation(fileUri.uri); 
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

isLogoSelected(): boolean {
  return this.photoService.logos.some(logo => logo.selected);
}

}