import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  
  public selectedTemplate: number | null = null;
  public templateType: string | null = null;

  constructor() { }

  selectTemplate(template: number, templateType: string) {
    this.selectedTemplate = template;
    this.templateType = templateType;
  }
}
