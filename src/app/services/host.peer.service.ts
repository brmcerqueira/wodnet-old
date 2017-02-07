import {PeerService} from "./peer.service";
import Peer = PeerJs.Peer;
import PeerJSOption = PeerJs.PeerJSOption;
import DataConnection = PeerJs.DataConnection;
import {Message, MessageType, MessageResult} from "../message";

export class HostPeerService extends PeerService {

  constructor(id: string) {
    super();
    this.peer = new Peer(id, this.option);
  }

  protected newConnection(connection: DataConnection): void {
    super.newConnection(connection);
    connection.on('data', (message: Message): void => {
      if(message.type == MessageType.GetPeople) {
        let loadPeopleMessage: MessageResult<string[]> = {
          type: MessageType.LoadPeople,
          data: this.people.filter(p => p.id != connection.peer).map(p => p.id)
        };
        connection.send(loadPeopleMessage);
      }
    });
  }
}
