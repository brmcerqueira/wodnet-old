import {PeerService} from "./peer.service";
import {Message, MessageType, MessageResult} from "../message";
import {Connection} from "../connection";
import { DataConnection } from "../peer";

export class HostPeerService extends PeerService {

  constructor(id: string) {
    super();
    this.createPeer(id);
  }

  protected onDataCallback(connection: DataConnection, message: Message): void {
    super.onDataCallback(connection, message);
    switch (message.type) {
      case MessageType.GetPeople:
        let loadPeopleMessage: MessageResult<Connection[]> = {
          type: MessageType.LoadPeople,
          data: this.connections.filter(c => c.peer != connection.peer).map(c => {
            return { id: c.peer, metadata: c.metadata };
          })
        };
        connection.send(loadPeopleMessage);
        break;
    }
  }
}
