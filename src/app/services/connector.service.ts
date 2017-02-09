import {NgZone, Injectable} from "@angular/core";
import {HostConnector} from "./host.connector";
import {ClientConnector} from "./client.connector";
import {Observable, Subscriber} from "rxjs";

@Injectable()
export class ConnectorService {

  constructor(private zone: NgZone) {
  }

  private createConnector<T>(createCallback: (stream: MediaStream) => T): Observable<T> {
    return new Observable<T>((subscriber: Subscriber<T>) => {
      let errorCallback = e => {
        console.log(e);
        this.zone.run(() => subscriber.next(createCallback(null)));
      };
      try {
        navigator.getUserMedia({video: false, audio: true},
          e => this.zone.run(() => subscriber.next(createCallback(e))),
          errorCallback);
      }
      catch (e) {
        errorCallback(e);
      }
    });
  }

  public client(id: string, name: string): Observable<ClientConnector> {
    return this.createConnector(m => new ClientConnector(this.zone, m, id, name));
  }

  public host(id: string): Observable<HostConnector> {
    return this.createConnector(m => new HostConnector(this.zone, m, id));
  }
}
