<script lang="ts">
  import { state } from "$lib/stores";
  import { people } from "$lib/world";

  $: focusClass = (name: string) => $state.people.includes(name);
</script>

<div class="people">
  {#each people.filter(c => c.name !== $state.victim) as person (person.name)}
    <div>
      <img src={person.image} class:focus={focusClass(person.name)} />
      <p>{person.name}</p>
    </div>
  {/each}
</div>

<style>
  .people {
    position: fixed;
    top: 50%;
    left: 0;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 1rem;
    padding: 2rem;
    transform: translate(0, -50%);
  }
  img {
    border-radius: 25%;
    width: 100%;
    transform: scale(1);
    transition: transform 1s ease;
  }
  img.focus {
    transform: scale(2);
    z-index: 2;
    animation: shake 3s linear infinite;
  }
  p {
    color: #777;
    text-align: center;
  }

  @keyframes shake {
    10%,
    90% {
      transform: scale(2) translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: scale(2) translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: scale(2) translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: scale(2) translate3d(4px, 0, 0);
    }
  }
</style>
