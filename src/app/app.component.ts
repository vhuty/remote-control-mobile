import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { NetworkService } from '@app/services';
import { ControllerService } from '@app/services/controller';

const PREFERENCES_KEY = 'first_run';

@Component({
	selector: 'app-root',
  	templateUrl: 'app.component.html',
  	styleUrls: ['app.component.scss']
})
export class AppComponent {
  	constructor(
		private platform: Platform,
    	private splashScreen: SplashScreen,
		private statusBar: StatusBar,
		private storage: NativeStorage,
		private controller: ControllerService,
		private net: NetworkService
  	) {
    	this.initializeApp();
  	}

  	async initializeApp() {
    	try {
			await this.platform.ready();

			this.net.listen();
			this.statusBar.styleDefault();
			this.splashScreen.hide();

			const keys = await this.storage.keys();
			if(!keys.includes(PREFERENCES_KEY)) {
				await this.controller.register();

				await this.storage.setItem(PREFERENCES_KEY, {
					registered: true
				});
			}
		} catch (err) {
			console.error(err);
		}
	}
}
