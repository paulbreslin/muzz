import { useState, KeyboardEvent, ChangeEvent } from "react";

import styles from "./styles.module.css";

import { Conversation } from "../../types/Conversation";
import { Message } from "../../types/Message";

interface MessageBoxProps {
  activeConversation: Conversation;
  onSendMessage: (message: Message) => void;
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  activeConversation,
  onSendMessage,
}) => {
  const [messageText, setMessageText] = useState<string>("");

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && messageText.trim()) {
      const newMessage: Message = {
        text: messageText.trim(),
        sentAt: new Date(),
      };

      onSendMessage(newMessage);
      setMessageText("");
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
  };

  return (
    <div className={styles.messageBox}>
      <input
        type="text"
        placeholder={`Message ${activeConversation.name}`}
        onKeyDown={onKeyDown}
        value={messageText}
        onChange={onChange}
        className={styles.input}
      />
    </div>
  );
};
