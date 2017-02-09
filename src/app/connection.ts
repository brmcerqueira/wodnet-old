import {DataConnection, MediaConnection} from "./peer";

export type Connection = {
  label: string,
  isBlocked: boolean,
  dataConnection?: DataConnection,
  mediaConnection?: MediaConnection
}
