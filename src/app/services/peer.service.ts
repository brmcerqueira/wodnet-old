import {Subject} from "rxjs";
import {Message} from "../message";
import {Person} from "../person";
import Peer = PeerJs.Peer;
import PeerJSOption = PeerJs.PeerJSOption;
import DataConnection = PeerJs.DataConnection;

export abstract class PeerService {
  private _peer: Peer;
  private _option: PeerJSOption;
  private _messagesSubject: Subject<Message>;
  private _people: Person[];

  constructor() {
    this._option = { key: 'm9jf0d77w8p30udi' };
    this._messagesSubject = new Subject();
    this._people = [];
  }

  protected get option(): PeerJSOption {
    return this._option;
  }

  public get messagesSubject(): Subject<Message> {
    return this._messagesSubject;
  }

  public get people(): Person[] {
    return this._people;
  }

  protected get peer(): Peer {
    return this._peer;
  }

  protected set peer(value: Peer) {
    this._peer = value;
    this._peer.on('connection', (connection: DataConnection): void => this.newConnection(connection));
  }

  protected newConnection(connection: DataConnection): void {
    let person = {id: connection.peer, isBlocked: false, connection: connection};
    this.people.push(person);
    connection.on('close', (): void => {
      this.people.splice(this.people.indexOf(person), 1);
    });
  }

  public send(message: Message): void {
    this.messagesSubject.next(message);
    this._people.forEach((p) => {
      if(!p.isBlocked) {
        p.connection.send(message);
      }
    });
  }
}
