<script lang="ts">
  import "@fontsource/special-elite";
  import "@fontsource/electrolize";
  import { state } from "$lib/stores";
  import UserInput from "../components/UserInput.svelte";
  import { communicate } from "$lib/communicate";
  import People from "../components/People.svelte";
  import Error from "../components/Error.svelte";
  import ProgressBar from "../components/ProgressBar.svelte";
  import Accuse from "../components/Accuse.svelte";

  let started = false;
  let calmAudio: HTMLAudioElement;
  let tenseAudio: HTMLAudioElement;
  let previousTension = "Calm";

  const start = () => {
    communicate();
    calmAudio = new Audio("/calm.mp3");
    tenseAudio = new Audio("/tense.mp3");
    calmAudio.play();
    tenseAudio.load();
    tenseAudio.pause();
    started = true;
  };

  const handleTension = (tension: "Calm" | "Tense") => {
    if (tension === previousTension) return;
    previousTension = tension;

    if (tension === "Calm") {
      tenseAudio.pause();
      calmAudio.play();
    } else {
      calmAudio.pause();
      tenseAudio.play();
    }
  };

  $: typeof window !== undefined && handleTension($state.tension);

  $: questioning = $state.paragraphs.filter((p) => p.stage === 1);
  $: court = $state.paragraphs.filter((p) => p.stage === 3);
  $: finalVerdict = $state.paragraphs.filter((p) => p.stage === 4);
</script>

<ProgressBar />
<header>
  <h1 class:spin={$state.waitingForAI}>DeepClue</h1>

  <div class="state">
    <p>Room: <span>{$state.room}</span></p>
    <p>Victim: <span>{$state.victim}</span></p>
    <p>Weapon: <span>{$state.weapon}</span></p>
    <p>Questions left: <span>{$state.questions}</span></p>
    <p>
      People talking right now, that should be visualized: <span>{$state.people.join(", ")}</span>
    </p>
    <p>Tension: <span>{$state.tension}</span></p>
  </div>
</header>

<People />

{#if questioning.length}
  <div class="story">
    {#each questioning as { who, text }}
      <p class:you={who === "you"}>{text}</p>
    {/each}
  </div>
{/if}

{#if $state.stage > 1}
  <Accuse />
{/if}

{#if court.length}
  <div class="story">
    {#each court as { who, text }}
      <p class:you={who === "you"}>{text}</p>
    {/each}
  </div>
{/if}

{#if finalVerdict.length}
  <div class="story">
    <h2>Order, order!</h2>
    {#each finalVerdict as { who, text }}
      <p class:you={who === "you"}>{text}</p>
    {/each}
    <h2>The actual murderer was: {$state.murderer}.</h2>
  </div>
{/if}

{#if $state.stage !== 2}
  <UserInput />
{/if}

{#if $state.error}
  <Error />
{/if}

{#if !started}
  <button class="start-button" on:click={start}>Start DeepClue</button>
{/if}

<style>
  :global(*) {
    box-sizing: border-box;
  }
  :global(body) {
    background-color: #111;
    color: #fff;
    font-family: "Electrolize", sans-serif;
    margin: 0;
    line-height: 1.5;
  }
  :global(.story) {
    position: relative;
    background-color: #333d;
    padding: 1rem;
    width: 90%;
    max-width: 60rem;
    margin: 2rem auto 6rem;
    font-size: 1.25rem;
    color: #ddd;
    z-index: 3;
  }
  header {
    position: sticky;
    top: 1.5rem;
  }
  h1 {
    position: absolute;
    top: 0;
    left: 0;
    font-family: "Special Elite", cursive;
    font-size: 5rem;
  }
  h1.spin {
    animation: spin 2s linear infinite;
  }

  .state {
    max-width: 300px;
    margin: 1.5rem 1rem 1rem auto;
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

  .you {
    font-weight: 700;
    color: #fff;
  }

  .start-button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #111;
    color: #fff;
    font-family: "Special Elite", cursive;
    font-size: 4rem;
    border: 0.5rem solid #fff;
    z-index: 99;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 600px) {
    h1 {
      display: none;
    }
    h1.spin {
      display: block;
      z-index: 99;
    }
  }
</style>
