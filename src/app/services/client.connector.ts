import {Connector} from "./connector";
import {Message, MessageType, MessageResult} from "../dtos/message";
import {NgZone} from "@angular/core";
import {Connection} from "../dtos/connection";
import {Character} from "../dtos/character";

export class ClientConnector extends Connector {

  private _host: Connection;
  private _character: Character;

  constructor(zone: NgZone, stream: MediaStream, label: string, fingerprint: string, id: string, origin: string) {
    super(zone, stream, origin);
    this._character = null;
    this.createPeer();
    zone.run(() => {
      this._host = new Connection(label);
      this._host.dataConnection = this.peer.connect(id, { label: origin, metadata: { fingerprint }});
      if (stream) {
        this._host.mediaConnection = this.peer.call(id, stream);
        this.connectionCaptureStream(this._host);
      }
    });
    this._host.dataConnection.on('open', () => {
      this._host.dataConnection.on('data', (message: MessageResult<any>): void => {
          this.onDataCallback(this._host.dataConnection, message);
          switch (message.type) {
            case MessageType.LoadSetupData:
              zone.run(() => this._character = message.data.character);
              for (let key in message.data.people) {
                this.newDataConnection(this.peer.connect(key, { label: origin }), message.data.people[key]);
                if(stream) {
                  this.newMediaConnection(this.peer.call(key, stream));
                }
              }
              break;
            case MessageType.Character:
              zone.run(() => this._character = message.data);
              break;
          }
      });
      let getSetupDataMessage: Message = { type: MessageType.GetSetupData, origin: origin };
      this._host.dataConnection.send(getSetupDataMessage);
    });
    this._host.dataConnection.on('error', e => console.log(e));
  }

  public get host(): Connection {
    return this._host;
  }

  public get character(): Character {
    return this._character;
  }

  protected send(message: Message): void {
    super.send(message);
    if(!this._host.isBlocked) {
      this._host.dataConnection.send(message);
    }
  }
}
