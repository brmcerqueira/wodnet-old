import {Component} from '@angular/core';
import {MessageResult, MessageType, Message} from "./message";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Connector} from "./services/connector";
import {ConnectorService} from "./services/connector.service";
import {Connection} from "./connection";
import {ClientConnector} from "./services/client.connector";
import {DiceService} from "./services/dice.service";
import {Roll} from "./services/roll";

@Component({
  templateUrl: 'game.component.html',
})
export class GameComponent {

  private connector: Connector;
  public messages: Message[];
  public enterFormGroup: FormGroup;
  public textFormGroup: FormGroup;
  public rollFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private connectorService: ConnectorService, private diceService: DiceService) {
    this.connector = null;
    this.messages = [];
    this.enterFormGroup = this.formBuilder.group({
      id: null,
      name: null
    });
    this.textFormGroup = this.formBuilder.group({
      text: null
    });
    this.rollFormGroup = this.formBuilder.group({
      amount: 1,
      explosion: 10,
      isCanceller: false
    });
  }

  public get isConnected(): boolean {
    return this.connector != null;
  }

  public get host(): Connection {
    return this.isConnected && (<ClientConnector>this.connector).host != undefined
      ? (<ClientConnector>this.connector).host : null;
  }

  public get connections(): { [key: string]: Connection } {
    return this.isConnected ? this.connector.connections : {};
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
    let textMessage: MessageResult<string> = { type: MessageType.Chat, data: this.textFormGroup.value.text };
    this.connector.send(textMessage);
  }

  public sendRoll() {
    let rollMessage: MessageResult<Roll> = { type: MessageType.Chat,
      data: this.diceService.roll(this.rollFormGroup.value.amount, this.rollFormGroup.value.explosion, this.rollFormGroup.value.isCanceller) };
    this.connector.send(rollMessage);
  }
}
