import {Subject} from "rxjs";
import {Message, MessageType} from "../message";
import {Peer, PeerJSOption, DataConnection, MediaConnection} from "../peer";
import {NgZone} from "@angular/core";
import {Connection} from "../connection";

export abstract class Connector {
  private _peer: Peer;
  private _option: PeerJSOption;
  private _messagesSubject: Subject<Message>;
  private _connections: { [key: string]: Connection };

  constructor(private zone: NgZone, private stream: MediaStream) {
    this._option =
      //{ key: 'm9jf0d77w8p30udi' };
      { host: 'localhost', port: 9000 };
    this._messagesSubject = new Subject();
    this._connections = {};
  }

  public get messagesSubject(): Subject<Message> {
    return this._messagesSubject;
  }

  public get connections(): { [key: string]: Connection } {
    return this._connections;
  }

  protected get peer(): Peer {
    return this._peer;
  }

  protected createPeer(id?: string): void {
    let peerConstructor = window['Peer'];
    this._peer = id ? new peerConstructor(id, this._option) : new peerConstructor(this._option);
    this._peer.on('connection', (connection: DataConnection): void => this.newConnection(connection));
    if(this.stream) {
      this._peer.on('call', c => c.answer(this.stream));
    }
    this._peer.on('error', e => console.log(e));
  }

  protected newConnection(connection: DataConnection): void {
    this.addConnection(connection, false);
    connection.on('close', (): void => {
      this.deleteConnection(connection.peer, false);
    });
    connection.on('data', (message: Message): void => {
      this.onDataCallback(connection, message);
    });
    connection.on('error', e => console.log(e));
  }

  protected newConnection2(mediaConnection: MediaConnection): void {
    mediaConnection.on('error', e => console.log(e));
  }

  private addConnection(connection: DataConnection | MediaConnection, isMedia: boolean): void {
    this.zone.run(() => {
      let item = this._connections[connection.peer];

      if(!item) {
        item = { label: connection.peer, isBlocked: false, dataConnection: null, mediaConnection: null };
        this._connections[connection.peer] = item;
      }

      if (isMedia) {
        item.mediaConnection = <MediaConnection>connection;
      }
      else {
        item.dataConnection = <DataConnection>connection;
        item.label = item.dataConnection.label;
      }
    });
  }

  private deleteConnection(peer: string, isMedia: boolean): void {
    this.zone.run(() => {
      let item = this._connections[peer];

      if(item) {
        if (isMedia) {
          item.mediaConnection = null;
        }
        else {
          item.dataConnection = null;
        }

        if(item.dataConnection == null && item.mediaConnection == null) {
          delete this._connections[peer];
        }
      }
    });
  }

  protected onDataCallback(connection: DataConnection, message: Message): void {
    switch (message.type) {
      case MessageType.Text:
        this.zone.run(() => this.messagesSubject.next(message));
        break;
    }
  }

  public send(message: Message): void {
    this.messagesSubject.next(message);
    for (let key in this._connections) {
      let connection = this._connections[key];
      if(!connection.isBlocked) {
        connection.dataConnection.send(message);
      }
    }
  }
}
