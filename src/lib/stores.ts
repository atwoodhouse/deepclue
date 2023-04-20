import { get, writable, type Writable } from "svelte/store";
import { communicate } from "./communicate";

interface Paragraph {
  who: string;
  text: string;
}

interface State {
  stage: 1 | 2;
  error: boolean;
  waitingForAI: boolean;
  room: string;
  victim: string;
  weapon: string;
  murderer: string;
  tension: string;
  questions: number;
  people: string[];
  paragraphs: Paragraph[];
}

export interface Message {
  role: "system" | "assistant" | "user";
  content: string;
}

const availableRooms = ["Ball Room", "Billiard Room", "Conservatory", "Kitchen", "Hall", "Cellar", "Lounge", "Library", "Study"];
const availableCharacters = ["Doctor Orchid", "Colonel Mustard", "Professor Plum", "Miss Scarlet", "Mrs. Peacock", "Mr. Green"];
const availableWeapons = ["knife", "revolver", "rope", "wrench", "candlestick", "lead pipe"];

const pickOne = (array: string[]) => array[Math.floor(Math.random() * array.length)];
const victim = pickOne(availableCharacters);

const _messages: Writable<Message[]> = writable([]);
export const state: Writable<State> = writable({
  stage: 1,
  error: false,
  waitingForAI: false,
  room: pickOne(availableRooms),
  victim: victim,
  weapon: pickOne(availableWeapons),
  murderer: pickOne(availableCharacters.filter(c => c !== victim)),
  tension: "Calm",
  questions: 10,
  people: [],
  paragraphs: [],
});

const parseMessage = (message: Message) => {
  const lines = message.content.split("\n");
  lines.forEach((line) => {
    if (line.startsWith("Questions: ")) {
      state.update((s) => ({ ...s, questions: Number(line.replace("Questions: ", "")) }));
    } else if (line.startsWith("People: ")) {
      state.update((s) => ({ ...s, people: line.replace("People: ", "").split(", ") }));
    } else if (line.startsWith("Tension: ")) {
      state.update((s) => ({ ...s, tension: line.replace("Tension: ", "") }));
    } else {
      state.update((s) => ({
        ...s,
        paragraphs: [...s.paragraphs, { who: "game", text: line.replace("Text: ", "") }],
      }));
    }
  });
};

export const messages = {
  ..._messages,
  addFromAssistant: (message: Message) => {
    state.update(s => ({ ...s, waitingForAI: false }));
    _messages.update((m) => [...m, message]);
    parseMessage(message);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 200); 
  },
  addFromUser: (text: string) => {
    const contentToSend = `Question ${11 - get(state).questions} (out of 10): ${text}`;

    const messagesAfterAdd = [
      ...get(_messages),
      {
        role: "user",
        content: contentToSend,
      } as Message
    ];
    _messages.set(messagesAfterAdd);
    communicate(messagesAfterAdd);
    state.update((s) => ({
      ...s,
      questions: Math.max(s.questions - 1, 0),
      paragraphs: [...s.paragraphs, { who: "you", text }]
    }));
  },
};
