import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "$env/static/private";
import { getSystemPrompt } from "$lib/server/getSystemPrompt";
import { dev } from "$app/environment";

export async function POST({ request }) {
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const { questioning, court, meta } = await request.json();

  console.log("asking question");

  const systemPrompts = [getSystemPrompt(meta, 0)];

  if (questioning.length) {
    systemPrompts.push(getSystemPrompt(meta, 1));
  }

  let messages = [...systemPrompts, ...questioning];

  if (meta.accused) {
    messages = [
      ...messages,
      getSystemPrompt(meta, 2),
      ...court,
    ];
  }
  
  if (meta.courtDone) {
    messages = [
      ...messages,
      getSystemPrompt(meta, 3),
    ];
  }

  console.log("messages to send", messages);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });

  console.log(JSON.stringify(completion.data));

  const response = new Response(JSON.stringify(completion.data.choices[0].message));

  if(!dev) {
    response.headers.append("Access-Control-Allow-Origin", "https://deepclue.vercel.app");
  }

  return response;
}
