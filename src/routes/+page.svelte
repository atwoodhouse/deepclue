<script lang="ts">
  import "@fontsource/special-elite";
  import "@fontsource/electrolize";
  import { onMount } from "svelte";
  import { messages, state, type Message } from "$lib/stores";

  onMount(() => {
    const message: Message = {
      role: "assistant",
      content:
        "Room: Library\nVictim: Mrs. Peacock\nWeapon: Candlestick\nText: As you arrive at the castle, you are greeted by James the Butler. He asks for your name and a brief description of your appearance. After a few short pleasantries, he leads you to the Library where you discover the lifeless body of Mrs. Peacock lying on the floor, with a candlestick lying next to her. \n\nQuestions: 20\nPeople: Dr. Orchid, Colonel Mustard, Professor Plum, Miss Scarlet, Mr. Green\nText: All of the characters have been assembled in the room to be questioned. Dr. Orchid is nervously fidgeting with her lab coat, while Colonel Mustard stands with his arms crossed looking defensive. Professor Plum is muttering to himself, while Miss Scarlet is preening her hair, and Mr. Green is pacing back and forth.\n\nWhat would you like to ask first?",
    };
    messages.addFromAssistant(message);
  });
</script>

<header>
  <h1>DeepClue</h1>

  <div class="state">
    <p>Room: <span>{$state.room}</span></p>
    <p>Victim: <span>{$state.victim}</span></p>
    <p>Weapon: <span>{$state.weapon}</span></p>
    <p>Questions left: <span>{$state.questions}</span></p>
    <p>People talking right now, that should be visualized: <span>{$state.people.join(", ")}</span></p>
  </div>
</header>

<div class="story">
  {#each $state.paragraphs as { who, text }}
    <p class:you={who === "you"}>{text}</p>
  {/each}
</div>


<style>
  :global(*) {
    box-sizing: border-box;
  }
  :global(body) {
    background-color: #111;
    color: #fff;
    font-family: "Electrolize", sans-serif;
    line-height: 1.5;
  }

  header {
    position: sticky;
    top: 1rem;
  }
  h1 {
    position: absolute;
    top: 0;
    left: 0;
    font-family: "Special Elite", cursive;
    font-size: 5rem;
  }

  .state {
    max-width: 300px;
    margin: 1rem 1rem 1rem auto;
    padding: 1rem;
    background-color: #f65c51;
    color: #000;
  }
  .state p {
    margin: 0.25rem;
    font-size: 0.75rem;
  }
  .state p span {
    font-size: 1.25rem;
    font-family: "Special Elite", cursive;
  }
  .story {
    background-color: #333;
    padding: 1rem;
    width: 90%;
    max-width: 60rem;
    margin: 2rem auto 6rem;
    font-size: 1.25rem;
  }
  .you {
    font-weight: 700;
  }
</style>
