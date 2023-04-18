import { get, writable, type Writable } from "svelte/store";
import { communicate } from "./communicate";

interface Paragraph {
  who: string;
  text: string;
}

interface State {
  waitingForAI: boolean;
  room: string;
  victim: string;
  weapon: string;
  tension: string;
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
  waitingForAI: false,
  room: "",
  victim: "",
  weapon: "",
  murderer: "",
  tension: "Calm",
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
    } else if (line.startsWith("Tension: ")) {
      state.update((s) => ({ ...s, tension: line.replace("Tension: ", "") }));
    } else if (line.startsWith("Murderer: ")) {
      state.update((s) => ({ ...s, murderer: line.replace("Murderer: ", "") }));
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
  },
  addFromUser: (text: string) => {
    const contentToSend = `Question ${21 - get(state).questions} (out of 20): ${text}

    Format of the question responses:
    Questions: <number of questions left>
    People: <characters names that are talking in this response, comma separated if multiple people are talking in the response>
    Tension: <either "Tense" or "Calm", depending on if this specific text is more or less tense than average in this conversation>
    Text: <text output>`;

    console.log({contentToSend});

    const messagesAfterAdd = [
      ...get(_messages),
      {
        role: "user",
        content: contentToSend,
      } as Message
    ];
    _messages.set(messagesAfterAdd);
    communicate(messagesAfterAdd);
    state.update((s) => ({ ...s, paragraphs: [...s.paragraphs, { who: "you", text }] }));
  },
};
