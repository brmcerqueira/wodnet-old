import {Component} from "@angular/core";
import {ConnectorService} from "./services/connector.service";
import {Connection} from "./dtos/connection";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MessageType} from "./dtos/message";

@Component({
  templateUrl: 'chronicle.component.html',
})
export class ChronicleComponent {

  private _connection: Connection;
  public characterFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private connectorService: ConnectorService) {
    this.characterFormGroup = this.formBuilder.group({
      name: null,
      sheet: null
    });

    for (let key in this.connectorService.connector.connections) {
      this.connectionChange(this.connectorService.connector.connections[key]);
      break;
    }
  }

  public get connections(): { [key: string]: Connection } {
    return this.connectorService.connector.connections;
  }

  public connectionChange(value: Connection): void {
    this._connection = value;

    let data = value.character ? {
      name: value.character.name,
      sheet: value.character.name
    } : {
      name: null,
      sheet: null
    };

    this.characterFormGroup.setValue(data);
  }

  public saveCharacter(): void {
    if (this._connection) {
      this._connection.character = this.characterFormGroup.value;
      if (this._connection.dataConnection) {
        this._connection.dataConnection.send({
          type: MessageType.Character,
          data: this._connection.character
        });
      }
    }
  }
}
