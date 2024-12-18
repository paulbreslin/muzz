import { sortBy } from "lodash";

import { Message } from "../../types/Message";
import { formatHeader } from "./formatHeader";

interface GroupedMessages {
  header: string;
  messageGroups: Message[][];
}

export const groupMessages = (messages: Message[]): GroupedMessages[] => {
  if (!messages.length) return [];

  const processedMessages = messages.map((message) => ({
    ...message,
    sentAt:
      message.sentAt instanceof Date
        ? message.sentAt
        : new Date(message.sentAt),
  }));

  const sortedMessages = sortBy(processedMessages, "sentAt");

  return sortedMessages.reduce<GroupedMessages[]>((groups, message, index) => {
    const previousMessage = sortedMessages[index - 1];
    const currentTime = message.sentAt.getTime();

    const isNewTimeGroup =
      index === 0 || currentTime - previousMessage.sentAt.getTime() > 3600000;

    if (isNewTimeGroup) {
      groups.push({
        header: formatHeader(message.sentAt),
        messages: [message],
      });
    } else {
      const lastGroup = groups[groups.length - 1];
      lastGroup.messages.push(message);
    }

    return groups;
  }, []);
};
