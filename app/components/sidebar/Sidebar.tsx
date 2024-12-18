import styles from "./styles.module.css";

import { Conversation } from "../../types/Conversation";

interface SidebarProps {
  conversations: Conversation[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeIndex,
  setActiveIndex,
}) => {
  return (
    <div className={styles.sidebar}>
      <h2>Messages</h2>

      {conversations.map((conversation, index) => (
        <div
          key={conversation.name}
          onClick={() => setActiveIndex(index)}
          className={`${styles.conversation} ${
            activeIndex === index ? styles.active : ""
          }`}
        >
          <div className={styles.imageContainer}>
            <img
              src={conversation.profileImage ?? null}
              alt={`${conversation.name}'s profile`}
              className={styles.image}
            />
          </div>
          <div className={styles.conversationDetails}>
            <div className={styles.name}>{conversation.name}</div>
            <div className={styles.lastMessage}>{conversation.lastMessage}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
