import {Subject} from "rxjs";
import {Message, MessageType} from "../message";
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

  public get messagesSubject(): Subject<Message> {
    return this._messagesSubject;
  }

  public get connections(): DataConnection[] {
    return this._connections;
  }

  protected get peer(): Peer {
    return this._peer;
  }

  protected createPeer(id?: string): void {
    let peerConstructor = window['Peer'];
    this._peer = id ? new peerConstructor(id, this._option) : new peerConstructor(this._option);
    this._peer.on('connection', (connection: DataConnection): void => this.newConnection(connection));
    this._peer.on('error', e => console.log(e));
  }

  protected newConnection(connection: DataConnection): void {
    this._connections.push(connection);
    connection.on('close', (): void => {
      this._connections.splice(this._connections.indexOf(connection), 1);
    });
    connection.on('data', (message: Message): void => {
      this.onDataCallback(connection, message);
    });
    connection.on('error', e => console.log(e));
  }

  protected onDataCallback(connection: DataConnection, message: Message): void {
    switch (message.type) {
      case MessageType.Text:
        this.messagesSubject.next(message);
        break;
    }
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
