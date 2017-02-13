import {Connector} from "./connector";
import {Message, MessageType, MessageResult} from "../dtos/message";
import { DataConnection } from "../peer";
import {NgZone} from "@angular/core";
import {SetupData} from "../dtos/setup.data";
import {Connection} from "../dtos/connection";

export class HostConnector extends Connector {

  constructor(zone: NgZone, stream: MediaStream, id: string) {
    super(zone, stream);
    this.createPeer(id);
  }

  protected onDataCallback(connection: DataConnection, message: Message): void {
    super.onDataCallback(connection, message);
    switch (message.type) {
      case MessageType.GetSetupData:
        let loadSetupDataMessage: MessageResult<SetupData> = {
          type: MessageType.LoadSetupData,
          data: { character: null, people:[] }
        };

        for (let key in this.connections) {
          if(key != connection.peer) {
            let item = this.connections[key];
            loadSetupDataMessage.data.character = item.character;
            loadSetupDataMessage.data.people.push({ key: key, label: item.label });
          }
        }

        connection.send(loadSetupDataMessage);
        break;
    }
  }

  public sendCharacter(character: any): void {
    let message = { type: MessageType.Character, data: character };
    this.send(message);
  }
}
