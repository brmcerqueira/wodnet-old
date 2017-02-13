import {Component} from '@angular/core';
import {MessageType, Message} from "./dtos/message";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ConnectorService} from "./services/connector.service";
import {Connection} from "./connection";
import {DiceService} from "./services/dice.service";

@Component({
  templateUrl: 'game.component.html',
})
export class GameComponent {

  public messages: Message[];
  public enterFormGroup: FormGroup;
  public textFormGroup: FormGroup;
  public rollFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private connectorService: ConnectorService, private diceService: DiceService) {
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
    this.connectorService.connectorSubject.subscribe(() => {
      this.connectorService.connector.textMessageSubject.subscribe(m => this.messages.push(m));
      this.connectorService.connector.rollMessageSubject.subscribe(m => this.messages.push(m));
    });
  }

  public get isConnected(): boolean {
    return this.connectorService.isConnected;
  }

  public get host(): Connection {
    return this.connectorService.connector.host;
  }

  public get connections(): { [key: string]: Connection } {
    return this.isConnected ? this.connectorService.connector.connections : {};
  }

  public enter() {
    if (this.enterFormGroup.value.name) {
      this.connectorService.startClient(this.enterFormGroup.value.id, this.enterFormGroup.value.name);
    } else {
      this.connectorService.startHost(this.enterFormGroup.value.id);
    }
  }

  public sendText() {
    this.connectorService.connector.sendText({ type: MessageType.Text, data: this.textFormGroup.value.text });
  }

  public sendRoll() {
    this.connectorService.connector.sendRoll({ type: MessageType.Roll,
      data: this.diceService.roll(this.rollFormGroup.value.amount,
        this.rollFormGroup.value.explosion,
        this.rollFormGroup.value.isCanceller)});
  }
}
