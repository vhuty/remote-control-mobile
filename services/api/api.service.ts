import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';

import { env } from '@app/env';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _connection: WebSocket;

  constructor(private _controller: Device) {}

  /**
   * Registers new controller into database
   */
  async register() {
    const { uuid, model } = this._controller;

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

  async sync() {
    const { uuid } = this._controller;

    /* Set access token to cookie */
    const res = await fetch(`${env.apiUrlHttp}/controller/sync/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        id: uuid,
      }),
    });

    try {
      if (!res.ok) {
        const data = await res.json();

        const { message } = data;

        return {
          error: {
            message,
          },
        };
      }

      if (this._connection) {
        /* Update connection credentials */
        this._connection.close(4001);
      }

      this._connection = new WebSocket(`${env.apiUrlWs}/`);

      return {};
    } catch (err) {
      console.error(err);
    }
  }
  
  /**
   *
   * @param key Device key to bind
   */
  async bind(key: String) {
    const { uuid } = this._controller;

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
    const { uuid } = this._controller;

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

  async getDevices() {
    const { uuid } = this._controller;

    const res = await fetch(`${env.apiUrlHttp}/controller/${uuid}/devices/`, {
      method: 'GET',
      mode: 'cors',
    });

    return res.json();
  }

  public get connection(): WebSocket {
    return this._connection;
  }

  public get controller() {
    return this._controller;
  }
}
