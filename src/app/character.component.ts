import {Component} from "@angular/core";
import {ConnectorService} from "./services/connector.service";
import {ClientConnector} from "./services/client.connector";
import {Character} from "./dtos/character";

@Component({
  templateUrl: 'character.component.html',
})
export class CharacterComponent {

  constructor(private connectorService: ConnectorService) {
  }

  public get character(): Character {
    return this.connectorService.isHost ? null : (<ClientConnector>this.connectorService.connector).character;
  }
}
