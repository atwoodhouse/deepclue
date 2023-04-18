import { messages, type Message, state } from "./stores";

export const communicate = async (messagesToSend: Message[]) => {
  state.update((s) => ({ ...s, waitingForAI: true }));

  try {
    const res = await fetch("/api", {
      method: "POST",
      body: JSON.stringify({ messages: messagesToSend }),
    });
    const newMessage: Message = await res.json();
    messages.addFromAssistant(newMessage);
  } catch {
    alert("API error.");
  }
};
