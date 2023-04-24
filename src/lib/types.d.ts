
export type Stage = 1 | 2 | 3 | 4;

export type Tension = "Calm" | "Tense";

interface Paragraph {
  who: string;
  text: string;
  stage: number;
}

export interface State {
  stage: Stage;
  error: boolean;
  waitingForAI: boolean;
  room: string;
  victim: string;
  weapon: string;
  murderer: string;
  accused: string | null;
  courtDone: boolean;
  tension: Tension;
  questions: number;
  people: string[];
  paragraphs: Paragraph[];
}

export interface Message {
  role: "system" | "assistant" | "user";
  content: string;
  stage: Stage;
}

interface Meta {
  victim: string;
  murderer: string;
  room: string;
  weapon: string;
}
