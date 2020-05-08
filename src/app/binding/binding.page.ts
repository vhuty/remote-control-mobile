import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToastService } from '@app/services';
import { ApiService } from '@app/services/api';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  templateUrl: 'binding.page.html',
  styleUrls: ['binding.page.scss'],
})
export class Binding {
  constructor(
    private api: ApiService,
    private scanner: BarcodeScanner,
    private router: Router,
    private toast: ToastService
  ) {}

  async bindController(key) {
    try {
      const { device, error } = await this.api.bind(key);

      if (error) {
        const { message } = error;
        this.toast.present(message);

        return;
      }

      await this.api.sync();

      await this.router.navigate(['tabs', 'devices']);
      this.toast.present(`Added: ${device.name}`);
    } catch (err) {
      console.error(err);
    }
  }

  async scanCode() {
    const result = await this.scanner.scan({
      disableSuccessBeep: true,
      resultDisplayDuration: 0,
    });

    const { cancelled, text } = result;
    if (!cancelled) {
      this.bindController(text);
    }
  }
}
