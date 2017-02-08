import {NgZone, Injectable} from "@angular/core";
import {HostConnector} from "./host.connector";
import {ClientConnector} from "./client.connector";
import {Subject} from "rxjs";

@Injectable()
export class ConnectorService {

  private getUserMedia: NavigatorGetUserMedia;

  constructor(private zone: NgZone) {
    this.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  }

  private createConnector<T>(createCallback: (stream: MediaStream) => T): Subject<T> {
    let result = new Subject<T>();
    let errorCallback = e => {
      console.log(e);
      result.next(createCallback(null));
    };
    try {
      this.getUserMedia({video: false, audio: true},
        e => result.next(createCallback(e)),
        errorCallback);
    }
    catch (e) {
      errorCallback(e);
    }
    return result;
  }

  public client(id: string, name: string): Subject<ClientConnector> {
    return this.createConnector(m => new ClientConnector(this.zone, m, id, name));
  }

  public host(id: string): Subject<HostConnector> {
    return this.createConnector(m => new HostConnector(this.zone, m, id));
  }
}
