import { Component, OnInit } from '@angular/core';
import { PhotoService, UserPhoto } from '../../services/photo.service';
import pptxgen from "pptxgenjs";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { format } from 'date-fns';

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
  createPresentation() {
    const pptx = new pptxgen();

    
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
    const firstPhotoData = this.photos[0].filepath;
    const secondPhotoData = this.photos[1].filepath;
    
    slide.addImage({ data: firstPhotoData, x: 0.7, y: 1.3, w: 4, h: 3.5 });
    slide.addImage({ data: secondPhotoData, x: 5, y: 1.3, w: 4.6, h: 3.5 });
    slide.addText(dateString, { x: 0.5, y: 5.1, color: "093C99", bold: true, fontSize: 14 });

    // Add current date to bottom left of slide
    // const currentDate = new Date();
    // const dateString = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
    // slide.addText(dateString, { x: 0.5, y: 3.5, color: "093C99", bold: true, fontSize: 15 });
    
    // Save the presentation
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
