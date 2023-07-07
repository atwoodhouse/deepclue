# DeepClue

AI based detective game, inspired by Cluedo. Powered by the powerful large language AI model GPT-4. Written in SvelteKit using Typescript.

## How to play
When the game begins one of the six people in the castle has just been murdered. But who of the remaining five is the murderer? That's for you to find out, detective.

GPT plays all the characters and will react to any questions you ask. Interrogate the five and find out who the murderer is. When you think you've figured it out, and have gathered enough evidence, click the Accuse button to drag the culprit to court.

Now the game will take a turn to become an Ace Attorney inspired court game, where it's up to you to present your evidence in a convincing way, so that the jury votes to find the murderer guilty. It won't be easy, because GPT will act attorney to defend the accused! When you've presented all your evidence, click "Let jury vote" and cross your fingers!

## Prerequisites

This project requires Node 18. It's recommended to install Node 18 via [nvm](https://github.com/nvm-sh/nvm).

The project uses pnpm as its package manager. Install pnpm with:
```bash
npm i -g pnpm
```

## Develop

Clone the project.

Add your own OPENAI_API_KEY to .env.

Install the project.

```bash
pnpm i
```

Run the project in dev mode, with hot reloading.

```bash
pnpm dev
```
