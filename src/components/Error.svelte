<script>
  import { communicate } from "$lib/communicate";
  import { messages, state } from "$lib/stores";
  import { onMount } from "svelte";

  let countdown = 10;

  onMount(() => {
    const interval = setInterval(() => (countdown = countdown - 1), 1000);
    return () => clearInterval(interval);
  });

  const retry = () => {
    communicate($messages);
    $state.error = false;
  };
</script>

<div class="overlay">
  <div class="modal">
    <h1>🤖</h1>
    <h2>Error when communicating with AI</h2>
    <button disabled={countdown > 0} on:click|once={retry}>
      Try again{countdown > 0 ? ` in ${countdown} seconds` : ""}
    </button>
  </div>
</div>

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f009;
    z-index: 9;
  }

  h1 {
    font-size: 8rem;
    margin: 0;
    text-align: center;
  }
  h2 {
    font-size: 2rem;
    text-align: center;
  }
  button {
    display: block;
    font-size: 2rem;
    margin: auto;
    padding: 0.5rem 1rem;
    background-color: #fff;
    color: #000;
    border: none;
    transform: scale(1);
    transition: transform 0.4s ease, color 0.4s ease;
  }
  button:disabled {
    color: #aaa;
    transform: scale(0.75);
  }
</style>
