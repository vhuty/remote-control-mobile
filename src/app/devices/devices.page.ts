import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ControllerService } from '@app/services/controller';

import { DeviceActComponent } from './device-act/device-act.component';
import { ToastService } from '@app/services';

@Component({
  templateUrl: 'devices.page.html',
  styleUrls: ['devices.page.scss'],
})
export class Devices {
  private devices = [];

  constructor(
    private controller: ControllerService,
    private modalController: ModalController,
    private toast: ToastService
  ) {}

  async ionViewWillEnter() {
    try {
      const devices = await this.controller.getDevices();
      this.devices = devices;
    } catch (err) {
      console.error(err);
    }
  }

  async forgetDevice(device) {
    const { key } = device;

    try {
      await this.controller.unbind(key);

      this.devices = await this.controller.getDevices();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Connects to the selected device
   * @param device A device entity
   */
  async activateDevice(device) {
    const { id } = device;

    try {
      const connection = this.controller.connect(id);

      const modal = await this.modalController.create({
        component: DeviceActComponent,
        componentProps: {
          device,
          connection,
        },
      });

      connection.onopen = _ => {
        modal.present();
      };

      connection.onclose = async event => {
        const { code, reason } = event;

        switch (code) {
          case 4004: {
            //TODO: not found device logic

            this.toast.present(reason);

            break;
          }

          default: {
            await modal.dismiss();

            this.toast.present(reason);

            break;
          }
        }
      };

      connection.onerror = _ => {
        modal.dismiss();
      };

      await modal.onWillDismiss();

      connection.close();
    } catch (err) {
      console.error(err);
    }
  }
}
