export const mockData = [
  {
    name: "Martha",
    lastMessage: `Hey, how's it going?`,
    profileImage: null,
    messages: [
      {
        text: `Hey, how's it going?`,
        sentAt: new Date("2024-04-25T10:00:00"),
        from: "Martha",
      },
      {
        text: `Yeah good thanks. You?`,
        sentAt: new Date("2024-04-25T10:00:15"),
      },
      {
        text: `Any plans this weekend?`,
        sentAt: new Date("2024-04-25T10:02:00"),
        from: "Martha",
      },
      {
        text: `Not yet, any suggestions?`,
        sentAt: new Date("2024-04-25T10:02:10"),
      },
      {
        text: `Maybe a hike or a movie.`,
        sentAt: new Date("2024-04-25T11:30:00"),
        from: "Martha",
      },
    ],
  },
  {
    name: "Alice",
    lastMessage: `Good afternoon?`,
    profileImage: null,
    messages: [
      {
        text: `Good afternoon?`,
        sentAt: new Date(),
        from: "Martha",
      },
      {
        text: `Yeah good thanks. You?`,
        sentAt: new Date(),
      },
      {
        text: `Any plans this weekend?`,
        sentAt: new Date(),
        from: "Martha",
      },
    ],
  },
  {
    name: "Alexandra",
    lastMessage: `Wassup?`,
    profileImage: null,
    messages: [
      {
        text: `Wassup?`,
        sentAt: new Date(),
        from: "Martha",
      },
      {
        text: `Yeah good thanks. You?`,
        sentAt: new Date(),
      },
      {
        text: `Any plans this weekend?`,
        sentAt: new Date(),
        from: "Martha",
      },
    ],
  },
];
