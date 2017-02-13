import {Component} from "@angular/core";
import {ConnectorService} from "./services/connector.service";
import {ClientConnector} from "./services/client.connector";
import {Character} from "./dtos/character";

@Component({
  templateUrl: 'character.component.html',
})
export class CharacterComponent {

  private _character: Character;

  constructor(private connectorService: ConnectorService) {
    this._character = null;
    if (!this.connectorService.isHost) {
      (<ClientConnector>this.connectorService.connector).characterSubject.subscribe(c => {
        this._character = c;
      });
    }
  }

  public get character(): Character {
    return this._character;
  }
}
