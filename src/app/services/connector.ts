import {Subject} from "rxjs";
import {Message, MessageType, MessageResult} from "../dtos/message";
import {Peer, PeerJSOption, DataConnection, MediaConnection} from "../peer";
import {NgZone} from "@angular/core";
import {Connection} from "../dtos/connection";
import {environment} from "../../environments/environment";
import {Roll} from "../dtos/roll";

export abstract class Connector {
  private _peer: Peer;
  private _option: PeerJSOption;
  private _textMessageSubject: Subject<MessageResult<string>>;
  private _rollMessageSubject: Subject<MessageResult<Roll>>;
  private _connections: { [key: string]: Connection };

  constructor(private zone: NgZone, private stream: MediaStream) {
    this._option = { host: window.location.hostname, path: "/api", port: environment.port };
    this._textMessageSubject = new Subject();
    this._rollMessageSubject = new Subject();
    this._connections = {};
  }

  public get textMessageSubject(): Subject<MessageResult<string>> {
    return this._textMessageSubject;
  }

  public get rollMessageSubject(): Subject<MessageResult<Roll>> {
    return this._rollMessageSubject;
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

  protected newDataConnection(connection: DataConnection, label?: string): void {
    this.addConnection(connection, false, label ? label : connection.label);
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

  private addConnection(connection: DataConnection | MediaConnection, isMedia: boolean, label?: string): void {
    this.zone.run(() => {
      let item = this._connections[connection.peer];

      if(!item) {
        item = { label: label ? label : connection.peer, isBlocked: false, dataConnection: null,
          mediaConnection: null, audio: null };
        this._connections[connection.peer] = item;
      }

      if (isMedia) {
        item.mediaConnection = <MediaConnection>connection;
      }
      else {
        item.dataConnection = <DataConnection>connection;
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
      case MessageType.Text:
        this.zone.run(() => this._textMessageSubject.next(<MessageResult<string>>message));
        break;
      case MessageType.Roll:
        this.zone.run(() => this._rollMessageSubject.next(<MessageResult<Roll>>message));
        break;
    }
  }

  protected send(message: Message): void {
    for (let key in this._connections) {
      let connection = this._connections[key];
      if(!connection.isBlocked) {
        connection.dataConnection.send(message);
      }
    }
  }

  public sendText(text: string): void {
    let message = { type: MessageType.Text, data: text };
    this._textMessageSubject.next(message);
    this.send(message);
  }

  public sendRoll(roll: Roll): void {
    let message = { type: MessageType.Roll, data: roll };
    this._rollMessageSubject.next(message);
    this.send(message);
  }
}
