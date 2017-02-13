import {NgZone, Injectable} from "@angular/core";
import {HostConnector} from "./host.connector";
import {ClientConnector} from "./client.connector";
import {Observable, Subscriber, Subject} from "rxjs";
import {Connector} from "./connector";

@Injectable()
export class ConnectorService {

  private _isHost: boolean;
  private _connector: Connector;
  private _connectorSubject: Subject<Connector>;

  constructor(private zone: NgZone) {
    this._isHost = false;
    this._connector = null;
    this._connectorSubject = new Subject();
  }

  private createConnector(createCallback: (stream: MediaStream) => Connector): void {
    let connectorCallback = m => {
      this.zone.run(() => {
        this._connector = createCallback(m);
        this._connectorSubject.next();
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
    this.createConnector(m => new ClientConnector(this.zone, m, id, name));
  }

  public startHost(id: string): void {
    this.createConnector(m => {
      this._isHost = true;
      return new HostConnector(this.zone, m, id);
    });
  }

  public get isConnected(): boolean {
    return this.connector != null;
  }

  public get isHost(): boolean {
    return this._isHost;
  }

  public get connector(): Connector {
    return this._connector;
  }

  public get connectorSubject(): Subject<Connector> {
    return this._connectorSubject;
  }
}
