import {Injectable} from "@angular/core";
import {Character} from "../dtos/character";

@Injectable()
export class ChronicleService {

  private _characters: { [key: string]: Character };

  constructor() {
    this._characters = {};
  }

  public get characters(): { [key: string]: Character } {
    return this._characters;
  }

  public newCharacter(): void {
    this._characters[this.generateKey()] = null;
  }

  public changeCharacterKey(oldKey: string, newKey?: string): string {
    let character = this._characters[oldKey];
    if (!newKey) {
      newKey = this.generateKey();
    }
    else if (this._characters[newKey]) {
      this._characters[this.generateKey()] = this._characters[newKey];
      delete this._characters[newKey];
    }

    delete this._characters[oldKey];
    this._characters[newKey] = character;
    return newKey;
  }

  private generateKey(): string {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
}
