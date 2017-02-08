import {Component} from '@angular/core';
import {MessageResult, MessageType, Message} from "./message";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Connector} from "./services/connector";
import {ConnectorService} from "./services/connector.service";
import {DataConnection} from "./peer";
import {Observable} from "rxjs";

@Component({
  templateUrl: 'game.component.html',
})
export class GameComponent {

  private connector: Connector;
  public messages: Message[];
  public enterFormGroup: FormGroup;
  public textFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private connectorService: ConnectorService) {
    this.connector = null;
    this.enterFormGroup = this.formBuilder.group({
      id: null,
      name: null
    });
    this.textFormGroup = this.formBuilder.group({
      text: null
    });
    this.messages = [];
  }

  public get isConnected(): boolean {
    return this.connector != null;
  }

  public get connections(): DataConnection[] {
    return this.isConnected ? this.connector.connections : [];
  }

  public enter() {
    let callback = (c) => {
      this.connector = c;
      this.connector.messagesSubject.subscribe(m => this.messages.push(m));
    };

    if (this.enterFormGroup.value.name) {
      this.connectorService.client(this.enterFormGroup.value.id, this.enterFormGroup.value.name).subscribe(callback);
    } else {
      this.connectorService.host(this.enterFormGroup.value.id).subscribe(callback);
    }
  }

  public sendText() {
    let textMessage: MessageResult<string> = { type: MessageType.Text, data: this.textFormGroup.value.text };
    this.connector.send(textMessage);
  }
}
