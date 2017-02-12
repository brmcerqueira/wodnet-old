import {Connector} from "./connector";
import {Message, MessageType, MessageResult} from "../message";
import { DataConnection } from "../peer";
import {NgZone} from "@angular/core";
import {SetupData} from "../setup.data";

export class HostConnector extends Connector {

  constructor(zone: NgZone, stream: MediaStream, id: string) {
    super(zone, stream);
    this.createPeer(id);
  }

  protected onDataCallback(connection: DataConnection, message: Message): void {
    super.onDataCallback(connection, message);
    switch (message.type) {
      case MessageType.GetSetupData:
        let loadPeopleMessage: MessageResult<SetupData> = {
          type: MessageType.LoadSetupData,
          data: { character: null, people:[] }
        };

        for (let key in this.connections) {
          if(key != connection.peer) {
            let item = this.connections[key];
            loadPeopleMessage.data.people.push({ key: key, label: item.label });
          }
        }

        connection.send(loadPeopleMessage);
        break;
    }
  }
}
