import { Injectable } from '@angular/core'
import { Network } from '@ionic-native/network/ngx';
import { AlertController } from '@ionic/angular';
import { ToastService } from './ui/toast.service';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {
    constructor(
        private network: Network,
        private alertController: AlertController,
        private toast: ToastService
    ) {}

    async listen() {
        const alert = await this.alertController.create({
            header: 'Network',
            message: `It seems that something's wrong with connection`,
            backdropDismiss: false,
            buttons: [
                {
                    text: 'Settings',
                    handler: () => {
                        //TODO: open native settings
                        // alert.remove();
                    }
                }, {
                    text: 'Exit',
                    handler: () => {
                        console.log('EXIT');
                        
                        navigator['app'].exitApp();
                    }
                }
            ]
        });

        this.network.onConnect().subscribe(() => {
            this.toast.present('Connection resumed')
        });

        this.network.onDisconnect().subscribe(() => {
            alert.present();
        });
    }
}