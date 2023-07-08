import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  "appId": "io.ionic.starter",
  "appName": "pptx",
  "webDir": "www",
  "bundledWebRuntime": true,
  "plugins": {
    "FileWriter": {
      "package": "file-writer",
      "version": "0.0.1"
    },
    "CapacitorSQLite": {
      "iosDatabaseLocation": "Library/CapacitorDatabase",
      "iosIsEncryption": false,
      "iosKeychainPrefix": "cap",
      "iosBiometric": {
        "biometricAuth": false,
        "biometricTitle" : "Biometric login for capacitor sqlite"
      },
      Keyboard: {
        resize: 'native',
      },
      "androidIsEncryption": false,
      "androidBiometric": {
        "biometricAuth" : false,
        "biometricTitle" : "Biometric login for capacitor sqlite",
        "biometricSubTitle" : "Log in using your biometric"
      },
      "electronWindowsLocation": "C:\\ProgramData\\CapacitorDatabases",
      "electronMacLocation": "YOUR_VOLUME/CapacitorDatabases",
      "electronLinuxLocation": "Databases"
    }
  }
}

export default config;
