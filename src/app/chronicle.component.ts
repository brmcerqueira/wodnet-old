import {Component} from "@angular/core";
import {ConnectorService} from "./services/connector.service";
import {Connection} from "./dtos/connection";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  templateUrl: 'chronicle.component.html',
})
export class ChronicleComponent {

  public characterFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private connectorService: ConnectorService) {
    this.characterFormGroup = this.formBuilder.group({
      name: null,
      sheet: null
    });
  }

  public get connections(): { [key: string]: Connection } {
    return this.connectorService.connector.connections;
  }

  public set connection(value: Connection) {
    let data = value ? {
      name: value.character.name,
      sheet: value.character.name
    } : {
      name: null,
      sheet: null
    };

    this.characterFormGroup.setValue(data);
  }

  public saveCharacter() {

  }
}
