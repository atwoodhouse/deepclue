import { get, writable, type Writable } from "svelte/store";
import { communicate } from "./communicate";
import { accuse, vote } from "./actions";
import { people, rooms, weapons } from "./world";
import type { Message, State, Tension } from "./types";

const pickOne = (array: string[]) => array[Math.floor(Math.random() * array.length)];
const victim = pickOne(people.map(({ name }) => name));

const _messages: Writable<Message[]> = writable([]);
export const state: Writable<State> = writable({
  stage: 1,
  error: false,
  waitingForAI: false,
  room: pickOne(rooms),
  victim: victim,
  weapon: pickOne(weapons),
  murderer: pickOne(people.map(({ name }) => name).filter((c) => c !== victim)),
  accused: null,
  courtDone: false,
  tension: "Calm",
  questions: 20,
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
      state.update((s) => ({ ...s, tension: line.replace("Tension: ", "") as Tension }));
    } else {
      state.update((s) => ({
        ...s,
        paragraphs: [
          ...s.paragraphs,
          { who: "game", text: line.replace("Text: ", ""), stage: message.stage },
        ],
      }));
    }
  });
};

export const messages = {
  ..._messages,
  addFromAssistant: (message: Message) => {
    const { stage } = get(state);
    const messageWithStage = { ...message, stage };

    state.update((s) => ({ ...s, waitingForAI: false }));
    _messages.update((m) => [...m, messageWithStage]);
    parseMessage(messageWithStage);

    if (get(state).questions === 0 && stage === 1) {
      state.update((s) => ({ ...s, questions: 5 }));
      accuse();
    } else if (get(state).questions === 0 && stage === 3) {
      vote();
    }

    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 200);
  },
  addFromUser: (text: string) => {
    const contentToSend = `Question ${21 - get(state).questions} (out of 20): ${text}`;

    const messagesAfterAdd = [
      ...get(_messages),
      {
        role: "user",
        content: contentToSend,
        stage: get(state).stage,
      } as Message,
    ];
    _messages.set(messagesAfterAdd);
    communicate(messagesAfterAdd);
    state.update((s) => ({
      ...s,
      questions: Math.max(s.questions - 1, 0),
      paragraphs: [...s.paragraphs, { who: "you", text, stage: get(state).stage }],
    }));
  },
};
