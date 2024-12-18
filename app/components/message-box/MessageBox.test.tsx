import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { MessageBox } from "./MessageBox";
import { Conversation } from "../src/types/Conversation";
import { Message } from "../src/types/Message";

const mockDate = new Date("2024-04-25T12:00:00Z");

const mockActiveConversation: Conversation = {
  id: "conv1",
  name: "Martha",
  lastMessage: "Hey, how's it going?",
  profileImage: null,
  messages: [],
};

const mockOnSendMessage = jest.fn();

const OriginalDate = Date;

beforeAll(() => {
  // @ts-ignore
  global.Date = class extends OriginalDate {
    constructor() {
      super();
      return mockDate;
    }
  };
});

afterAll(() => {
  global.Date = OriginalDate;
});

describe("MessageBox Component", () => {
  beforeEach(() => {
    mockOnSendMessage.mockClear();
  });

  it("renders the input field with correct placeholder", () => {
    render(
      <MessageBox
        activeConversation={mockActiveConversation}
        onSendMessage={mockOnSendMessage}
      />,
    );

    const inputElement = screen.getByPlaceholderText(
      `Message ${mockActiveConversation.name}`,
    );
    expect(inputElement).toBeInTheDocument();
  });

  it("updates the input value when user types", () => {
    render(
      <MessageBox
        activeConversation={mockActiveConversation}
        onSendMessage={mockOnSendMessage}
      />,
    );

    const inputElement = screen.getByPlaceholderText(
      `Message ${mockActiveConversation.name}`,
    ) as HTMLInputElement;

    fireEvent.change(inputElement, { target: { value: "Hello there!" } });
    expect(inputElement.value).toBe("Hello there!");
  });

  it("calls onSendMessage with correct message when Enter is pressed", () => {
    render(
      <MessageBox
        activeConversation={mockActiveConversation}
        onSendMessage={mockOnSendMessage}
      />,
    );

    const inputElement = screen.getByPlaceholderText(
      `Message ${mockActiveConversation.name}`,
    ) as HTMLInputElement;

    const messageText = "Hello there!";

    fireEvent.change(inputElement, { target: { value: messageText } });
    fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });

    expect(mockOnSendMessage).toHaveBeenCalledTimes(1);
    expect(mockOnSendMessage).toHaveBeenCalledWith({
      text: messageText,
      sentAt: mockDate,
    });

    expect(inputElement.value).toBe("");
  });

  it("does not call onSendMessage when Enter is pressed with empty input", () => {
    render(
      <MessageBox
        activeConversation={mockActiveConversation}
        onSendMessage={mockOnSendMessage}
      />,
    );

    const inputElement = screen.getByPlaceholderText(
      `Message ${mockActiveConversation.name}`,
    ) as HTMLInputElement;

    fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it("does not call onSendMessage when Enter is pressed with only whitespace", () => {
    render(
      <MessageBox
        activeConversation={mockActiveConversation}
        onSendMessage={mockOnSendMessage}
      />,
    );

    const inputElement = screen.getByPlaceholderText(
      `Message ${mockActiveConversation.name}`,
    ) as HTMLInputElement;

    fireEvent.change(inputElement, { target: { value: "   " } });
    fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });

    expect(mockOnSendMessage).not.toHaveBeenCalled();
    expect(inputElement.value).toBe("   ");
  });
});
