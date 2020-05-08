import { Component, OnInit } from '@angular/core';
import { ModalController, Events, LoadingController } from '@ionic/angular';

import { ApiService } from '@app/services/api';

import { DeviceActComponent } from './device-act/device-act.component';
import { ToastService } from '@app/services';

@Component({
  templateUrl: 'devices.page.html',
  styleUrls: ['devices.page.scss'],
})
export class Devices implements OnInit {
  private devices = [];

  constructor(
    private api: ApiService,
    private modalController: ModalController,
    public loadingController: LoadingController,
    private toast: ToastService,
    private events: Events
  ) {}

  async ngOnInit() {
    await this.api.sync();

    this.api.connection.addEventListener('message', async (event) => {
      const message = JSON.parse(event.data);
      const { source, data, status, signal } = message;

      const device = this.devices.find(({ id }) => id === source);

      if(device) {
        if (status) {
          this.toast.present(`${device.name} is ${status}`);
          this.events.publish('device:status', source, status);
          
          this.devices = await this.api.getDevices();
        }

        if (signal) {
          this.events.publish('device:signal', source, signal);
        }

        if (data) {
          this.toast.present(`${device.name}: ${data}`);
        }
      }
    });
  }

  async ionViewWillEnter() {
    try {
      const devices = await this.api.getDevices();
      this.devices = devices;
    } catch (err) {
      console.error(err);
    }
  }

  async forgetDevice(device) {
    const { key } = device;

    try {
      await this.api.unbind(key);

      this.devices = await this.api.getDevices();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Connects to the selected device
   * @param device A device entity
   */
  async activateDevice(device) {
    const { connection, controller } = this.api;

    try {
      const loading = await this.loadingController.create({
        message: 'Establishing connection...'
      });

      loading.present();

      const modal = await this.modalController.create({
        component: DeviceActComponent,
        componentProps: {
          device,
          controller,
          connection,
          loading,
        },
      });

      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
      });

      peer.on('signal', signal => {
        const data = JSON.stringify({
          source: controller.uuid,
          target: device.id,
          signal,
        });

        connection.send(data);
      });

      this.events.subscribe('device:signal', (source, signal) => {
        if (source === device.id) {
          peer.signal(signal);
        }
      });

      this.events.subscribe('device:status', (source, status) => {
        if (source === device.id && status === 'offline') {
          modal.dismiss();
        }
      });

      peer.on('stream', async stream => {
        modal.componentProps.stream = stream;

        await modal.present();
        device.status = 'waiting';

        await modal.onWillDismiss();
        peer.destroy();
      });
    } catch (err) {
      console.error(err);
    }
  }
}
