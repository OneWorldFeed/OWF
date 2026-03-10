export type SignalMood = "wonder" | "cosmos" | "earth" | "aurora" | "fire"

export type Signal = {
  id:         string
  mood:       SignalMood
  category:   string
  region:     string
  title:      string
  location:   string
  blurb:      string
  whyMatters: string
  thumb:      string
  viewers:    string
  duration:   "LIVE" | string
  tags:       string[]
  highlights: string[]
  type:       "stream" | "article"
  streamUrl:  string | null
  articleUrl: string | null
}
