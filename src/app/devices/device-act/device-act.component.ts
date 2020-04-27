import { Component, Input } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { ToastService } from '@app/services';

@Component({
  selector: 'app-device-act',
  templateUrl: './device-act.component.html',
  styleUrls: ['./device-act.component.scss'],
})
export class DeviceActComponent {
  @Input() device;
  @Input() connection: WebSocket;

  constructor(
    private speechRecognition: SpeechRecognition,
    private toast: ToastService
  ) {}

  async ionViewWillEnter() {
    this.connection.onmessage = event => {
      const { payload } = JSON.parse(event.data);

      this.toast.present(`${this.device.name}: ${payload}`);
    };
  }

  async startListening() {
    const isAvailable = await this.speechRecognition.isRecognitionAvailable();
    if (!isAvailable) {
      this.toast.present('Unfortunately, device does not support this feature');

      return;
    }

    const hasPermission = await this.speechRecognition.hasPermission();
    if (!hasPermission) {
      await this.speechRecognition.requestPermission();
    }

    this.speechRecognition.startListening().subscribe({
      next: ([message]) => {
        this.connection.send(JSON.stringify({ message }));
      },
      error: err => {
        console.error(err);
      },
    });
  }
}
