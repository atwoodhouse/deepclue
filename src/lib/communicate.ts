import { dev } from "$app/environment";
import { get } from "svelte/store";
import { messages, state } from "./stores";
import type { Message, Stage } from "./types";

const API_URL = dev
  ? "/api"
  : "https://deepclue-api.vercel.app/api"

const filterByStage = (messagesToSend: Message[], targetStage: Stage) =>
  messagesToSend
    .filter(({ stage }) => stage === targetStage)
    .map((m) => ({ role: m.role, content: m.content }));

export const communicate = async (messagesToSend: Message[] = []) => {
  state.update((s) => ({ ...s, waitingForAI: true }));

  const { victim, murderer, room, weapon, accused, courtDone } = get(state);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        questioning: filterByStage(messagesToSend, 1),
        court: filterByStage(messagesToSend, 3),
        meta: {
          victim,
          murderer: get(state).stage === 1 ? murderer : "unknown",
          room,
          weapon,
          accused,
          courtDone
        },
      }),
    });

    if (!res.ok) throw new Error();

    const newMessage: Message = await res.json();
    messages.addFromAssistant(newMessage);
  } catch {
    state.update((s) => ({ ...s, error: true }));
  }
};
