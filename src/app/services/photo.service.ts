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
  public photos: UserPhoto[] = [];

  constructor() {}

  public async loadSaved(): Promise<UserPhoto[]> {
    const photoList = await Preferences.get({ key: this.PHOTO_STORAGE });
    const photoListValue = photoList.value;
    this.photos = JSON.parse(photoListValue ?? '[]');

    for (const photo of this.photos) {
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data
      });
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }

    return this.photos;
  }

  public async addNewToGallery() {
    if (this.photos.length < 2) {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        allowEditing: true,
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
  
    // Update photos array cache by overwriting the existing photo array
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  
    // Delete all photo files from filesystem
    const promises = this.photos.map(async (photo) => {
      const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data,
      });
    });
    await Promise.all(promises);
  }

  public async takePicFromGallery() {
    if (this.photos.length < 2) {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        allowEditing: true,
        source: Capacitor.isNative ? CameraSource.Camera : CameraSource.Photos,
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
  

  private async saveEditedPicture(canvas: fabric.Canvas, photo: UserPhoto): Promise<UserPhoto> {
    const base64Data = canvas.toDataURL({ format: 'jpeg', quality: 1 });
    const fileName = photo.filepath;
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data.split(',')[1],
      directory: Directory.Data,
      recursive: true,
    });
    return {
      filepath: fileName,
      webviewPath: base64Data,
    };
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
}