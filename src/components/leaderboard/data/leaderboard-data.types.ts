import { ChallengeDTO } from "shared/types/dto"

export interface UserData {
  user: string;
  stars: StarData[];
  totalTime: number;
  score: number;
}

export interface StarData {
  day: number;
  one: boolean;
  two: boolean;
}

export interface LeaderBoardInfoDTO {
  name: string;
  challenges: ChallengeDTO[]
}

export interface LeaderBoardData {
  year: number;
  day: number;
  username: string;
  startTime: Date;
  starOne: Date;
  starTwo: Date;
  timeTakenMsOne: number;
  timeTakenMsTwo: number;
}
 
export interface ScoreData {
  timeTakenMsOne: number;
  timeTakenMsTwo: number;
  totalTimeTakenMs: number;
  score: number;
}

export interface ScoreDataUserName extends ScoreData {
  username: string;
  day: number;
}