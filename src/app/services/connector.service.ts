import {NgZone, Injectable} from "@angular/core";
import {HostConnector} from "./host.connector";
import {ClientConnector} from "./client.connector";

@Injectable()
export class ConnectorService {
  constructor(private zone: NgZone) {

  }

  public client(id: string, name: string): ClientConnector {
    return new ClientConnector(this.zone, id, name);
  }

  public host(id: string): HostConnector {
    return new HostConnector(this.zone, id);
  }
}
