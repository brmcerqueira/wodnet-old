import {PeerService} from "./peer.service";
import {Message, MessageType, MessageResult} from "../message";
import {Connection} from "../connection";
import { createPeerWithId, DataConnection } from "../peer";

export class HostPeerService extends PeerService {

  constructor(id: string) {
    super();
    this.peer = createPeerWithId(id, this.option);
  }

  protected newConnection(connection: DataConnection): void {
    super.newConnection(connection);
    connection.on('data', (message: Message): void => {
      if(message.type == MessageType.GetPeople) {
        let loadPeopleMessage: MessageResult<Connection[]> = {
          type: MessageType.LoadPeople,
          data: this.connections.filter(c => c.peer != connection.peer).map(c => {
              return { id: c.peer, metadata: c.metadata };
            })
        };
        connection.send(loadPeopleMessage);
      }
    });
  }
}
