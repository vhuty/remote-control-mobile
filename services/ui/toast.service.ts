import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    constructor(
        private toastController: ToastController
    ) {}

    async present(message) {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            position: 'bottom'
        });
        
        toast.present();
    }
}