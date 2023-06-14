  import { Injectable } from '@angular/core';
  import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
  import { Capacitor } from '@capacitor/core';
  import { Filesystem, Directory } from '@capacitor/filesystem';
  import { Preferences } from '@capacitor/preferences';
  import { Platform } from '@ionic/angular';
  import { fabric } from 'fabric';

  @Injectable({
    providedIn: 'root'
  })
  export class PhotoService {

    private PHOTO_STORAGE = 'photos';
    private LOGO_STORAGE = 'logos';
    public selectedTemplate: string = '';
    public photos: UserPhoto[] = [];
    public logos: UserPhoto[] = [];
    public slides: Slide[] = [];

    constructor() {}


    public async loadSaved(): Promise<{photos: UserPhoto[], logos: UserPhoto[]}> {
      const photoList = await Preferences.get({ key: this.PHOTO_STORAGE });
      const photoListValue = photoList.value;
      this.photos = JSON.parse(photoListValue ?? '[]');
    
      const logoList = await Preferences.get({ key: this.LOGO_STORAGE });
      const logoListValue = logoList.value;
      this.logos = JSON.parse(logoListValue ?? '[]');
    
      for (const photo of this.photos) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    
      for (const logo of this.logos) {
        const readFile = await Filesystem.readFile({
          path: logo.filepath,
          directory: Directory.Data
        });
        logo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    
      return {photos: this.photos, logos: this.logos};
    }

    public async loadSavedLogos() {
      this.logos = await this.getSavedLogos();
    
      for (let logo of this.logos) {
        logo.selected = false; 
      }
    }

    public async getSelectedLogos(): Promise<Logo[]> {
      const logoList = await Preferences.get({ key: this.LOGO_STORAGE });
      const logoListValue = logoList.value;
      const logos: UserPhoto[] = JSON.parse(logoListValue ?? '[]');
    
      const selectedLogos = logos.filter(logo => logo.selected);
      const logoPositions = [
        { x: 8.3, y: 0.35, w: 1.3, h: 0.5 },
        { x: 8.3, y: 4.9, w: 1.3, h: 0.5 }
      ];
    
      return Promise.all(
        selectedLogos.map(async (logo, index) => {
          if (logo.filepath && index < logoPositions.length) {
            const logoData = await this.getBase64FromPath(logo.filepath);
            const { x, y, w, h } = logoPositions[index];
            return { ...logo, logoData, position: { x, y, w, h } };
          }
          return null;
        })
      ).then(logos => logos.filter((logo): logo is Logo => logo !== null)); // Filter out null values and cast the result to Logo[]
    }

    public async saveLogo(image: UserPhoto, selected: boolean = false) {
      image.selected = selected;
      this.logos.push(image);
      await Preferences.set({
        key: this.LOGO_STORAGE,
        value: JSON.stringify(this.logos)
      });
    }

    public async getSavedLogos(): Promise<UserPhoto[]> {
      const storedLogos = await Preferences.get({ key: this.LOGO_STORAGE });
      const logos = JSON.parse(storedLogos.value || '[]');
    
      for (let logo of logos) {
        const readFile = await Filesystem.readFile({
          path: logo.filepath,
          directory: Directory.Data
        });
        logo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
        logo.selected = false;  // Set selected property to false
      }
    
      return logos;
    }

    public async addNewLogoToGallery(selected: boolean = false) {
      if (this.logos.length < 2) {
        const capturedLogo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          allowEditing: false,
          source: CameraSource.Photos,
          quality: 100
        });
    
        const savedImageFile = await this.savePicture(capturedLogo);
    
        const userPhoto: UserPhoto = {
          filepath: savedImageFile.filepath,
          webviewPath: savedImageFile.webviewPath,
          selected: selected // Set selected property
        }
    
        this.saveLogo(userPhoto, selected);
      }
    }


    public async addNewToGallery() {
      if (this.photos.length < 2) {
        const capturedPhoto = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          allowEditing: false,
          source: CameraSource.Camera,
          quality: 100
        });

        const savedImageFile = await this.savePicture(capturedPhoto);
        this.photos.unshift(savedImageFile);

        Preferences.set({
          key: this.PHOTO_STORAGE,
          value: JSON.stringify(this.photos)
        });
      }
    }

    public async addNewToGallery3Pics() {
      if (this.photos.length < 3) {
        const capturedPhoto = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          allowEditing: false,
          source: CameraSource.Camera,
          quality: 100
        });

        const savedImageFile = await this.savePicture(capturedPhoto);
        this.photos.unshift(savedImageFile);

        Preferences.set({
          key: this.PHOTO_STORAGE,
          value: JSON.stringify(this.photos)
        });
      }
    }

    public async addNewToGallery4Pics() {
      if (this.photos.length < 4) {
        const capturedPhoto = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          allowEditing: false,
          source: CameraSource.Camera,
          quality: 100
        });

        const savedImageFile = await this.savePicture(capturedPhoto);
        this.photos.unshift(savedImageFile);

        Preferences.set({
          key: this.PHOTO_STORAGE,
          value: JSON.stringify(this.photos)
        });
      }
    }

    public async resetGallery() {
      this.photos = [];
      this.logos = [];
    
      // Update photos array cache by overwriting the existing photo array
      Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos),
      });
    
      // Update logos array cache by overwriting the existing logo array
      Preferences.set({
        key: this.LOGO_STORAGE,
        value: JSON.stringify(this.logos),
      });
    
      // Delete all photo files from filesystem
      const photoPromises = this.photos.map(async (photo) => {
        const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
        await Filesystem.deleteFile({
          path: filename,
          directory: Directory.Data,
        });
      });
    
      // Delete all logo files from filesystem
      const logoPromises = this.logos.map(async (logo) => {
        const filename = logo.filepath.substr(logo.filepath.lastIndexOf('/') + 1);
        await Filesystem.deleteFile({
          path: filename,
          directory: Directory.Data,
        });
      });
    
      await Promise.all([...photoPromises, ...logoPromises]);
    }
    

    public async takePicFromGallery() {
      if (this.photos.length < 2) {
        const capturedPhoto = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          allowEditing: false,
          source: CameraSource.Photos,
          quality: 80
        });

        const savedImageFile = await this.savePicture(capturedPhoto);
        this.photos.unshift(savedImageFile);

        Preferences.set({
          key: this.PHOTO_STORAGE,
          value: JSON.stringify(this.photos)
        });


      }
    }

    public async takePicFromGallery3Pics() {
      if (this.photos.length < 3) {
        const capturedPhoto = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          allowEditing: false,
          source: CameraSource.Photos,
          quality: 80
        });

        const savedImageFile = await this.savePicture(capturedPhoto);
        this.photos.unshift(savedImageFile);

        Preferences.set({
          key: this.PHOTO_STORAGE,
          value: JSON.stringify(this.photos)
        });


      }
    }

    public async takePicFromGallery4Pics() {
      if (this.photos.length < 4) {
        const capturedPhoto = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          allowEditing: false,
          source: CameraSource.Photos,
          quality: 80
        });

        const savedImageFile = await this.savePicture(capturedPhoto);
        this.photos.unshift(savedImageFile);

        Preferences.set({
          key: this.PHOTO_STORAGE,
          value: JSON.stringify(this.photos)
        });


      }
    }

    private async savePicture(photo: Photo) {
      const base64Data = await this.readAsBase64(photo);
      const fileName = new Date().getTime() + '.jpeg';
      const savedFile = await Filesystem.writeFile({
        path: photo.webPath ? fileName : '',
        data: base64Data,
        directory: Directory.Data
      });
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }

    public async getBase64FromPath(filepath: string): Promise<string> {
      const readFile = await Filesystem.readFile({
        path: filepath,
        directory: Directory.Data
      });
    
      return `data:image/jpeg;base64,${readFile.data}`;
    }

    private async readAsBase64(photo: Photo) {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
    
      return await this.convertBlobToBase64(blob) as string;
    }

    
    public async deletePicture(photo: UserPhoto, position: number) {
      // Remove this photo from the Photos reference data array
      this.photos.splice(position, 1);

      // Update photos array cache by overwriting the existing photo array
      Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos),
      });

      // delete photo file from filesystem
      const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data,
      });
    }

    public async deleteLogo(photo: Logo,position: number) {
      // Get the logo at the specified position
      const logo = this.logos[position];
      
      // Remove this logo from the logos reference data array
      this.logos.splice(position, 1);
    
      // Update logos array cache by overwriting the existing logo array
      await Preferences.set({
        key: this.LOGO_STORAGE,
        value: JSON.stringify(this.logos),
      });
    
      // Delete logo file from filesystem
      const filename = logo.filepath.substr(logo.filepath.lastIndexOf('/') + 1);
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data,
      });
    }

    private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
          resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }

  export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
    selected?: boolean;
  }

  export interface Logo {
    filepath: string;
    webviewPath?: string;
    selected?: boolean;
    logoData: string;
    position: { x: number; y: number; w: number; h: number };
  }

  export interface Slide {
    formData: any;
    photos: UserPhoto[];
    logos: Logo[];
    templateType: string;
    dateString?: string;
  }

  