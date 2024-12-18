import styles from "./styles.module.css";

import { Conversation } from "../../types/Conversation";

interface MessageThreadProps {
  activeConversation: Conversation;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  activeConversation,
}) => {
  return (
    <div className={styles.threadContainer}>
      {activeConversation.messages.map((message, index) => (
        <div
          key={index}
          className={`${styles.message} ${
            message.from ? styles.fromThem : styles.fromUs
          }`}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};
