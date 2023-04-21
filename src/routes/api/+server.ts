import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "$env/static/private";
import { getSystemPrompt } from "$lib/server/getSystemPrompt";

export async function POST({ request }) {
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const { questioning, court, meta } = await request.json();

  console.log("asking question");

  const systemPrompts = [{ role: "system", content: getSystemPrompt(meta) }];

  if (questioning.length) {
    systemPrompts.push({
      role: "system",
      content: `As questions are being answered, it shouldn't be hard to figure out who the murderer is. The murderer should try to conceal it, but not very good.

      Format of the question responses:
      People: <characters names that are talking in this response, as they were defined in the system prompt, comma separated if multiple people are talking in the response>
      Tension: <either "Tense" or "Calm", depending on if this specific text is more or less tense than average in this conversation>
      Text: <text output, which can contain clues of who the murderer is>`,
    });
  }

  let messages = [...systemPrompts, ...questioning];

  if (meta.accused) {
    messages = [
      ...messages,
      {
        role: "system",
        content: `I, the detective, have now decided that I believe that ${meta.accused} is the murderer.
      Now we move from the castle into the court room. In the court room I will act as the prosecutor, trying to convice the jury (12 people) that ${meta.accused} actually murdered ${meta.victim}.
      In the court room there's a judge who always yells "ORDER, ORDER!" who hands over the word to either me or the defendants attorney.
      The defending attorney is called Ace. He is briefed on everything that was said during the interrogation at the castle and will do his utmost to defend ${meta.accused}.
      The prosecutor and the attorney Ace take turns, with the prosecutor first being allowed to give his case. They both go two rounds, and then the jury will come with it's verdict.
      The number of people in the jury of 12 that vote innocent and guily will be presented, and at least 7 people in the jury have to vote guilty in order for the accused to be found guilty and put in prison.`,
      },
      ...court,
    ];
  }

  console.log("messages to send", messages);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });

  console.log(JSON.stringify(completion.data));

  const response = new Response(JSON.stringify(completion.data.choices[0].message));
  response.headers.append("Access-Control-Allow-Origin", "https://deepclue.vercel.app");
  return response;
}
