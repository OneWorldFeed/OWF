export type SignalMood = "wonder" | "cosmos" | "earth" | "aurora" | "fire"

export type SignalCategory = "news" | "music" | "podcast" | "social" | "discover" | "general"

export type SignalMediaType = "text" | "image" | "image-vertical" | "video-horizontal" | "video-vertical"

export type SignalInteractions = {
  likes:     number
  comments:  number
  reposts:   number
  bookmarks: number
  reach:     { cities: number; countries: number }
}

export type Signal = {
  id:             string
  mood:           SignalMood
  category:       SignalCategory
  region:         string
  title:          string
  location:       string
  blurb:          string
  whyMatters:     string
  thumb:          string
  viewers:        string
  duration:       "LIVE" | string
  tags:           string[]
  highlights:     string[]
  type:           "stream" | "article"
  streamUrl:      string | null
  articleUrl:     string | null
  authorHandle?:  string
  authorAvatar?:  string
  mediaType?:     SignalMediaType
  mediaUrl?:      string
  repostedBy?:    { handle: string; displayName: string }
  interactions?:  SignalInteractions
  collectionTags?: string[]
}
