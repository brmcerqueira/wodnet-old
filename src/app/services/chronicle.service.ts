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

  public newCharacter(character: Character): void {
    this._characters[this.generateKey()] = character;
  }

  public changeCharacterKey(oldKey: string, newKey?: string): void {
    let character = this._characters[oldKey];
    if (!newKey) {
      newKey = this.generateKey();
    }
    else if (this._characters[newKey]) {
      this._characters[this.generateKey()] = this._characters[newKey];
      this.deleteCharacter(newKey);
    }

    this.deleteCharacter(oldKey);
    this._characters[newKey] = character;
  }

  private generateKey(): string {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  public deleteCharacter(key: string): void {
    delete this._characters[key];
  }
}
