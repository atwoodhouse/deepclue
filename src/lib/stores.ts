import { writable, type Writable } from "svelte/store";

interface Paragraph {
  who: string;
  text: string;
}

interface State {
  room: string;
  victim: string;
  weapon: string;
  questions: number;
  people: string[];
  paragraphs: Paragraph[];
}

export interface Message {
  role: "system" | "assistant" | "user";
  content: string;
}

const _messages: Writable<Message[]> = writable([]);
export const state: Writable<State> = writable({
  room: "",
  victim: "",
  weapon: "",
  questions: 20,
  people: [],
  paragraphs: [],
});

const parseMessage = (message: Message) => {
  const lines = message.content.split("\n");
  lines.forEach((line) => {
    if (line.startsWith("Room: ")) {
      state.update((s) => ({ ...s, room: line.replace("Room: ", "") }));
    } else if (line.startsWith("Victim: ")) {
      state.update((s) => ({ ...s, victim: line.replace("Victim: ", "") }));
    } else if (line.startsWith("Weapon: ")) {
      state.update((s) => ({ ...s, weapon: line.replace("Weapon: ", "") }));
    } else if (line.startsWith("Questions: ")) {
      state.update((s) => ({ ...s, questions: Number(line.replace("Questions: ", "")) }));
    } else if (line.startsWith("People: ")) {
      state.update((s) => ({ ...s, people: line.replace("People: ", "").split(",") }));
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
    _messages.update((m) => [...m, message]);
    parseMessage(message);
  },
  addFromUser: (text: string) => {
    _messages.update((m) => [
      ...m,
      {
        role: "user",
        content: text,
      },
    ]);
    state.update((s) => ({ ...s, paragraphs: [...s.paragraphs, { who: "you", text }] }));
  },
};
