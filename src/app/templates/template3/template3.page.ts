import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { UserPhoto, PhotoService, Logo } from '../../services/photo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template3',
  templateUrl: './template3.page.html',
  styleUrls: ['./template3.page.scss'],
})
export class Template3Page implements OnInit {

  alertController: any;
  images: any;
  imageLimit: any;

  constructor(
    public photoService: PhotoService,
     public actionSheetController: ActionSheetController,
     private router: Router,
  ) { }

 async ngOnInit() {
    await this.photoService.loadSaved();
  }

  async showActionSheet(photo: UserPhoto | Logo, position: number, type: 'photo' | 'logo') {
    const actionSheet = await this.actionSheetController.create({
        header: "Photos",
        buttons: [
            {
                text: "Delete",
                role: "destructive",
                icon: "trash",
                handler: () => {
                    if (type === 'logo') {
                      const logo = photo as Logo;
                        this.photoService.deleteLogo(logo, position);
                    } else {
                        this.photoService.deletePicture(photo, position);
                    }
                },
            },
            {
                text: "Cancel",
                role: "cancel",
                icon: "close",
                handler: () => {
                    // Nothing to do, action sheet is automatically closed
                },
            },
        ],
    });
    await actionSheet.present();
}


  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
  
  submit() {
    this.router.navigateByUrl('/registration3');
  }
}
