// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-template-selection',
//   templateUrl: './template-selection.page.html',
//   styleUrls: ['./template-selection.page.scss'],
// })
// export class TemplateSelectionPage implements OnInit {

//   constructor(private router: Router) { }

//   ngOnInit() {
//   }

//   selectTemplate1(template1: string) {
//     localStorage.setItem('templatePath', template1);
//     this.router.navigateByUrl('/template1');
//   }

//   selectTemplate2(template2: string) {
//     localStorage.setItem('templatePath', template2);
//     this.router.navigateByUrl('/image-upload');
//   }

//   selectTemplate3(template3: string) {
//     localStorage.setItem('templatePath', template3);
//     this.router.navigateByUrl('/image-upload');
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-selection',
  templateUrl: './template-selection.page.html',
  styleUrls: ['./template-selection.page.scss'],
})
export class TemplateSelectionPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  selectTemplate(template: number) {
    switch (template) {
      case 1:
        this.router.navigateByUrl('/template1');
        break;
      case 2:
        this.router.navigateByUrl('/template2');
        break;
      case 3:
        this.router.navigateByUrl('/template3');
        break;
    }
  }

}

