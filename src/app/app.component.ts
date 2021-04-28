import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  options: InAppBrowserOptions = {
    location: 'no',//Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'no',//Android only ,shows browser zoom controls
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'no', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'yes',//iOS only
    presentationstyle: 'pagesheet',//iOS only
    fullscreen: 'yes'//Windows only
  };

  constructor(private iab : InAppBrowser,private toastController: ToastController, private platform: Platform, private diagnostic: Diagnostic, private loadingController: LoadingController) {
    platform.ready().then(() => {
    })
  }

  ngOnInit() {
  setTimeout(() => {
    this.diagnostic.getPermissionAuthorizationStatus(this.diagnostic.permission.ACCESS_FINE_LOCATION)
    .then((status) => {
      switch (status) {
        case this.diagnostic.permissionStatus.GRANTED:
          this.launchUrl()
          break;
        case this.diagnostic.permissionStatus.NOT_REQUESTED:
          this.requestPermission()
          break;
        case this.diagnostic.permissionStatus.DENIED_ONCE:
          this.requestPermission()
          break;
        case this.diagnostic.permissionStatus.DENIED_ALWAYS:
          this.requestPermission()
          break;
      }
    })
    .catch((error) => {
      console.error("The following error occurred: " + error);
    });
  }, 3000);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Welcome to Orgo Nova',
      duration: 2000
    });
    await loading.present();
    await loading.onDidDismiss();
  }

  launchUrl() {
    const iab = this.iab.create('https://organovabio.com/test/', '_blank', this.options);
    iab.on('exit').subscribe((event: InAppBrowserEvent) => {
      navigator['app'].exitApp()
    });
  }

  requestPermission() {
    this.diagnostic.requestRuntimePermission(this.diagnostic.permission.ACCESS_FINE_LOCATION)
      .then((status) => {
        switch (status) {
          case this.diagnostic.permissionStatus.GRANTED:
            this.launchUrl()
            break;
          case this.diagnostic.permissionStatus.NOT_REQUESTED:
            break;
          case this.diagnostic.permissionStatus.DENIED_ONCE:
            navigator['app'].exitApp()
            break;
          case this.diagnostic.permissionStatus.DENIED_ALWAYS:
            navigator['app'].exitApp()
            break;
        }
      })
      .catch((error) => {
        console.error("The following error occurred: " + error);
      });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
