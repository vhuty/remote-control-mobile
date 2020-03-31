import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToastService } from '@app/services';
import { ControllerService } from '@app/services/controller';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
    templateUrl: 'binding.page.html',
    styleUrls: ['binding.page.scss']
})
export class Binding {

    constructor(
        private controller: ControllerService,
        private scanner: BarcodeScanner,
        private router: Router,
        private toast: ToastService
    ) { }

    async bindController(key) {
        try {
            const result = await this.controller.bind(key);

            return result;
        } catch (err) {
            console.error(err);
        }
    }

    async scanCode() {
        const result = await this.scanner.scan({
            disableSuccessBeep: true,
            resultDisplayDuration: 0
        });

        const { cancelled, text } = result;
        if(!cancelled) {
            const { device, error } = await this.bindController(text);
            if(error) {
                const { message } = error;
                this.toast.present(message);

                return;
            }

            await this.router.navigate(['tabs', 'devices']);
            this.toast.present(`Added: ${ device.name }`);
        }
    }
}
