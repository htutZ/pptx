import { Component, OnInit } from '@angular/core';
import { PhotoService, UserPhoto } from '../../services/photo.service';
import pptxgen from "pptxgenjs";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';

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
    private alertController: AlertController
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


  newSlide() {
    console.log('zzz')
  }
  createPresentation() {
    const pptx = new pptxgen();

    const slide = pptx.addSlide();
    
    

    if (this.formData.outletName) {
      slide.addText(`OUTLET NAME: ${this.formData.outletName}`, { x: 0.5, y: 0.3, color: "093C99", bold: true, fontSize: 15 });
    }
    
    if (this.formData.outletCode) {
      slide.addText(`OUTLET CODE: ${this.formData.outletCode}`, { x: 0.5, y: 0.5, color: "093C99", bold: true, fontSize: 15 });
    }
    
    // Add a slide with the channel, township, and team from the formData object
    if (this.formData.channel) {
      slide.addText(`CHANNEL: ${this.formData.channel}`, { x: 0.5, y: 0.7, color: "093C99", bold: true, fontSize: 15 });
    }
    
    if (this.formData.township) {
      slide.addText(`TOWNSHIP: ${this.formData.township}`, { x: 0.5, y: 0.9, color: "093C99", bold: true, fontSize: 15 });
    }
    
    if (this.formData.team) {
      slide.addText(`TEAM: ${this.formData.team}`, { x: 0.5, y: 1.1, color: "093C99", bold: true, fontSize: 15 });
    }

    const firstPhotoData = this.photos[0].webviewPath;
    const secondPhotoData = this.photos[1].webviewPath;
slide.addImage({ data: firstPhotoData, x: 0.5, y: 1.5, w: 4, h: 3 });
slide.addImage({ data: secondPhotoData, x: 5, y: 1.5, w: 4, h: 3 });
    // 4. Save the Presentation
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

      
      const writeFileProps: pptxgen.WriteFileProps = {
        fileName: fileName
      };
      pptx.writeFile(writeFileProps);
  }
}
