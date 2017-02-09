import {Connector} from "./connector";
import {Message, MessageType, MessageResult} from "../message";
import {Person} from "../person";
import {DataConnection} from "../peer";
import {NgZone} from "@angular/core";
import {Connection} from "../connection";

export class ClientConnector extends Connector {

  private _host: Connection;

  constructor(zone: NgZone, stream: MediaStream, id: string, name: string) {
    super(zone, stream);
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
      this._host.dataConnection.on('data', (message: MessageResult<Person[]>): void => {
          this.onDataCallback(this._host.dataConnection, message);
          switch (message.type) {
            case MessageType.LoadPeople:
              message.data.forEach(p => {
                this.newDataConnection(this.peer.connect(p.key, { label: p.label }));
                if(stream) {
                  this.newMediaConnection(this.peer.call(p.key, stream));
                }
              });
              break;
          }
      });
      let getPeopleMessage: Message = { type: MessageType.GetPeople };
      this._host.dataConnection.send(getPeopleMessage);
    });
    this._host.dataConnection.on('error', e => console.log(e));
  }

  public get host(): Connection {
    return this._host;
  }

  public send(message: Message): void {
    if(!this._host.isBlocked) {
      this._host.dataConnection.send(message);
    }
    super.send(message);
  }
}
