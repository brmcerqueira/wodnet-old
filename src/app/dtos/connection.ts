import {DataConnection, MediaConnection} from "../peer";
import {Character} from "./character";

export type Connection = {
  label: string,
  isBlocked: boolean,
  dataConnection?: DataConnection,
  mediaConnection?: MediaConnection,
  audio?: HTMLAudioElement
}
