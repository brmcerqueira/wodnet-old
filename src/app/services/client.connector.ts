import {Connector} from "./connector";
import {Message, MessageType, MessageResult} from "../dtos/message";
import {Person} from "../dtos/person";
import {DataConnection} from "../peer";
import {NgZone} from "@angular/core";
import {Connection} from "../connection";
import {Subject} from "rxjs";
import {SetupData} from "../dtos/setup.data";

export class ClientConnector extends Connector {

  private _host: Connection;
  private _characterSubject: Subject<any>;

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
      this._host.dataConnection.on('data', (message: MessageResult<SetupData>): void => {
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

  protected send(message: Message): void {
    super.send(message);
    if(!this._host.isBlocked) {
      this._host.dataConnection.send(message);
    }
  }
}
