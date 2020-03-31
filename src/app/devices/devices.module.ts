import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Devices } from './devices.page';
import { DeviceActComponent } from './device-act/device-act.component';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{ path: '', component: Devices }])
    ],
    providers: [ SpeechRecognition ],
    declarations: [Devices, DeviceActComponent],
    entryComponents: [DeviceActComponent]
})
export class DevicesModule { }
