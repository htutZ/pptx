import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { File } from '@ionic-native/file/ngx';
import { SQLiteService } from './services/sqlite.service';
import { Device } from '@ionic-native/device/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, AndroidPermissions, File, Device, SQLiteService],
  bootstrap: [AppComponent],
})
export class AppModule {}
