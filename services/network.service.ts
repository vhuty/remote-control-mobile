import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { AlertController } from '@ionic/angular';
import { ToastService } from './ui/toast.service';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private state: NetworkStatus;
  private alert: HTMLIonAlertElement;

  constructor(
    private network: Network,
    private alertController: AlertController,
    private toast: ToastService,
    private nativeSettings: OpenNativeSettings,
  ) {}

  async listen() {
    if(this.network.type === this.network.Connection.NONE) {
      this.networkFailureAlert();
    }

    this.network.onConnect().subscribe(async () => {
      if(this.state !== NetworkStatus.ONLINE) {
        this.state = NetworkStatus.ONLINE;

        this.alert.dismiss();
        this.toast.present('Connection resumed');
      }
    });

    this.network.onDisconnect().subscribe(async () => {
      this.state = NetworkStatus.OFFLINE;

      this.networkFailureAlert();
    });
  }

  private async networkFailureAlert() {
    this.alert = await this.alertController.create({
      header: 'Network',
      message: `It seems that something's wrong with connection`,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Settings',
          handler: () => {
            this.nativeSettings.open('wifi');
          },
        },
      ],
    });

    return this.alert.present();
  }
}

enum NetworkStatus {
  ONLINE,
  OFFLINE,
};