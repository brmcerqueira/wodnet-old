import {Connector} from "./connector";
import {Message, MessageType, MessageResult} from "../message";
import {Person} from "../person";
import {Connection} from "../connection";
import {DataConnection} from "../peer";
import {NgZone} from "@angular/core";

export class ClientConnector extends Connector {

  private host: DataConnection;

  constructor(zone: NgZone, id: string, name: string) {
    super(zone);
    this.createPeer();
    let person: Person = { name: name };
    this.host = this.peer.connect(id, { metadata: person });
    this.host.on('open', () => {
      this.host.on('data', (message: MessageResult<Connection[]>): void => {
          this.onDataCallback(this.host, message);
          switch (message.type) {
            case MessageType.LoadPeople:
              message.data.map((p) => this.peer.connect(p.id, p.metadata)).forEach((c) => this.newConnection(c));
              break;
          }
      });
      let getPeopleMessage: Message = { type: MessageType.GetPeople };
      this.host.send(getPeopleMessage);
    });
    this.host.on('error', e => console.log(e));
  }

  public send(message: Message): void {
    super.send(message);
    this.host.send(message);
  }
}
