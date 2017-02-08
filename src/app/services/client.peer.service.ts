import {PeerService} from "./peer.service";
import {Message, MessageType, MessageResult} from "../message";
import {Person} from "../person";
import {Connection} from "../connection";
import {Peer, DataConnection, createPeer} from "../peer";

export class ClientPeerService extends PeerService {

  private host: DataConnection;

  constructor(id: string, name: string) {
    super();
    this.peer = createPeer(this.option);
    let person: Person = { name: name };
    this.host = this.peer.connect(id, { metadata: person });
    this.host.on('open', () => {
      this.host.on('data', (message: MessageResult<Connection[]>): void => {
          if(message.type == MessageType.LoadPeople) {
            message.data.map((p) => this.peer.connect(p.id, p.metadata)).forEach((c) => this.newConnection(c));
          }
      });
      let getPeopleMessage: Message = { type: MessageType.GetPeople };
      this.host.send(getPeopleMessage);
    });
  }

  public send(message: Message): void {
    super.send(message);
    this.host.send(message);
  }
}
