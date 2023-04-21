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
      Now we move from the castle into the court room. In the court room I am the prosecutor, trying to convice the jury (12 people) that ${meta.accused} actually murdered ${meta.victim}.
      You are the defending attorney, called Ace. You are briefed on everything that was said during the interrogation at the castle and will do your utmost to defend ${meta.accused}. Your personality is crazy and you often begin sentences with "OBJECTION!"
      I (prosecutor) and you (attorney Ace) take turns, with the prosecutor first being allowed to give his case.
      Give a short introduction of how we arrive at the court and ${meta.accused}'s reaction.
      Answer briefly and await the prosecutors arguments from the user.`,
      },
      ...court,
    ];
  }
  
  if (meta.courtDone) {
    messages = [
      ...messages,
      {
        role: "system",
        content: `Now you are a jury of 12 people who have to take into consideration all arguments that the prosecutor presented and all arguments that the defending attorney presented. Weigh them properly and then tell how many of the jury that vote that ${meta.accused} is guilty versus innocent.
        At least 7 out of 12 have to vote guilty for ${meta.accused} to be found guilty and put in prison. By default the jury members should vote innocent, unless the evidence put fourth in the court is strong.

        Response format:
        Vote innocent: <number of votes>
        Vote guilty: <number of votes>
        Text: <text output>`,
      },
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
