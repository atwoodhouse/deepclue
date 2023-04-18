<script lang="ts">
	import { onMount } from "svelte";
	import { messages, state, type Message } from "./lib/server/stores";

    onMount(() => {
        const message: Message = {"role":"assistant","content":"Room: Library\nVictim: Mrs. Peacock\nWeapon: Candlestick\nText: As you arrive at the castle, you are greeted by James the Butler. He asks for your name and a brief description of your appearance. After a few short pleasantries, he leads you to the Library where you discover the lifeless body of Mrs. Peacock lying on the floor, with a candlestick lying next to her. \n\nQuestions: 20\nPeople: Dr. Orchid, Colonel Mustard, Professor Plum, Miss Scarlet, Mr. Green\nText: All of the characters have been assembled in the room to be questioned. Dr. Orchid is nervously fidgeting with her lab coat, while Colonel Mustard stands with his arms crossed looking defensive. Professor Plum is muttering to himself, while Miss Scarlet is preening her hair, and Mr. Green is pacing back and forth.\n\nWhat would you like to ask first?"};
        messages.addFromAssistant(message);
    });
</script>

<h1>DeepClue</h1>
<p>Room: {$state.room}</p>
<p>Victim: {$state.victim}</p>
<p>Weapon: {$state.weapon}</p>
<p>Questions left: {$state.questions}</p>
<p>People talking right now, that should be visualized: {$state.people.join(", ")}</p>

<div class="texts">
    {#each $state.paragraphs as { who, text }}
        <p class:you={who === "you"}>{text}</p>
    {/each}
</div>

<style>
    :global(html) {
        background-color: #111;
        color: #fff;
    }
    .texts {
        background-color: #333;
        padding: 1rem;
    }
    .you {
        font-weight: 700;
    }
</style>
