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
  }

  public get characters(): { [key: string]: Character } {
    return this.chronicleService.characters;
  }

  public get connections(): { [key: string]: Connection } {
    return this.connectorService.connector.connections;
  }

  public get isHost(): boolean {
    return this.connectorService.isHost;
  }

  public characterChange(key: string): void {
    this._key = key == "" ? null : key;

    let data = {
      name: null,
      sheet: null
    };

    if (this._key && this.characters[key]) {
      data = {
        name: this.characters[key].name,
        sheet: this.characters[key].sheet
      };
    }

    this.characterFormGroup.setValue(data);
  }

  public changeCharacterKey(): void {
    if (this._key) {
      let player = this.changeCharacterKeyFormGroup.value.player;
      if (player != "") {
        let connection = this.connections[player];
        if (connection && connection.dataConnection && connection.dataConnection.metadata && connection.dataConnection.metadata.fingerprint) {
          let fingerprint = connection.dataConnection.metadata.fingerprint;
          this.chronicleService.changeCharacterKey(this._key, fingerprint);
          this.trySend(fingerprint, this.characters[fingerprint]);
        }
      }
      else {
        this.chronicleService.changeCharacterKey(this._key);
      }
    }
  }

  public deleteCharacter(): void {
    if (this._key) {
      this.chronicleService.deleteCharacter(this._key);
      this.characterChange(null);
    }
  }

  public saveCharacter(): void {
    let character = this.characterFormGroup.value;
    if (this._key) {
      this.chronicleService.updateCharacter(this._key, character);
      this.trySend(this._key, character);
    }
    else {
      this.chronicleService.newCharacter(character);
      this.characterChange(null);
    }
  }

  public upload(event: Event): void {
    this.chronicleService.upload(event.target['files']);
    event.target['value'] = "";
  }

  public download(): void {
    this.chronicleService.download();
  }

  private trySend(code: string, character: Character) {
    if (this.isHost) {
      for (let key in this.connections) {
        let dataConnection = this.connections[key].dataConnection;
        if (dataConnection.metadata.fingerprint == code) {
          dataConnection.send({
            type: MessageType.Character,
            data: character
          });
          break;
        }
      }
    }
  }
}
