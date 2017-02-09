import {Connector} from "./connector";
import {Message, MessageType, MessageResult} from "../message";
import { DataConnection } from "../peer";
import {NgZone} from "@angular/core";
import {Person} from "../person";

export class HostConnector extends Connector {

  constructor(zone: NgZone, stream: MediaStream, id: string) {
    super(zone, stream);
    this.createPeer(id);
  }

  protected onDataCallback(connection: DataConnection, message: Message): void {
    super.onDataCallback(connection, message);
    switch (message.type) {
      case MessageType.GetPeople:
        let loadPeopleMessage: MessageResult<Person[]> = {
          type: MessageType.LoadPeople,
          data: []
        };

        for (let key in this.connections) {
          if(key != connection.peer) {
            let item = this.connections[key];
            loadPeopleMessage.data.push({ key: key, label: item.label });
          }
        }

        connection.send(loadPeopleMessage);
        break;
    }
  }
}
