import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';

import { env } from '@app/env';

@Injectable({
  providedIn: 'root',
})
export class ControllerService {
  constructor(private device: Device) {}

  /**
   * Registers new controller into database
   */
  async register() {
    const { uuid, model } = this.device;

    await fetch(`${env.apiUrlHttp}/controller/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify({
        id: uuid,
        data: {
          meta: {
            name: model,
          },
        },
      }),
    });
  }

  /**
   *
   * @param key Device key to bind
   */
  async bind(key: String) {
    const { uuid } = this.device;

    const res = await fetch(`${env.apiUrlHttp}/controller/bind/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        id: uuid,
        key,
      }),
    });

    try {
      const data = await res.json();
      if (!res.ok) {
        const { message } = data;

        return {
          error: {
            message,
          },
        };
      }

      return data;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   *
   * @param key Device key to unbind
   */
  async unbind(key: String) {
    const { uuid } = this.device;

    const res = await fetch(`${env.apiUrlHttp}/controller/bind/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({ id: uuid, key }),
    });

    const data = await res.json();

    return data;
  }

  connect(id: String) {
    const ws = new WebSocket(`${env.apiUrlWs}/${id}/`);

    return ws;
  }

  async getDevices() {
    const { uuid } = this.device;

    const res = await fetch(`${env.apiUrlHttp}/controller/${uuid}/devices/`, {
      method: 'GET',
      mode: 'cors',
    });

    const { data } = await res.json();

    return data;
  }
}
