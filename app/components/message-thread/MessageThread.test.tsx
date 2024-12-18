import React from "react";
import { render, screen } from "@testing-library/react";

import { MessageThread } from "./MessageThread";
import { Conversation } from "../../types/Conversation";
import { groupMessages } from "../../utils/groupMessages";
import { Message } from "../../types/Message";

jest.mock("../../utils/groupMessages");

const mockedGroupMessages = groupMessages as jest.MockedFunction<
  typeof groupMessages
>;

describe("MessageThread Component", () => {
  const mockActiveConversation: Conversation = {
    id: "conv1",
    name: "Martha",
    lastMessage: "Hey, how's it going?",
    profileImage: "https://example.com/martha.jpg",
    messages: [
      {
        id: "msg1",
        text: "Hey, how's it going?",
        sentAt: new Date("2024-04-25T10:00:00Z"),
        from: "Martha",
      },
      {
        id: "msg2",
        text: "Yeah good thanks. You?",
        sentAt: new Date("2024-04-25T10:00:15Z"),
      },
      {
        id: "msg3",
        text: "Any plans this weekend?",
        sentAt: new Date("2024-04-25T10:02:00Z"),
        from: "Martha",
      },
      {
        id: "msg4",
        text: "Not yet, any suggestions?",
        sentAt: new Date("2024-04-25T10:02:10Z"),
      },
      {
        id: "msg5",
        text: "Maybe a hike or a movie.",
        sentAt: new Date("2024-04-25T11:30:00Z"),
        from: "Martha",
      },
      {
        id: "msg6",
        text: "That sounds great!",
        sentAt: new Date("2024-04-25T11:30:10Z"),
        from: "Martha",
      },
      {
        id: "msg7",
        text: "Let me know if you decide.",
        sentAt: new Date("2024-04-25T11:30:20Z"),
        from: "Martha",
      },
    ],
  };

  const mockGroupedMessages = [
    {
      header: "Thursday, April 25, 2024, 10:00",
      messages: [
        {
          id: "msg1",
          text: "Hey, how's it going?",
          sentAt: new Date("2024-04-25T10:00:00Z"),
          from: "Martha",
        },
        {
          id: "msg2",
          text: "Yeah good thanks. You?",
          sentAt: new Date("2024-04-25T10:00:15Z"),
        },
      ],
    },
    {
      header: "Thursday, April 25, 2024, 10:02",
      messages: [
        {
          id: "msg3",
          text: "Any plans this weekend?",
          sentAt: new Date("2024-04-25T10:02:00Z"),
          from: "Martha",
        },
        {
          id: "msg4",
          text: "Not yet, any suggestions?",
          sentAt: new Date("2024-04-25T10:02:10Z"),
        },
      ],
    },
    {
      header: "Thursday, April 25, 2024, 11:30",
      messages: [
        {
          id: "msg5",
          text: "Maybe a hike or a movie.",
          sentAt: new Date("2024-04-25T11:30:00Z"),
          from: "Martha",
        },
        {
          id: "msg6",
          text: "That sounds great!",
          sentAt: new Date("2024-04-25T11:30:10Z"),
          from: "Martha",
        },
        {
          id: "msg7",
          text: "Let me know if you decide.",
          sentAt: new Date("2024-04-25T11:30:20Z"),
          from: "Martha",
        },
      ],
    },
  ];

  beforeEach(() => {
    mockedGroupMessages.mockReturnValue(mockGroupedMessages);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<MessageThread activeConversation={mockActiveConversation} />);
    const threadContainer = screen.getByTestId("thread-container");
    expect(threadContainer).toBeInTheDocument();
  });

  it("renders the correct number of message groups", () => {
    render(<MessageThread activeConversation={mockActiveConversation} />);
    const headerElements = screen.getAllByTestId("group-header");
    expect(headerElements).toHaveLength(mockGroupedMessages.length);
  });

  it("renders message headers correctly", () => {
    render(<MessageThread activeConversation={mockActiveConversation} />);
    mockGroupedMessages.forEach((group) => {
      const headerElement = screen.getByText(group.header);
      expect(headerElement).toBeInTheDocument();
    });
  });

  it("renders messages correctly with appropriate classes", () => {
    render(<MessageThread activeConversation={mockActiveConversation} />);
    mockGroupedMessages.forEach((group) => {
      group.messages.forEach((message) => {
        const messageElement = screen.getByText(message.text);
        expect(messageElement).toBeInTheDocument();

        if (message.from) {
          expect(messageElement).toHaveClass("fromThem");
        } else {
          expect(messageElement).toHaveClass("fromUs");
        }
      });
    });
  });

  it("applies groupedMessage class when messages are from the same sender and within 20 seconds", () => {
    render(<MessageThread activeConversation={mockActiveConversation} />);

    const msg5 = screen.getByText("Maybe a hike or a movie.");
    const msg6 = screen.getByText("That sounds great!");
    const msg7 = screen.getByText("Let me know if you decide.");

    expect(msg5).toHaveClass("fromThem");
    expect(msg5).not.toHaveClass("groupedMessage");

    expect(msg6).toHaveClass("fromThem");
    expect(msg6).toHaveClass("groupedMessage");

    expect(msg7).toHaveClass("fromThem");
    expect(msg7).toHaveClass("groupedMessage");
  });

  it("renders correctly when there are no messages", () => {
    const emptyConversation: Conversation = {
      id: "conv2",
      name: "Empty",
      lastMessage: "",
      profileImage: null,
      messages: [],
    };

    mockedGroupMessages.mockReturnValue([]);

    render(<MessageThread activeConversation={emptyConversation} />);

    const threadContainer = screen.getByTestId("thread-container");
    expect(threadContainer).toBeInTheDocument();

    expect(screen.queryByTestId("group-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("message")).not.toBeInTheDocument();
  });
});
