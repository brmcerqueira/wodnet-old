import {PeerService} from "./peer.service";
import Peer = PeerJs.Peer;
import PeerJSOption = PeerJs.PeerJSOption;
import DataConnection = PeerJs.DataConnection;
import {Message, MessageType, MessageResult} from "../message";

export class ClientPeerService extends PeerService {

  private host: DataConnection;

  constructor(id: string) {
    super();
    this.peer = new Peer(this.option);
    this.host = this.peer.connect(id);
    this.host.on('open', () => {
      this.host.on('data', (message: MessageResult<string[]>): void => {
          if(message.type == MessageType.LoadPeople) {
            message.data.map((p) => this.peer.connect(p)).forEach((c) => this.newConnection(c));
          }
      });
      let getPeopleMessage: Message = { type: MessageType.GetPeople };
      this.host.send(getPeopleMessage);
    });
  }
}
