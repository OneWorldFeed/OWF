export interface Message {
  id:        string;
  senderId:  string;
  text:      string;
  ts:        string;          // display time e.g. "2:41 PM"
  reactions?: string[];
}

export interface Conversation {
  id:          string;
  name:        string;
  avatar:      string;        // emoji or initials
  lastMsg:     string;
  ts:          string;
  unread?:     number;
  online?:     boolean;
  group?:      boolean;

  // Streak fields
  streak?:     number;        // current streak days
  milestone?:  boolean;       // streak just hit a major tier
  atRisk?:     boolean;       // streak expires today
  broken?:     boolean;       // streak was broken
  lastStreak?: number;        // last streak before broken
  started?:    string;        // "Jan 9, 2025"
  longest?:    number;        // all-time longest
}
