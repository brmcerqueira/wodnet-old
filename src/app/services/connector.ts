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
    this._option = { host: window.location.host, port: 8080, path: '/peerjs' };
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
    this._peer.on('connection', connection => this.newDataConnection(connection));
    this._peer.on('call', connection => {
      this.newMediaConnection(connection);
      if(this.stream) {
        connection.answer(this.stream);
      }
      else {
        connection.answer();
      }
    });
    this._peer.on('error', e => console.log(e));
  }

  protected newDataConnection(connection: DataConnection): void {
    this.addConnection(connection, false);
    connection.on('close', (): void => {
      this.deleteConnection(connection.peer, false);
    });
    connection.on('data', (message: Message): void => {
      this.onDataCallback(connection, message);
    });
    connection.on('error', e => console.log(e));
  }

  protected newMediaConnection(connection: MediaConnection): void {
    this.addConnection(connection, true);
    connection.on('close', (): void => {
      this.deleteConnection(connection.peer, true);
    });
    this.connectionCaptureStream(this._connections[connection.peer]);
  }

  protected connectionCaptureStream(connection: Connection): void {
    connection.mediaConnection.on('stream', (stream: any) => {
      let audio = new Audio();
      audio.src = URL.createObjectURL(stream);
      audio.load();
      audio.play();
      this.zone.run(() => connection.audio = audio);
    });
    connection.mediaConnection.on('error', e => console.log(e));
  }

  private addConnection(connection: DataConnection | MediaConnection, isMedia: boolean): void {
    this.zone.run(() => {
      let item = this._connections[connection.peer];

      if(!item) {
        item = { label: connection.peer, isBlocked: false, dataConnection: null, mediaConnection: null, audio: null };
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
          item.audio = null;
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
      case MessageType.Chat:
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
