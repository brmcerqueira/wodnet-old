import {Injectable} from "@angular/core";
import {Character} from "../dtos/character";

@Injectable()
export class ChronicleService {

  private _characters: { [key: string]: Character };

  constructor() {
    let cronicle = localStorage.getItem("cronicle");
    this._characters = cronicle ? JSON.parse(cronicle) : {};
  }

  public get characters(): { [key: string]: Character } {
    return this._characters;
  }

  public newCharacter(character: Character): void {
    this._characters[this.generateKey()] = character;
    this.makeBackup();
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
    this.makeBackup();
  }

  public updateCharacter(key: string, character: Character): void {
    this._characters[key] = character;
    this.makeBackup();
  }

  public deleteCharacter(key: string): void {
    delete this._characters[key];
    this.makeBackup();
  }

  public upload(fileList: FileList): void {
    if(fileList.length > 0) {
      let fileReader = new FileReader();
      fileReader.onload = event => {
        try {
          this._characters = JSON.parse(event.target['result']);
          this.makeBackup();
        }
        catch (e) {
          console.log(e);
        }
      };
      fileReader.onerror = e => console.log(e.message);
      fileReader.readAsText(fileList[0]);
    }
  }

  public download(): void {
    window['saveAs'](new Blob([JSON.stringify(this._characters)],
      { type: "data:application/octet-stream;charset=utf-8" }), "cronicle.json");
  }

  private makeBackup(): void {
    localStorage.setItem("cronicle", JSON.stringify(this._characters));
  }

  private generateKey(): string {
    return 'NA_' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
}
