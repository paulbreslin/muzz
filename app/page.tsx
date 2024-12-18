"use client";

import { useEffect, useState } from "react";

import { Sidebar } from "./components/sidebar/Sidebar";
import { MessageThread } from "./components/message-thread/MessageThread";
import { MessageBox } from "./components/message-box/MessageBox";
import { Conversation } from "./types/Conversation";
import { Message } from "./types/Message";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api");
      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }
      const data: Conversation[] = await response.json();
      setConversations(data);
    } catch (error) {
      console.error(error);
      // Would log to error reporting, e.g. Sentry
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const onSendMessage = (newMessage: Message) => {
    setConversations((prevConversations) =>
      prevConversations.map((conversation, index) => {
        if (index === activeIndex) {
          return {
            ...conversation,
            lastMessage: newMessage.text,
            messages: [...conversation.messages, newMessage],
          };
        }
        return conversation;
      }),
    );
  };

  const activeConversation = conversations[activeIndex];

  if (!conversations.length) {
    return null;
  }

  return (
    <div className="app-container">
      <Sidebar
        conversations={conversations}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      <MessageThread activeConversation={activeConversation} />
      <MessageBox
        activeConversation={activeConversation}
        onSendMessage={onSendMessage}
      />
    </div>
  );
}
