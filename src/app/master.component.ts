import { Component } from '@angular/core';
import {ConnectorService} from "./services/connector.service";

@Component({
  selector: 'master',
  templateUrl: './master.component.html'
})
export class MasterComponent {
  constructor(private connectorService: ConnectorService) {
  }

  public get showCharacter(): boolean {
    return this.connectorService.isConnected && !this.connectorService.isHost;
  }

  public get showChronicle(): boolean {
    return !this.connectorService.isConnected || this.connectorService.isHost;
  }
}
