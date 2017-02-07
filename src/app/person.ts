import DataConnection = PeerJs.DataConnection;
export type Person = {
  id: string,
  isBlocked: boolean,
  connection: DataConnection
}
