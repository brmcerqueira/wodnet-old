import {NgZone, Injectable} from "@angular/core";
import {HostConnector} from "./host.connector";
import {ClientConnector} from "./client.connector";
import {Connector} from "./connector";
import {ChronicleService} from "./chronicle.service";
import {Message} from "../dtos/message";

@Injectable()
export class ConnectorService {

  private _messages: Message[];
  private _isHost: boolean;
  private _connector: Connector;

  constructor(private zone: NgZone, private chronicleService: ChronicleService) {
    this._messages = [];
    this._isHost = false;
    this._connector = null;
  }

  private createConnector(createCallback: (stream: MediaStream) => Connector): void {
    let connectorCallback = m => {
      this.zone.run(() => {
        this._connector = createCallback(m);
        this.connector.textMessageSubject.subscribe(m => this._messages.push(m));
        this.connector.rollMessageSubject.subscribe(m => this._messages.push(m));
      });
    };

    let errorCallback = e => {
      console.log(e);
      connectorCallback(null);
    };

    try {
      navigator.getUserMedia({video: false, audio: true}, connectorCallback, errorCallback);
    }
    catch (e) {
      errorCallback(e);
    }
  }

  public startClient(id: string, name: string): void {
    new window['Fingerprint2']().get(r => this.createConnector(m => new ClientConnector(this.zone, m, r, id, name)));
  }

  public startHost(id: string): void {
    this.createConnector(m => {
      this._isHost = true;
      return new HostConnector(this.chronicleService, this.zone, m, id);
    });
  }

  public get isConnected(): boolean {
    return this.connector != null;
  }

  public get messages(): Message[] {
    return this._messages;
  }

  public get isHost(): boolean {
    return this._isHost;
  }

  public get connector(): Connector {
    return this._connector;
  }
}
