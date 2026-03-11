import type { Conversation, Message } from "@/types/dm";

export const CONVOS: Conversation[] = [
  {
    id: "c1", name: "Maya Thompson", avatar: "MT",
    lastMsg: "That sunset photo is incredible 🌅", ts: "2:41 PM",
    unread: 2, online: true,
    streak: 31, milestone: true,
    started: "Jan 9, 2025", longest: 31,
  },
  {
    id: "c2", name: "Leo Toronto", avatar: "LT",
    lastMsg: "Are you coming to the meetup?", ts: "11:22 AM",
    online: false,
    streak: 8, atRisk: true,
    started: "Mar 3, 2025", longest: 14,
  },
  {
    id: "c3", name: "Sofia Nairobi", avatar: "SN",
    lastMsg: "Miss our chats 💙", ts: "Yesterday",
    streak: 0, broken: true, lastStreak: 9,
  },
  {
    id: "c4", name: "Alex Tokyo", avatar: "AT",
    lastMsg: "Check out this track!", ts: "Mon",
    online: true,
    streak: 3,
    started: "Mar 8, 2025", longest: 3,
  },
  {
    id: "c5", name: "Global Creators", avatar: "🌍",
    lastMsg: "Priya: New issue is live!", ts: "Sun",
    group: true, unread: 5,
  },
];

export const MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: "m1", senderId: "other", text: "Hey! Did you see the aurora last night?", ts: "2:38 PM" },
    { id: "m2", senderId: "me",    text: "YES. I was outside for like an hour", ts: "2:39 PM" },
    { id: "m3", senderId: "other", text: "That sunset photo is incredible 🌅", ts: "2:41 PM", reactions: ["❤️", "🔥"] },
  ],
  c2: [
    { id: "m1", senderId: "other", text: "Are you coming to the meetup?", ts: "11:22 AM" },
    { id: "m2", senderId: "me",    text: "I'm planning to! What time?", ts: "11:24 AM" },
  ],
  c3: [
    { id: "m1", senderId: "me",    text: "Hey! Long time 👋", ts: "Yesterday" },
    { id: "m2", senderId: "other", text: "Miss our chats 💙", ts: "Yesterday" },
  ],
  c4: [
    { id: "m1", senderId: "other", text: "Check out this track!", ts: "Mon" },
    { id: "m2", senderId: "me",    text: "This is fire 🔥", ts: "Mon" },
  ],
  c5: [
    { id: "m1", senderId: "priya", text: "New issue is live!", ts: "Sun" },
    { id: "m2", senderId: "other", text: "Amazing work everyone 🙌", ts: "Sun" },
  ],
};
