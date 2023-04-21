<script lang="ts">
  import { communicate } from "$lib/communicate";
  import { messages, state } from "$lib/stores";
  import { people } from "$lib/world";

  const accuse = (person: string) => {
    $state.accused = person;
    $state.stage = 3;
    setTimeout(() => communicate($messages), 200);
  };
</script>

<div class="story">
  <h2>Time to guess!</h2>
  <p>Who murdered {$state.victim} with a {$state.weapon} in the {$state.room.toLowerCase()}?</p>
  {#if !$state.accused}
    <div class="suspects">
      {#each people.filter((c) => c.name !== $state.victim) as person (person.name)}
        <button on:click={() => accuse(person.name)}>
          <img src={person.image} />
          <p>{person.name}</p>
        </button>
      {/each}
    </div>
  {:else}
    <h2>
      You've chosen to take {$state.accused} to court...
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
