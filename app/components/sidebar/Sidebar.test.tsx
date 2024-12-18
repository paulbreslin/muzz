import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { Sidebar } from "./Sidebar";
import { Conversation } from "../../types/Conversation";

describe("Sidebar Component", () => {
  const mockSetActiveIndex = jest.fn();

  const mockConversations: Conversation[] = [
    {
      id: "conv1",
      name: "Martha",
      lastMessage: "Hey, how's it going?",
      profileImage: "https://example.com/martha.jpg",
      messages: [
        {
          text: "Hey, how's it going?",
          sentAt: new Date("2024-04-25T10:00:00Z"),
          from: "Martha",
        },
        {
          text: "Yeah good thanks. You?",
          sentAt: new Date("2024-04-25T10:00:15Z"),
        },
      ],
    },
    {
      id: "conv2",
      name: "John",
      lastMessage: "See you tomorrow!",
      profileImage: null,
      messages: [
        {
          text: "Are we still on for tomorrow?",
          sentAt: new Date("2024-04-26T09:30:00Z"),
          from: "John",
        },
        {
          text: "Yes, see you tomorrow!",
          sentAt: new Date("2024-04-26T09:45:00Z"),
        },
      ],
    },
  ];

  beforeEach(() => {
    mockSetActiveIndex.mockClear();
  });

  it("renders the Sidebar with the correct title", () => {
    render(
      <Sidebar
        conversations={mockConversations}
        activeIndex={0}
        setActiveIndex={mockSetActiveIndex}
      />,
    );

    const titleElement = screen.getByText(/Messages/i);
    expect(titleElement).toBeInTheDocument();
  });

  it("renders the correct number of conversations", () => {
    render(
      <Sidebar
        conversations={mockConversations}
        activeIndex={0}
        setActiveIndex={mockSetActiveIndex}
      />,
    );

    const conversationElements = screen.getAllByTestId("conversation-item");
    expect(conversationElements).toHaveLength(mockConversations.length);
  });

  it("highlights the active conversation", () => {
    const activeIndex = 1;

    render(
      <Sidebar
        conversations={mockConversations}
        activeIndex={activeIndex}
        setActiveIndex={mockSetActiveIndex}
      />,
    );

    const conversationElements = screen.getAllByTestId("conversation-item");

    conversationElements.forEach((element, index) => {
      if (index === activeIndex) {
        expect(element).toHaveClass("active");
      } else {
        expect(element).not.toHaveClass("active");
      }
    });
  });

  it("displays conversation details correctly", () => {
    render(
      <Sidebar
        conversations={mockConversations}
        activeIndex={0}
        setActiveIndex={mockSetActiveIndex}
      />,
    );

    mockConversations.forEach((conversation) => {
      const nameElement = screen.getByText(conversation.name);
      const lastMessageElement = screen.getByText(conversation.lastMessage);

      expect(nameElement).toBeInTheDocument();
      expect(lastMessageElement).toBeInTheDocument();
    });
  });

  it("calls setActiveIndex with the correct index when a conversation is clicked", () => {
    render(
      <Sidebar
        conversations={mockConversations}
        activeIndex={0}
        setActiveIndex={mockSetActiveIndex}
      />,
    );

    const conversationElements = screen.getAllByTestId("conversation-item");

    conversationElements.forEach((element, index) => {
      fireEvent.click(element);
      expect(mockSetActiveIndex).toHaveBeenCalledWith(index);
    });

    expect(mockSetActiveIndex).toHaveBeenCalledTimes(mockConversations.length);
  });
});
