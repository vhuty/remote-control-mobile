import { Component, OnInit, Input } from '@angular/core';
import { ControllerService } from '@app/services/controller';
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
        private controller: ControllerService,
        private speechRecognition: SpeechRecognition,
        private toast: ToastService
    ) { }

    async ionViewWillEnter() {
        this.connection.onmessage = (event) => {
            const { data } = event;

            this.toast.present(`${ this.device.name } says: ${ data }`);
        }
    }

    async startListening() {
        const isAvailable = await this.speechRecognition.isRecognitionAvailable();
        if(!isAvailable) {
            this.toast.present('Unfortunatly, device does not support this feature');

            return;
        }

        const hasPermission = await this.speechRecognition.hasPermission();
        if(!hasPermission) {
            await this.speechRecognition.requestPermission();
        }

        this.speechRecognition.startListening()
            .subscribe({
                next: (matches) => {
                    this.connection.send(JSON.stringify(matches));
                },
                error: (err) => {
                    console.error(err);
                }
            });
    }
}
