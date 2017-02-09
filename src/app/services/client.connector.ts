import {Connector} from "./connector";
import {Message, MessageType, MessageResult} from "../message";
import {Person} from "../person";
import {DataConnection} from "../peer";
import {NgZone} from "@angular/core";

export class ClientConnector extends Connector {

  private host: DataConnection;

  constructor(zone: NgZone, stream: MediaStream, id: string, name: string) {
    super(zone, stream);
    this.createPeer();
    this.host = this.peer.connect(id, { label: name });
    this.host.on('open', () => {
      this.host.on('data', (message: MessageResult<Person[]>): void => {
          this.onDataCallback(this.host, message);
          switch (message.type) {
            case MessageType.LoadPeople:
              message.data.forEach(p => {
                this.newConnection(this.peer.connect(p.key, { label: p.label }));
                if(stream) {
                  //this.peer.call(p.id, stream);
                }
              });
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
