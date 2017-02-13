export enum MessageType {
  GetSetupData,
  LoadSetupData,
  Text,
  Roll,
  Character
}

export interface Message {
  type: MessageType
}

export interface MessageResult<T> extends Message {
  type: MessageType,
  data: T
}
