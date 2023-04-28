import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
    if (Capacitor.isPluginAvailable('SplashScreen')) {
      await SplashScreen.hide();
    }
  }
}