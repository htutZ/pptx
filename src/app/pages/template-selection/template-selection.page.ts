import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-template-selection',
  templateUrl: './template-selection.page.html',
  styleUrls: ['./template-selection.page.scss'],
})
export class TemplateSelectionPage implements OnInit {

  templates = [
    {images: 2},
    {images: 3},
    {images: 4}
  ];

  constructor(private router: Router, private templateService: TemplateService) { }

  ngOnInit() {
  }

  selectTemplate(template: number) {
    let templateType = '';
    switch (template) {
      case 1:
        templateType = 'template1';
        this.router.navigateByUrl('/template1');
        break;
      case 2:
        templateType = 'template2';
        this.router.navigateByUrl('/template2');
        break;
      case 3:
        templateType = 'template3';
        this.router.navigateByUrl('/template3');
        break;
    }
    this.templateService.selectTemplate(template, templateType);
  }

  

}

