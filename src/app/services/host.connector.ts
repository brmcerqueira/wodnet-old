import {Connector} from "./connector";
import {Message, MessageType, MessageResult} from "../dtos/message";
import { DataConnection } from "../peer";
import {NgZone} from "@angular/core";
import {SetupData} from "../dtos/setup.data";
import {ChronicleService} from "./chronicle.service";

export class HostConnector extends Connector {

  constructor(private chronicleService: ChronicleService, zone: NgZone, stream: MediaStream, id: string) {
    super(zone, stream);
    this.createPeer(id);
  }

  protected onDataCallback(connection: DataConnection, message: Message): void {
    super.onDataCallback(connection, message);
    switch (message.type) {
      case MessageType.GetSetupData:
        let loadSetupDataMessage: MessageResult<SetupData> = {
          type: MessageType.LoadSetupData,
          data: { character: null, people: {} }
        };

        for (let key in this.connections) {
          let item = this.connections[key];
          if(key == connection.peer) {
            let character = this.chronicleService.characters[item.dataConnection.metadata.fingerprint];
            if (character) {
              loadSetupDataMessage.data.character = character;
            }
          }
          else {
            loadSetupDataMessage.data.people[key] = item.label;
          }
        }

        connection.send(loadSetupDataMessage);
        break;
    }
  }
}
