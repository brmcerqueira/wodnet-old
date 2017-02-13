import {Connector} from "./connector";
import {Message, MessageType, MessageResult} from "../dtos/message";
import {Person} from "../dtos/person";
import {DataConnection} from "../peer";
import {NgZone} from "@angular/core";
import {Connection} from "../dtos/connection";
import {Subject} from "rxjs";
import {SetupData} from "../dtos/setup.data";
import {Character} from "../dtos/character";

export class ClientConnector extends Connector {

  private _host: Connection;
  private _characterSubject: Subject<Character>;

  constructor(zone: NgZone, stream: MediaStream, id: string, name: string) {
    super(zone, stream);
    this._characterSubject = new Subject();
    this.createPeer();
    zone.run(() => {
      this._host = {label: id, isBlocked: false};
      this._host.dataConnection = this.peer.connect(id, {label: name});
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
              zone.run(() => this._characterSubject.next(message.data.character));
              message.data.people.forEach(p => {
                this.newDataConnection(this.peer.connect(p.key, { label: p.label }));
                if(stream) {
                  this.newMediaConnection(this.peer.call(p.key, stream));
                }
              });
              break;
            case MessageType.Character:
              zone.run(() => this._characterSubject.next(message.data));
              break;
          }
      });
      let getSetupDataMessage: Message = { type: MessageType.GetSetupData };
      this._host.dataConnection.send(getSetupDataMessage);
    });
    this._host.dataConnection.on('error', e => console.log(e));
  }

  public get host(): Connection {
    return this._host;
  }

  public get characterSubject(): Subject<Character> {
    return this._characterSubject;
  }

  protected send(message: Message): void {
    super.send(message);
    if(!this._host.isBlocked) {
      this._host.dataConnection.send(message);
    }
  }
}
