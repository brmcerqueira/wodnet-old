import {Component} from "@angular/core";
import {ConnectorService} from "./services/connector.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MessageType} from "./dtos/message";
import {ChronicleService} from "./services/chronicle.service";
import {Character} from "./dtos/character";
import {Connection} from "./dtos/connection";

@Component({
  templateUrl: 'chronicle.component.html',
})
export class ChronicleComponent {

  private _key: string;
  public characterFormGroup: FormGroup;
  public changeCharacterKeyFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private connectorService: ConnectorService,
              private chronicleService: ChronicleService) {
    this._key = null;

    this.characterFormGroup = this.formBuilder.group({
      name: null,
      sheet: null
    });

    this.changeCharacterKeyFormGroup = this.formBuilder.group({
      player: null
    });

    this.selectFirst();
  }

  public get characters(): { [key: string]: Character } {
    return this.chronicleService.characters;
  }

  public get connections(): { [key: string]: Connection } {
    return this.connectorService.connector.connections;
  }

  public characterChange(key: string): void {
    this._key = key;

    let character = this.characters[key];

    let data = character ? {
      name: character.name,
      sheet: character.sheet
    } : {
      name: null,
      sheet: null
    };

    this.characterFormGroup.setValue(data);
  }

  public changeCharacterKey(): void {
    let player = this.changeCharacterKeyFormGroup.value.player;
    if(player) {
      let connection = this.connections[player];
      if (connection && connection.dataConnection && connection.dataConnection.metadata && connection.dataConnection.metadata.fingerprint) {
        this.characterChange(this.chronicleService.changeCharacterKey(this._key, connection.dataConnection.metadata.fingerprint));
      }
    }
    else {
      this.chronicleService.changeCharacterKey(this._key);
    }
  }

  public newCharacter(): void {
    this.chronicleService.newCharacter();
    if (Object.keys(this.characters).length == 1) {
      this.selectFirst();
    }
  }

  public saveCharacter(): void {
    let character = this.characterFormGroup.value;
    this.chronicleService.characters[this._key] = character;
    let connection = this.connections[this._key];
    if (connection && connection.dataConnection) {
      connection.dataConnection.send({
        type: MessageType.Character,
        data: character
      });
    }
  }

  private selectFirst(): void {
    for (let key in this.characters) {
      this.characterChange(key);
      break;
    }
  }
}
