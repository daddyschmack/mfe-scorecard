export interface GolfCourse {
  allowShots: boolean;
  allowgps: boolean;
  course: Course;
  address?: string;
  holes: GolfHole[];
  path: string;
  robot: false;
  showLoginPrompt: boolean;
}

export interface Course {
  abbr: string;
  cover: string;
  handle: string;
  hasAriel: boolean;
  name: string;
  nameAmplitude: string;
  path: string;
  profilePhoto: string
  selectedtee: string;
  selectedteeid: string;
  tees: TeeBox[];
  tee: TeeBox;
  unit: "Yards" | "Meter";
}
export interface GolfRound{
  golfer: User;
  golfCourse?: Partial<GolfCourse>; // name id
  teeBox: Partial<TeeBox>; // color, par, slope, id, type
  round_date: Date;
  player_score: StatTotal[];
  summary_score: StatTotal;
  id: string;
}
export interface GolfHole {
  id?: string;
  holeNum: number;
  par: number;
  teeBoxes: TeeBox[];
}

export interface HoleData {
    par: number;
    distance?: number;
    hcap: number;
    isTotal?: boolean;
}

export interface TeeBox {
  // type: teeType; // champtonshipt, mens, seniors, womens, etc
  par: number;
  side: number; // 0 or 1
  color: string; // gold,
  distancethishole: number; // 318,
  iscustom: false,
  rating: string; //67.1,
  tourneyuuid: null,
  slope: number; //  113,
  type: string; // MEN,
  uuid: string; // 66ab7c04-f9b1-46f2-9df9-6d41ff6047bc,
  hasHoleAllocations: boolean; // true,
  unit: string; //  yds,
  extra:  string; // 5525 yds (M-67.1\/113),
  holeinfo: HoleData[];
  holes: any[];
}

export type teeType = 'Championship' | 'Back' | 'Men' | 'Senior' | 'Women' | 'Combo-Champtionship' | 'Combo-Back' | 'Combo-Middle' | 'Combo-Front'

export interface HoleData {
    par: number;
    distance?: number;
    hcap: number;
}

export interface StatTotal {
  playTime?: Date;
  holeNumber?: number;
  holeHandicap?:number;
  teeUUID?: string,
  teeColor?: string;
  totalScore: number ;
  netScore?: number;
  teeShots?: number;
  fairwayStrokes?: number;
  totalPutts?: number;
  totalChips?: number;
  greenInRegulation?: number;
  driveInFairway?: number;
  penaltyStrokes?:number;
}



export interface PlayerInfo {
  name: string;
  handicap?: number;
  GHIN?: number;
  email?: string;
  uid?: string;
}
export interface User {
  uid?: string;
  email: string;
  password: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  playerInfo?: PlayerInfo;
}

export interface GolfTeam {
  teamId: string;
  totalHandicap: number;
  roster: GolfRound[];
  score: TeamScore;
}


export interface TeamHoleScore{
  holeNumber: number;
  netScore: number;
  grossScore: number;
  outcome: 'w' | 'l';
}

export interface TeamScore {
  numberOfBalls: number; // Right now, just the number of golfers to count
  scoringType: 'net' | 'gross' | 'both';
  netScore: number;
  grossScore: number
  roundTime: number; // how many minutes it took to play
  roundDate: Date; // when the round was played
  roundScore: TeamHoleScore[];
}

export interface Game {
  id: string;
  courseId: string;
  playDate: Date;
  gameMode: 'Tournament' | 'Casual';
  rounds: GolfRound[]; // store all the golf round in the game for revisit
  teams: GolfTeam[];
}
