import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { ToastService } from '@app/services';
import { ApiService } from '@app/services/api';
import { ModalController } from '@ionic/angular';

import { COMMANDS_ICONS, DEVICE_ICONS } from '../../../constants';

@Component({
  selector: 'app-device-act',
  templateUrl: './device-act.component.html',
  styleUrls: ['./device-act.component.scss'],
})
export class DeviceActComponent implements OnInit {
  @Input() connection: WebSocket;
  @Input() device: any;
  @Input() controller: any;
  @Input() stream: any;
  @Input() loading: any;
  @ViewChild('player', { static: true }) player: ElementRef;

  private commands = [];

  constructor(
    private speechRecognition: SpeechRecognition,
    private toast: ToastService,
    private api: ApiService,
    private modalCtrl: ModalController,
  ) {}

  async ngOnInit() {
    const player = this.player.nativeElement;
    player.srcObject = this.stream;

    const { error, data } = await this.api.getCommands(this.device.id);
    if (error) {
      console.error(error);

      return;
    }

    this.commands = data;
    this.loading.dismiss();
  }

  async startListening() {
    const isAvailable = await this.speechRecognition.isRecognitionAvailable();
    if (!isAvailable) {
      this.toast.present(
        'Unfortunately, this device does not support this feature'
      );

      return;
    }

    const hasPermission = await this.speechRecognition.hasPermission();
    if (!hasPermission) {
      await this.speechRecognition.requestPermission();
    }

    this.speechRecognition.startListening().subscribe({
      next: ([data]) => {
        const message = JSON.stringify({
          source: this.controller.uuid,
          target: this.device.id,
          data,
        });

        this.connection.send(message);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getCommands(defaults: boolean) {
    if(defaults) {
      return this.commands.filter(cmd => !cmd.deviceId);
    }

    return this.commands.filter(cmd => cmd.deviceId);
  }

  getCommandIcon(code: string) {
    return COMMANDS_ICONS[code];
  }

  getDeviceIcon(platform: string) {
    return DEVICE_ICONS[platform];
  }
}