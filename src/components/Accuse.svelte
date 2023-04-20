<script lang="ts">
  import { state } from "$lib/stores";
  import { people } from "$lib/world";

  let guess: string | null = null;
</script>

<div class="story">
  <h1>Time to guess!</h1>
  <p>Who murdered {$state.victim} with a {$state.weapon} in the {$state.room.toLowerCase()}?</p>
  {#if !guess}
    <div class="suspects">
    {#each people.filter(c => c.name !== $state.victim) as person (person.name)}
      <button on:click={() => (guess = person.name)}>
        <img src={person.image} />
        <p>{person.name}</p>
      </button>
    {/each}
</div>
  {:else}
    <h2>
      {guess === $state.murderer ? "CORRECT!" : "WRONG!"}<br />The murderer was {$state.murderer}.
    </h2>
  {/if}
</div>

<style>
    .suspects {
        display: grid;
        width: 100%;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 0.5rem;
    }
    button {
        background-color: #eee;
        border: none;
        box-shadow: none;
        padding: 0.25rem;
        cursor: pointer;
    }
    img {
        width: 100%;
    }
</style>
