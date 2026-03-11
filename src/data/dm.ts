// src/data/dm.ts
// TODO: replace with Firestore real-time listeners when Firebase is connected
import type { Conversation, Message } from "@/types/dm";

export const CONVOS: Conversation[] = [
  {
    id: "c1", name: "Maya Thompson", handle: "@maya", emoji: "🌅",
    streak: 31, atRisk: false, broken: false, lastStreak: null,
    last: "Did you see the aurora signal?", time: "now", unread: 2, online: true,
    started: "Jan 9, 2025", longest: 31, milestone: true,
  },
  {
    id: "c2", name: "Leo (Toronto)", handle: "@leo_t", emoji: "🏔️",
    streak: 8, atRisk: true, broken: false, lastStreak: null,
    last: "Perfect, on my way there", time: "2m", unread: 0, online: true,
    started: "Mar 2, 2025", longest: 12, milestone: false,
  },
  {
    id: "c3", name: "Sofia (Nairobi)", handle: "@sofia_k", emoji: "🌍",
    streak: 0, atRisk: false, broken: true, lastStreak: 9,
    last: "A cheetah sighting at dawn 🐆", time: "8m", unread: 1, online: false,
    started: "Feb 14, 2025", longest: 9, milestone: false,
  },
  {
    id: "c4", name: "Alex (Tokyo)", handle: "@alex_k", emoji: "🗼",
    streak: 3, atRisk: false, broken: false, lastStreak: null,
    last: "100km from the summit now", time: "10m", unread: 0, online: false,
    started: "Mar 7, 2025", longest: 3, milestone: false,
  },
  {
    id: "c5", name: "Global Creators", handle: "@owf_all", emoji: "✦",
    streak: null, atRisk: false, broken: false, lastStreak: null,
    last: "Voice of the program is live", time: "3h", unread: 4, online: true,
    started: null, longest: null, milestone: false,
  },
];

export const MESSAGES: Record<string, Message[]> = {
  c1: [
    { id:"m1", from:"them", text:"Hey! Did you see the new aurora signal? 🌌", time:"4:50 PM", reactions:[] },
    { id:"m2", from:"them", text:"It's a G4 storm — strongest since 2003.", time:"4:51 PM", reactions:[{emoji:"🔥",count:1,mine:false}] },
    { id:"m3", from:"me",   text:"Not yet, I'm about to check it out", time:"4:53 PM", reactions:[] },
    { id:"m4", from:"me",   text:"That Tromsø feed is unreal right now 😭", time:"4:53 PM", reactions:[{emoji:"💜",count:1,mine:true}] },
    { id:"m5", from:"them", text:"Right?! I've been watching for 20 mins. The owl is wide awake tonight 🦉", time:"4:54 PM", reactions:[] },
  ],
  c2: [
    { id:"m1", from:"them", text:"You joining the hike stream tomorrow?", time:"2:10 PM", reactions:[] },
    { id:"m2", from:"me",   text:"Perfect, on my way there", time:"2:11 PM", reactions:[] },
  ],
  c3: [
    { id:"m1", from:"them", text:"A cheetah sighting at dawn 🐆", time:"9:20 AM", reactions:[{emoji:"🌟",count:3,mine:false}] },
    { id:"m2", from:"me",   text:"That's incredible. How close were you?", time:"9:22 AM", reactions:[] },
  ],
  c4: [
    { id:"m1", from:"them", text:"100km from the summit now", time:"Yesterday", reactions:[] },
    { id:"m2", from:"me",   text:"Stay warm up there 🏔️", time:"Yesterday", reactions:[] },
  ],
  c5: [
    { id:"m1", from:"them", text:"Voice of the program is live — check #announcements", time:"3h ago", reactions:[] },
  ],
};

export const QUICK_REACTIONS = ["💜", "🔥", "🌟", "🌍", "😂", "👏"];
