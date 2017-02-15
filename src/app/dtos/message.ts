export enum MessageType {
  GetSetupData,
  LoadSetupData,
  Text,
  Roll,
  Character
}

export interface Message {
  type: MessageType,
  origin: string
}

export interface MessageResult<T> extends Message {
  data: T
}
