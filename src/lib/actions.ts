import { get } from "svelte/store";
import { communicate } from "./communicate";
import { messages, state } from "./stores";

export const accuse = () => {
  state.update((s) => ({ ...s, stage: 2 }));
  setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 200);
};

export const vote = () => {
  state.update((s) => ({ ...s, stage: 4, courtDone: true }));
  setTimeout(() => communicate(get(messages)), 200);
};
