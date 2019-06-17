export interface PlayType {
  id: string
  description: string
}

export interface Team {
  id: string
  name: string
  abbreviation: string
  displayName: string
}

export interface AthletesInvolved {
  id: string
  name: string
  shortName: string
  displayName: string
}

export interface Athlete {
  id: string
  name: string
  shortName: string
  fullName: string
  displayName: string
}

export interface Bowler {
  athlete: Athlete
  team: Team
  maidens: number
  balls: number
  wickets: number
  overs: number
  conceded: number
}

export interface OtherBowler {
  athlete: Athlete
  team: Team
  maidens: number
  balls: number
  wickets: number
  overs: number
  conceded: number
}

export interface Batsman {
  athlete: Athlete
  team: Team
  totalRuns: number
  faced: number
  fours: number
  runs: number
  sixes: number
}

export interface OtherBatsman {
  athlete: Athlete
  team: Team
  totalRuns: number
  faced: number
  fours: number
  runs: number
  sixes: number
}

export interface Innings {
  id: string
  runRate: number
  remainingBalls: number
  byes: number
  number: number
  balls: number
  noBalls: number
  requiredRunRate: string
  wickets: number
  legByes: number
  ballLimit: number
  target: number
  session: number
  day: number
  fallOfWickets: number
  remainingRuns: string
  remainingOvers: number
  totalRuns: number
  wides: number
  runs: number
}

export interface Over {
  ball: number
  balls: number
  complete: boolean
  limit: number
  maiden: number
  noBall: number
  wide: number
  byes: number
  legByes: number
  number: number
  runs: number
  wickets: number
  overs: number
  actual: number
  unique: number
}

export interface Fielder {
  athlete: Athlete
}

export interface Dismissal {
  dismissal: boolean
  bowled: boolean
  type: string
  bowler: Bowler
  batsman: Batsman
  fielder: Fielder
  minutes: number
  retiredText: string
  text: string
}

export interface Ad {
  sport: string
  bundle: string
}

export interface Tracking {
  sportName: string
  leagueName: string
  coverageType: string
  trackingName: string
  trackingId: string
}

export interface DeviceRestrictions {
  type: string
  devices: string[]
}

export interface GeoRestrictions {
  type: string
  countries: string[]
}

export interface URI {
  href: string
}

export interface Api {
  self: URI
  artwork: URI
}

export interface Web {
  href: string
  short: URI
  self: URI
}

export interface HLS {
  href: string
  HD: URI
}

export interface Source {
  mezzanine: URI
  flash: URI
  hds: URI
  HLS: URI
  HD: URI
  full: URI
  href: string
}

export interface Mobile {
  alert: URI
  source: Source
  href: string
  streaming: URI
  progressiveDownload: URI
}

export interface Links {
  api: Api
  web: Web
  source: Source
  mobile: Mobile
}

export interface Media {
  source: string
  id: number
  headline: string
  description: string
  ad: Ad
  tracking: Tracking
  cerebroId: string
  lastModified: Date
  originalPublishDate: Date
  deviceRestrictions: DeviceRestrictions
  geoRestrictions: GeoRestrictions
  duration: number
  gameDay: number
  thumbnail: string
  links: Links
}

export interface Item {
  id: string
  clock: string
  date: string
  playType: PlayType
  team: Team
  mediaId: number
  period: number
  periodText: string
  preText: string
  text: string
  postText: string
  shortText: string
  homeScore: string
  awayScore: string
  scoreValue: number
  sequence: number
  athletesInvolved: AthletesInvolved[]
  speedKPH: string
  speedMPH: string
  bowler: Bowler
  otherBowler: OtherBowler
  batsman: Batsman
  otherBatsman: OtherBatsman
  innings: Innings
  over: Over
  dismissal: Dismissal
  media: Media
}

export interface Commentary {
  count: number
  pageIndex: number
  pageSize: number
  pageCount: number
  items: Item[]
}

export interface CommentaryData {
  commentary: Commentary
}
