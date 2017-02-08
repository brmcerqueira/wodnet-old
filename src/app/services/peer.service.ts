import {Subject} from "rxjs";
import {Message} from "../message";
import {Person} from "../person";
import {Peer, PeerJSOption, DataConnection} from "../peer";

export abstract class PeerService {
  private _peer: Peer;
  private _option: PeerJSOption;
  private _messagesSubject: Subject<Message>;
  private _connections: DataConnection[];

  constructor() {
    this._option = { key: 'm9jf0d77w8p30udi' };
    this._messagesSubject = new Subject();
    this._connections = [];
  }

  protected get option(): PeerJSOption {
    return this._option;
  }

  public get messagesSubject(): Subject<Message> {
    return this._messagesSubject;
  }

  public get connections(): DataConnection[] {
    return this._connections;
  }

  protected get peer(): Peer {
    return this._peer;
  }

  protected set peer(value: Peer) {
    this._peer = value;
    this._peer.on('connection', (connection: DataConnection): void => this.newConnection(connection));
  }

  protected newConnection(connection: DataConnection): void {
    this._connections.push(connection);
    connection.on('close', (): void => {
      this._connections.splice(this._connections.indexOf(connection), 1);
    });
  }

  public send(message: Message): void {
    this.messagesSubject.next(message);
    this._connections.forEach((c) => {
      if(!(<Person>c.metadata).isBlocked) {
        c.send(message);
      }
    });
  }
}
