import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "$env/static/private";
import { systemPrompt } from "$lib/server/systemPrompt";

export async function POST({ request }) {
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const { messages } = await request.json();

  console.log("asking question");

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  console.log(JSON.stringify(completion.data));

  const response = new Response(JSON.stringify(completion.data.choices[0].message));
  response.headers.append("Access-Control-Allow-Origin", "https://deepclue.vercel.app");
  return response;
}
