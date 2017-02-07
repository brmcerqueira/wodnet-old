export enum MessageType {
  GetPeople,
  LoadPeople,
  Text
}

export interface Message {
  type: MessageType
}

export interface MessageResult<T> extends Message {
  type: MessageType,
  data: T
}
