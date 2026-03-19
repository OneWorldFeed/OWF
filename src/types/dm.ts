export interface BadgePalette {
  bg: string; card: string; body: string; face: string;
  eye: string; halo: string; haloBright: string;
  ring: string; accent: string; text: string;
}

export interface Message {
  id:        string;
  senderId:  string;
  text:      string;
  ts:        string;          // display time e.g. "2:41 PM"
  reactions?: string[];
}

export interface CycleBadge {
  id:       string;
  cycle:    number;
  name:     string;
  meaning:  string;
  story:    string;
  palette: {
    bg: string; card: string; body: string; face: string;
    eye: string; halo: string; haloBright: string;
    ring: string; accent: string; text: string;
  };
  stars:      boolean;
  crescent:   boolean;
  rays:       boolean;
  leaves:     boolean;
  tealGlow:   boolean;
  cosmicRing?: boolean;
  horns?:     boolean;
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
