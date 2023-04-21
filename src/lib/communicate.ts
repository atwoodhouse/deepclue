import { get } from "svelte/store";
import { messages, type Message, state, type Stage } from "./stores";

const filterByStage = (messagesToSend: Message[], targetStage: Stage) =>
  messagesToSend
    .filter(({ stage }) => stage === targetStage)
    .map((m) => ({ role: m.role, content: m.content }));

export const communicate = async (messagesToSend: Message[] = []) => {
  state.update((s) => ({ ...s, waitingForAI: true }));

  const { victim, murderer, room, weapon, accused, courtDone } = get(state);

  try {
    const res = await fetch("https://deepclue-api.vercel.app/api", {
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
