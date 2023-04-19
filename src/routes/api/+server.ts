import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "$env/static/private";
import { getSystemPrompt } from "$lib/server/getSystemPrompt";

export async function POST({ request }) {
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const { messages, meta } = await request.json();

  console.log("asking question");
  
  const systemPrompts = [{ role: "system", content: getSystemPrompt(meta) }];

  if(messages.length > 0) {
    systemPrompts.push({
      role: "system",
      content: `Format of the question responses:
      Questions: <number of questions left>
      People: <characters names that are talking in this response, as they were defined in the system prompt, comma separated if multiple people are talking in the response>
      Tension: <either "Tense" or "Calm", depending on if this specific text is more or less tense than average in this conversation>
      Text: <text output, which can contain clues of who the murderer is>`
    });
  }

  console.log("messages to send", [...systemPrompts, ...messages]);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [...systemPrompts, ...messages],
  });

  console.log(JSON.stringify(completion.data));

  const response = new Response(JSON.stringify(completion.data.choices[0].message));
  //response.headers.append("Access-Control-Allow-Origin", "https://deepclue.vercel.app");
  return response;
}
