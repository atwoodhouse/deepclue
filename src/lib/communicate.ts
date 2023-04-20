import { get } from "svelte/store";
import { messages, type Message, state } from "./stores";

export const communicate = async (messagesToSend: Message[]) => {
  state.update((s) => ({ ...s, waitingForAI: true }));

  const { victim, murderer, room, weapon } = get(state);

  try {
    const res = await fetch("https://deepclue-api.vercel.app/api", {
      method: "POST",
      body: JSON.stringify({
        messages: messagesToSend,
        meta: {
          victim, murderer, room, weapon
        }
      }),
    });

    if(!res.ok) throw new Error();

    const newMessage: Message = await res.json();
    messages.addFromAssistant(newMessage);
  } catch {
    state.update(s => ({ ...s, error: true }));
  }
};
