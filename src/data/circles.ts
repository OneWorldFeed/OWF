export interface CircleMember {
  id:       string;
  name:     string;
  handle:   string;
  initials: string;
  city:     string;
  country:  string;
  avatar?:  string;
  online?:  boolean;
  streak?:  number;
  mutuals?: number;
  bio?:     string;
  accent:   string;
}

export interface CirclePost {
  id:        string;
  memberId:  string;
  text:      string;
  mood:      string;
  moodColor: string;
  city:      string;
  ts:        string;
  likes:     number;
  comments:  number;
}

export interface CircleCollection {
  id:    string;
  name:  string;
  count: number;
  cover: string;
  emoji: string;
}

export interface Circle {
  id:          string;
  name:        string;
  emoji:       string;
  color:       string;
  colorRgb:    string;
  description: string;
  memberCount: number;
  members:     CircleMember[];
  posts:       CirclePost[];
  collections: CircleCollection[];
  chatPreview: string;
  lastActive:  string;
}

export const CIRCLES: Circle[] = [
  {
    id: 'family',
    name: 'Family',
    emoji: '😊',
    color: '#34D399',
    colorRgb: '52,211,153',
    description: 'The ones who show up no matter what.',
    memberCount: 8,
    lastActive: '2m ago',
    chatPreview: 'Mom: Did you eat today?',
    members: [
      { id: 'm1', name: 'Maya Osei',    handle: 'maya.feed',  initials: 'MO', city: 'Accra',    country: 'Ghana',  online: true,  streak: 31, mutuals: 8,  accent: '#34D399', bio: 'Making memories across continents.' },
      { id: 'm2', name: 'David Osei',   handle: 'david.feed', initials: 'DO', city: 'London',   country: 'UK',     online: false, streak: 12, mutuals: 6,  accent: '#60A5FA', bio: 'Architect. Dad. Coffee enthusiast.' },
      { id: 'm3', name: 'Grace Mensah', handle: 'grace.feed', initials: 'GM', city: 'Toronto',  country: 'Canada', online: true,  streak: 5,  mutuals: 5,  accent: '#F472B6', bio: 'Nurse, mother, storyteller.' },
      { id: 'm4', name: 'Kwame Osei',   handle: 'kwame.feed', initials: 'KO', city: 'New York', country: 'USA',    online: false, streak: 0,  mutuals: 7,  accent: '#FBBF24', bio: 'Tech by day, music by night.' },
      { id: 'm5', name: 'Abena Darko',  handle: 'abena.feed', initials: 'AD', city: 'Accra',    country: 'Ghana',  online: true,  streak: 18, mutuals: 8,  accent: '#A78BFA', bio: 'Home is where the jollof is.' },
    ],
    posts: [
      { id: 'p1', memberId: 'm1', text: "Finally made it home for the holidays. The smell of Mom's kitchen could cure anything. +family +accra", mood: 'Joyful',     moodColor: '#34D399', city: 'Accra',   ts: '1h ago',  likes: 14, comments: 6 },
      { id: 'p2', memberId: 'm3', text: 'Caught myself smiling at an old photo of all of us. Miss when we were all in the same city. +throwback',     mood: 'Reflective', moodColor: '#6366F1', city: 'Toronto', ts: '3h ago',  likes: 22, comments: 11 },
      { id: 'p3', memberId: 'm2', text: 'Sunday roast tradition continues, even 5000km away from where it started. +london +family',                  mood: 'Hopeful',    moodColor: '#10B981', city: 'London',  ts: '1d ago',  likes: 9,  comments: 3 },
    ],
    collections: [
      { id: 'col1', name: 'Family Trips',  count: 34,  cover: '#34D399', emoji: '✈️' },
      { id: 'col2', name: 'Old Photos',    count: 128, cover: '#F59E0B', emoji: '📷' },
      { id: 'col3', name: 'Celebrations', count: 47,  cover: '#F472B6', emoji: '🎉' },
    ],
  },
  {
    id: 'friends',
    name: 'Friends',
    emoji: '😄',
    color: '#60A5FA',
    colorRgb: '96,165,250',
    description: 'The crew. The ones who get it.',
    memberCount: 24,
    lastActive: '11m ago',
    chatPreview: 'Leo: anyone up for the meetup?',
    members: [
      { id: 'f1', name: 'Leo Toronto',   handle: 'leo.feed',   initials: 'LT', city: 'Toronto', country: 'Canada', online: true,  streak: 8,  mutuals: 12, accent: '#60A5FA', bio: 'Chasing sunsets and good playlists.' },
      { id: 'f2', name: 'Sofia Nairobi', handle: 'sofia.feed', initials: 'SN', city: 'Nairobi', country: 'Kenya',  online: false, streak: 0,  mutuals: 9,  accent: '#F472B6', bio: 'Writer. Wanderer. Tea not coffee.' },
      { id: 'f3', name: 'Alex Tokyo',    handle: 'alex.feed',  initials: 'AT', city: 'Tokyo',   country: 'Japan',  online: true,  streak: 3,  mutuals: 7,  accent: '#A78BFA', bio: 'Finding the quiet in the loud.' },
      { id: 'f4', name: 'Priya Mumbai',  handle: 'priya.feed', initials: 'PM', city: 'Mumbai',  country: 'India',  online: true,  streak: 21, mutuals: 15, accent: '#FB923C', bio: 'Design + chaos + chai.' },
      { id: 'f5', name: 'Omar Cairo',    handle: 'omar.feed',  initials: 'OC', city: 'Cairo',   country: 'Egypt',  online: false, streak: 14, mutuals: 8,  accent: '#FBBF24', bio: 'History student, future archaeologist.' },
      { id: 'f6', name: 'Yaw Darko',     handle: 'yaw.feed',   initials: 'YD', city: 'Accra',   country: 'Ghana',  online: true,  streak: 45, mutuals: 20, accent: '#34D399', bio: 'Music is the only language.' },
    ],
    posts: [
      { id: 'fp1', memberId: 'f1', text: 'The meetup was everything. We need to do this every month. +toronto +community',                               mood: 'Electric', moodColor: '#F59E0B', city: 'Toronto', ts: '11m ago', likes: 31, comments: 14 },
      { id: 'fp2', memberId: 'f4', text: 'Monsoon season just hit Mumbai. The city smells different today — earthy, alive. +mumbai +monsoon',            mood: 'Curious',  moodColor: '#8B5CF6', city: 'Mumbai',  ts: '4h ago',  likes: 44, comments: 8 },
      { id: 'fp3', memberId: 'f6', text: "New track dropping this Friday. The beat came to me at 3am and I didn't sleep till it was done.",             mood: 'Electric', moodColor: '#F59E0B', city: 'Accra',   ts: '6h ago',  likes: 88, comments: 33 },
    ],
    collections: [
      { id: 'fc1', name: 'Meetup Moments',  count: 56, cover: '#60A5FA', emoji: '🎉' },
      { id: 'fc2', name: 'Recommendations', count: 23, cover: '#34D399', emoji: '📌' },
    ],
  },
  {
    id: 'creative',
    name: 'Creative',
    emoji: '🎨',
    color: '#A78BFA',
    colorRgb: '167,139,250',
    description: 'Makers, thinkers, builders, dreamers.',
    memberCount: 11,
    lastActive: '2h ago',
    chatPreview: 'Lena: new project in the works 👀',
    members: [
      { id: 'c1', name: 'Lena Müller',  handle: 'lena.feed',  initials: 'LM', city: 'Berlin', country: 'Germany', online: true,  streak: 14, mutuals: 6, accent: '#A78BFA', bio: 'Type designer. Lives in coffee shops.' },
      { id: 'c2', name: 'Kofi Anan',    handle: 'kofi.feed',  initials: 'KA', city: 'Accra',  country: 'Ghana',   online: false, streak: 7,  mutuals: 4, accent: '#F472B6', bio: 'Photographer. Every city tells a story.' },
      { id: 'c3', name: 'Yuki Tanaka',  handle: 'yuki.feed',  initials: 'YT', city: 'Kyoto',  country: 'Japan',   online: true,  streak: 60, mutuals: 9, accent: '#34D399', bio: 'Illustrator. Obsessed with negative space.' },
      { id: 'c4', name: 'Amara Diallo', handle: 'amara.feed', initials: 'AD', city: 'Dakar',  country: 'Senegal', online: false, streak: 3,  mutuals: 5, accent: '#FBBF24', bio: 'Filmmaker. Looking for the human in everything.' },
    ],
    posts: [
      { id: 'cp1', memberId: 'c3', text: 'Finished the 30-day illustration series. What started as discipline became obsession. +art +daily', mood: 'Ambitious', moodColor: '#EF4444', city: 'Kyoto',  ts: '2h ago', likes: 112, comments: 38 },
      { id: 'cp2', memberId: 'c1', text: 'Presenting the new typeface at Typo Berlin next month. The glyphs finally feel alive. +type +design', mood: 'Hopeful',   moodColor: '#10B981', city: 'Berlin', ts: '1d ago', likes: 67,  comments: 22 },
    ],
    collections: [
      { id: 'cc1', name: 'Inspiration',      count: 89, cover: '#A78BFA', emoji: '💡' },
      { id: 'cc2', name: 'Work in Progress', count: 12, cover: '#F472B6', emoji: '🛠️' },
      { id: 'cc3', name: 'References',       count: 45, cover: '#60A5FA', emoji: '📚' },
    ],
  },
  {
    id: 'work',
    name: 'Work',
    emoji: '💼',
    color: '#94A3B8',
    colorRgb: '148,163,184',
    description: 'Collaborators and professional connections.',
    memberCount: 16,
    lastActive: '1d ago',
    chatPreview: 'Priya: New issue is live!',
    members: [
      { id: 'w1', name: 'James Park',   handle: 'james.feed', initials: 'JP', city: 'Seoul',  country: 'Korea', online: false, streak: 2, mutuals: 3, accent: '#60A5FA', bio: "Product @ Kakao. Building what's next." },
      { id: 'w2', name: 'Amira Hassan', handle: 'amira.feed', initials: 'AH', city: 'Dubai',  country: 'UAE',   online: true,  streak: 9, mutuals: 7, accent: '#FBBF24', bio: 'VC. Betting on African founders.' },
      { id: 'w3', name: 'Tom Clarke',   handle: 'tom.feed',   initials: 'TC', city: 'London', country: 'UK',    online: false, streak: 0, mutuals: 4, accent: '#94A3B8', bio: 'Consultant. Strategy is just storytelling.' },
    ],
    posts: [
      { id: 'wp1', memberId: 'w2', text: 'Just closed our third African fintech deal this quarter. The momentum is real. +fintech +africa', mood: 'Ambitious', moodColor: '#EF4444', city: 'Dubai', ts: '1d ago', likes: 54, comments: 17 },
    ],
    collections: [
      { id: 'wc1', name: 'Resources',    count: 31, cover: '#94A3B8', emoji: '📎' },
      { id: 'wc2', name: 'Case Studies', count: 18, cover: '#60A5FA', emoji: '📊' },
    ],
  },
];

export const MOOD_COLORS: Record<string, string> = {
  Electric: '#F59E0B', Reflective: '#6366F1', Hopeful: '#10B981',
  Curious: '#8B5CF6', Joyful: '#34D399', Calm: '#06B6D4',
  Ambitious: '#EF4444', Ancient: '#D97706', Silent: '#94A3B8',
};
