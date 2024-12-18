import { Conversation } from "../../types/Conversation";
import { groupMessages } from "../../utils/groupMessages";

import styles from "./styles.module.css";

interface MessageThreadProps {
  activeConversation: Conversation;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  activeConversation,
}) => {
  const groupedMessages = groupMessages(activeConversation.messages);

  return (
    <div className={styles.threadContainer}>
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex} className={styles.threadGroup}>
          <div className={styles.header}>{group.header}</div>
          {group.messages.map((message, messageIndex) => {
            const previousMessage = group.messages[messageIndex - 1];
            const shouldReduceSpacing =
              previousMessage &&
              message.from === previousMessage.from &&
              message.sentAt.getTime() - previousMessage.sentAt.getTime() <=
                20000;

            return (
              <div
                key={messageIndex}
                className={`${styles.message} ${
                  message.from ? styles.fromThem : styles.fromUs
                } ${shouldReduceSpacing ? styles.groupedMessage : ""}`}
              >
                {message.text}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
