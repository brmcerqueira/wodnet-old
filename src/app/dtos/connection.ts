import {DataConnection, MediaConnection} from "../peer";

export class Connection {
  private _isBlocked: boolean;
  private _dataConnection: DataConnection;
  private _mediaConnection: MediaConnection;
  private _audio: HTMLAudioElement;

  constructor(private _label: string) {
    this._isBlocked = false;
    this._dataConnection = null;
    this._mediaConnection = null;
    this._audio = null;
  }

  public get label(): string {
    return this._label;
  }

  public get isBlocked(): boolean {
    return this._isBlocked;
  }

  public set isBlocked(value: boolean) {
    this._isBlocked = value;
  }

  public get dataConnection(): DataConnection {
    return this._dataConnection;
  }

  public set dataConnection(value: DataConnection) {
    this._dataConnection = value;
  }

  public get mediaConnection(): MediaConnection {
    return this._mediaConnection;
  }

  public set mediaConnection(value: MediaConnection) {
    this._mediaConnection = value;
  }

  public get audio(): HTMLAudioElement {
    return this._audio;
  }

  public set audio(value: HTMLAudioElement) {
    this._audio = value;
  }
}
