export enum MessageType {
  GetSetupData,
  LoadSetupData,
  Chat
}

export interface Message {
  type: MessageType
}

export interface MessageResult<T> extends Message {
  type: MessageType,
  data: T
}
