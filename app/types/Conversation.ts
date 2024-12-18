import { Message } from "./Message";

export interface Conversation {
  name: string;
  lastMessage: string;
  profileImage: string;
  messages: Message[];
}
