import { groupMessages } from "./groupMessages";
import { Message } from "../src/types/Message";
import { mockData } from "../api/mockData";

import { format } from "date-fns";

jest.mock("date-fns", () => ({
  ...jest.requireActual("date-fns"),
  format: jest.fn((date: Date, formatStr: string) => {
    return `${date.toISOString()} - ${formatStr}`;
  }),
}));

describe("groupMessages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an empty array when given no messages", () => {
    const messages: Message[] = [];
    const result = groupMessages(messages);
    expect(result).toEqual([]);
  });

  it("should group a single message correctly", () => {
    const message: Message = {
      id: "1",
      content: "Hello World",
      sentAt: new Date("2023-01-01T10:00:00Z"),
    };
    const result = groupMessages([message]);

    expect(result).toHaveLength(1);
    expect(result[0].header).toBe(
      `${message.sentAt.toISOString()} - EEEE, MMMM d, yyyy, HH:mm`,
    );
    expect(result[0].messages).toHaveLength(1);
    expect(result[0].messages[0]).toEqual(message);
  });

  it("should group multiple messages within one hour into a single group", () => {
    const baseTime = new Date("2023-01-01T10:00:00Z");
    const messages: Message[] = [
      { id: "1", content: "Message 1", sentAt: new Date(baseTime) },
      {
        id: "2",
        content: "Message 2",
        sentAt: new Date(baseTime.getTime() + 15 * 60 * 1000), // +15 mins
      },
      {
        id: "3",
        content: "Message 3",
        sentAt: new Date(baseTime.getTime() + 30 * 60 * 1000), // +30 mins
      },
    ];

    const result = groupMessages(messages);

    expect(result).toHaveLength(1);
    expect(result[0].header).toBe(
      `${baseTime.toISOString()} - EEEE, MMMM d, yyyy, HH:mm`,
    );
    expect(result[0].messages).toHaveLength(3);
    expect(result[0].messages).toEqual(messages);
  });

  it("should create separate groups for messages sent more than one hour apart", () => {
    const baseTime = new Date("2023-01-01T10:00:00Z");
    const messages: Message[] = [
      { id: "1", content: "Message 1", sentAt: new Date(baseTime) },
      {
        id: "2",
        content: "Message 2",
        sentAt: new Date(baseTime.getTime() + 61 * 60 * 1000), // +61 mins
      },
      {
        id: "3",
        content: "Message 3",
        sentAt: new Date(baseTime.getTime() + 122 * 60 * 1000), // +122 mins
      },
    ];

    const result = groupMessages(messages);

    expect(result).toHaveLength(3);
    expect(result[0].header).toBe(
      `${baseTime.toISOString()} - EEEE, MMMM d, yyyy, HH:mm`,
    );
    expect(result[0].messages).toHaveLength(1);
    expect(result[0].messages[0]).toEqual(messages[0]);

    expect(result[1].header).toBe(
      `${new Date(
        baseTime.getTime() + 61 * 60 * 1000,
      ).toISOString()} - EEEE, MMMM d, yyyy, HH:mm`,
    );
    expect(result[1].messages).toHaveLength(1);
    expect(result[1].messages[0]).toEqual(messages[1]);

    expect(result[2].header).toBe(
      `${new Date(
        baseTime.getTime() + 122 * 60 * 1000,
      ).toISOString()} - EEEE, MMMM d, yyyy, HH:mm`,
    );
    expect(result[2].messages).toHaveLength(1);
    expect(result[2].messages[0]).toEqual(messages[2]);
  });

  it("should correctly parse sentAt when it's a string", () => {
    const message: Message = {
      id: "1",
      content: "Hello World",
      sentAt: "2023-01-01T10:00:00Z",
    };
    const result = groupMessages([message]);

    expect(result).toHaveLength(1);
    const sentAtDate = new Date(message.sentAt);
    expect(result[0].header).toBe(
      `${sentAtDate.toISOString()} - EEEE, MMMM d, yyyy, HH:mm`,
    );
    expect(result[0].messages).toHaveLength(1);
    expect(result[0].messages[0]).toEqual({
      ...message,
      sentAt: sentAtDate,
    });
  });

  it("should format headers correctly using date-fns", () => {
    const message: Message = {
      id: "1",
      content: "Test Message",
      sentAt: new Date("2023-01-01T10:00:00Z"),
    };

    groupMessages([message]);

    expect(format).toHaveBeenCalledWith(
      message.sentAt instanceof Date
        ? message.sentAt
        : new Date(message.sentAt),
      "EEEE, MMMM d, yyyy, HH:mm",
    );
  });
});
