import { Component } from '@angular/core';
import {MessageResult, MessageType, Message} from "./message";
import {FormBuilder, FormGroup} from "@angular/forms";
import {PeerService} from "./services/peer.service";
import {ClientPeerService} from "./services/client.peer.service";
import {HostPeerService} from "./services/host.peer.service";
import {Observable, Subject, BehaviorSubject, Subscriber} from "rxjs";

@Component({
  templateUrl: 'game.component.html',
})
export class GameComponent {

  private peerService: PeerService;
  private messagesSubject: BehaviorSubject<Message[]>;
  private messagesArray: Message[];
  public enterFormGroup: FormGroup;
  public textFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.peerService = null;
    this.enterFormGroup = this.formBuilder.group({
      id: null,
      name: null
    });
    this.textFormGroup = this.formBuilder.group({
      text: null
    });
    this.messagesSubject = new BehaviorSubject([]);
    this.messagesArray = [];
  }

  public get messages() {
    return this.messagesSubject.asObservable();
  }

  public get isConnected(): boolean {
    return this.peerService != null;
  }

  public enter() {
    if (this.enterFormGroup.value.name) {
      this.peerService = new ClientPeerService(this.enterFormGroup.value.id, this.enterFormGroup.value.name);
    } else {
      this.peerService = new HostPeerService(this.enterFormGroup.value.id);
    }
    this.peerService.messagesSubject.subscribe(m => {
      this.messagesArray.push(m);
      this.messagesSubject.next(this.messagesArray);
    });
  }

  public sendText() {
    let textMessage: MessageResult<string> = { type: MessageType.Text, data: this.textFormGroup.value.text };
    this.peerService.send(textMessage);
  }
}
